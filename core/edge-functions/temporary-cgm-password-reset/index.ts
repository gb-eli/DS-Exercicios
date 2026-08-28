import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";

const ALLOWED_ORIGINS = new Set(["https://gb-eli.github.io"]);
const SCHOOL_DOMAIN = "@escola.pr.gov.br";
const GENERIC_MESSAGE = "Se os dados informados estiverem corretos, a senha foi redefinida para o CGM. No próximo acesso, o aluno deverá cadastrar uma nova senha.";

const S = (v: unknown, n = 500) => String(v ?? "").trim().slice(0, n);
const normalizeEmail = (v: unknown) => S(v, 180).toLowerCase();
const normalizeCgm = (v: unknown) => S(v, 40).replace(/\D/g, "");

function headers(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://gb-eli.github.io";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Vary": "Origin",
  };
}
function J(req: Request, body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: headers(req) }); }
function requestIp(req: Request) {
  const cf = S(req.headers.get("cf-connecting-ip"), 80); if (cf) return cf;
  const xff = S(req.headers.get("x-forwarded-for"), 240).split(",")[0]?.trim() || ""; return xff || null;
}
async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return [...digest].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function sameSecret(a: string, b: string) {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]); if (ha.length !== hb.length) return false;
  let diff = 0; for (let i = 0; i < ha.length; i++) diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i); return diff === 0;
}
async function hitLimit(db: any, rateKey: string, maxHits: number, windowMs: number, blockMs: number) {
  const now = Date.now(), nowIso = new Date(now).toISOString();
  const { data, error } = await db.from("security_rate_limits").select("rate_key,window_started_at,hit_count,blocked_until").eq("rate_key", rateKey).maybeSingle();
  if (error) throw new Error(`rate_limit_read:${error.message}`);
  if (data?.blocked_until && Date.parse(String(data.blocked_until)) > now) return true;
  const started = data?.window_started_at ? Date.parse(String(data.window_started_at)) : NaN;
  if (!data || !Number.isFinite(started) || now - started >= windowMs) {
    const { error: e } = await db.from("security_rate_limits").upsert({ rate_key: rateKey, window_started_at: nowIso, hit_count: 1, blocked_until: null, updated_at: nowIso }, { onConflict: "rate_key" });
    if (e) throw new Error(`rate_limit_reset:${e.message}`); return false;
  }
  const next = Number(data.hit_count || 0) + 1, blockedUntil = next > maxHits ? new Date(now + blockMs).toISOString() : null;
  const { error: e } = await db.from("security_rate_limits").update({ hit_count: next, blocked_until: blockedUntil, updated_at: nowIso }).eq("rate_key", rateKey);
  if (e) throw new Error(`rate_limit_update:${e.message}`); return Boolean(blockedUntil);
}
async function findInitialCgm(service: any, profile: any, email: string) {
  let prereg: any = null;
  const byClaim = await service.from("student_preregistrations").select("id,cgm,claimed_at,updated_at").eq("active", true).eq("claimed_user_id", profile.id).order("claimed_at", { ascending: false, nullsFirst: false }).order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (byClaim.error) throw new Error(`prereg_claim:${byClaim.error.message}`); prereg = byClaim.data;
  if (!prereg) {
    const byEmail = await service.from("student_preregistrations").select("id,cgm,claimed_at,updated_at").eq("active", true).ilike("institutional_email", email).order("claimed_at", { ascending: false, nullsFirst: false }).order("updated_at", { ascending: false }).limit(1).maybeSingle();
    if (byEmail.error) throw new Error(`prereg_email:${byEmail.error.message}`); prereg = byEmail.data;
  }
  const fromPrereg = normalizeCgm(prereg?.cgm); if (fromPrereg) return { cgm: fromPrereg, source: "student_preregistrations", preregistrationId: prereg?.id || null };
  const fromProfile = normalizeCgm(profile?.cgm); if (fromProfile) return { cgm: fromProfile, source: "profiles", preregistrationId: prereg?.id || null };
  const { data: authData, error: authError } = await service.auth.admin.getUserById(profile.id); if (authError) throw new Error(`auth_user:${authError.message}`);
  const fromMetadata = normalizeCgm(authData?.user?.user_metadata?.cgm); if (fromMetadata) return { cgm: fromMetadata, source: "auth_user_metadata", preregistrationId: prereg?.id || null };
  return { cgm: "", source: "missing", preregistrationId: prereg?.id || null };
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: headers(req) });
  if (req.method !== "POST") return J(req, { error: "method_not_allowed" }, 405);
  const origin = req.headers.get("origin") || ""; if (origin && !ALLOWED_ORIGINS.has(origin)) return J(req, { error: "origin_not_allowed" }, 403);
  try {
    const service = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const body = await req.json().catch(() => ({})), email = normalizeEmail(body.email), cgm = normalizeCgm(body.cgm), ip = requestIp(req);
    if (!email.endsWith(SCHOOL_DOMAIN) || !/^\d{6,12}$/.test(cgm)) return J(req, { ok: true, message: GENERIC_MESSAGE });
    const [ipHash, pairHash] = await Promise.all([sha256(ip || "unknown"), sha256(`${email}|${cgm}`)]);
    const [ipBlocked, pairBlocked] = await Promise.all([hitLimit(service, `pwd_cgm:ip:${ipHash}`, 8, 15 * 60_000, 30 * 60_000), hitLimit(service, `pwd_cgm:pair:${pairHash}`, 4, 30 * 60_000, 30 * 60_000)]);
    if (ipBlocked || pairBlocked) return J(req, { ok: false, error: "rate_limited", message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." }, 429);
    const { data: profile, error: profileError } = await service.from("profiles").select("id,full_name,email,cgm,role,active").ilike("email", email).eq("role", "student").eq("active", true).maybeSingle();
    if (profileError) throw new Error(`profile:${profileError.message}`); if (!profile) return J(req, { ok: true, message: GENERIC_MESSAGE });
    const initial = await findInitialCgm(service, profile, email);
    if (!initial.cgm) {
      await service.from("security_events").insert({ student_id: profile.id, event_type: "temporary_cgm_reset_unavailable", severity: "warning", confidence: "objective", details: { mode: "cgm_fallback", reason: "initial_cgm_missing", resend_pending: true }, ip_address: ip });
      return J(req, { ok: true, message: GENERIC_MESSAGE });
    }
    if (!(await sameSecret(cgm, initial.cgm))) return J(req, { ok: true, message: GENERIC_MESSAGE });
    const now = new Date().toISOString();
    const { error: passwordError } = await service.auth.admin.updateUserById(profile.id, { password: initial.cgm }); if (passwordError) throw new Error(`password_update:${passwordError.message}`);
    const { error: profileUpdateError } = await service.from("profiles").update({ must_change_password: true, updated_at: now }).eq("id", profile.id); if (profileUpdateError) throw new Error(`profile_update:${profileUpdateError.message}`);
    const { data: revoked, error: revokeError } = await service.rpc("admin_revoke_auth_sessions_service", { p_user_id: profile.id }); if (revokeError) throw new Error(`session_revoke:${revokeError.message}`);
    const { data: ended, error: activityError } = await service.from("activity_sessions").update({ ended_at: now, updated_at: now }).eq("student_id", profile.id).is("ended_at", null).select("id"); if (activityError) throw new Error(`activity_session_close:${activityError.message}`);
    await service.from("security_events").insert({ student_id: profile.id, event_type: "temporary_cgm_password_reset", severity: "info", confidence: "objective", details: { mode: "cgm_fallback", reason: "resend_pending", forced_password_change: true, cgm_source: initial.source, revoked_auth_sessions: Number(revoked || 0), ended_activity_sessions: (ended || []).length }, ip_address: ip });
    return J(req, { ok: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("[temporary-cgm-password-reset]", error);
    return J(req, { ok: false, error: "temporary_reset_unavailable", message: "Não foi possível concluir a redefinição agora. Tente novamente em alguns minutos." }, 503);
  }
});
