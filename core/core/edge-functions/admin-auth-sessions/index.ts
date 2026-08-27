import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { requireLiveAuthSession } from "./session-guard.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";

const H = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const J = (x: unknown, s = 200) => new Response(JSON.stringify(x), {
  status: s,
  headers: { ...H, "content-type": "application/json" },
});
const S = (v: unknown, n = 500) => String(v ?? "").trim().slice(0, n);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: H });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const service = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user?.email) return J({ error: "unauthorized" }, 401);
    const live=await requireLiveAuthSession(service,authHeader,user.id);if(!live.ok)return J({error:live.error,detail:live.detail||null},live.status);

    const [{ data: profile }, { data: allow }] = await Promise.all([
      service.from("profiles").select("role,active,must_change_password").eq("id", user.id).maybeSingle(),
      service.from("staff_allowlist").select("role,active").eq("email", user.email.toLowerCase()).eq("active", true).maybeSingle(),
    ]);
    const role = String(allow?.role || profile?.role || "");
    if (!profile?.active || !["admin", "super_admin"].includes(role)) return J({ error: "admin_only" }, 403);
    if (profile.must_change_password) return J({ error: "password_change_required" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = S(body.action, 40);
    const targetUserId = S(body.user_id, 80) || (action === "status" ? user.id : "");
    if (!targetUserId) return J({ error: "user_required" }, 400);

    const { data: target } = await service.from("profiles")
      .select("id,full_name,email,role,active")
      .eq("id", targetUserId)
      .maybeSingle();
    if (!target) return J({ error: "user_not_found" }, 404);

    if (action === "status") {
      const { data, error } = await service.rpc("admin_auth_session_count_service", { p_user_id: targetUserId });
      if (error) return J({ error: "backend_not_ready", detail: error.message }, 503);
      return J({
        ok: true,
        ready: true,
        live_session_guard: true,
        revocation_rpc: true,
        active_auth_sessions: Number(data || 0),
        checked_user_id: targetUserId,
      });
    }

    if (action !== "revoke_all") return J({ error: "unknown_action" }, 400);

    const reason = S(body.reason, 1000) || null;
    const now = new Date().toISOString();
    const { data: revoked, error: revokeError } = await service.rpc("admin_revoke_auth_sessions_service", { p_user_id: targetUserId });
    if (revokeError) return J({ error: "backend_not_ready", detail: revokeError.message }, 503);

    const { data: ended, error: activityError } = await service.from("activity_sessions")
      .update({ ended_at: now, updated_at: now })
      .eq("student_id", targetUserId)
      .is("ended_at", null)
      .select("id");
    if (activityError) return J({ error: "activity_session_close_failed", detail: activityError.message }, 500);

    await service.from("admin_audit_log").insert({
      actor_user_id: user.id,
      action: "auth_sessions_revoked",
      target_user_id: targetUserId,
      payload: {
        reason,
        revoked_auth_sessions: Number(revoked || 0),
        ended_activity_sessions: (ended || []).length,
        target_role: target.role,
      },
    });

    return J({
      ok: true,
      revoked_auth_sessions: Number(revoked || 0),
      ended_activity_sessions: (ended || []).length,
      note: "Refresh sessions foram revogadas. Um access JWT ja emitido pode continuar valido ate exp; use validacao de session_id nos endpoints de maior risco para revogacao imediata.",
    });
  } catch (error) {
    return J({ error: "internal_error", detail: String((error as Error)?.message || error) }, 500);
  }
});
