import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.111.0";
import { requireLiveAuthSession } from "./session-guard.ts";
import { RECOVERY_QUESTIONS } from "./catalog.ts";
import { recoveryReviewNote } from "./review-notes.ts";

const H = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};
const J = (x: unknown, status = 200) =>
  new Response(JSON.stringify(x), { status, headers: { ...H, "Content-Type": "application/json" } });
const now = () => new Date().toISOString();
const id = (v: unknown) => String(v || "").trim();
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const STAFF = ["teacher", "admin", "super_admin"];
const SUBJECTS: Record<string, { name: string; cards: number; stages: number }> = {
  frontend_sub: { name: "Programação Front-End", cards: 9, stages: 3 },
  mobile_sub: { name: "Programação Mobile I", cards: 11, stages: 3 },
};

function elapsed(session: any) {
  if (!session.started_at) return 0;
  const end = session.status === "paused" && session.paused_at ? Date.parse(session.paused_at) : Date.now();
  return Math.max(
    0,
    Math.floor((end - Date.parse(session.started_at)) / 1000) - Number(session.pause_total_seconds || 0),
  );
}
function remaining(session: any, member: any) {
  return Math.max(
    0,
    Number(session.duration_minutes || 0) * 60 +
      Number(member?.extra_time_seconds || 0) -
      elapsed(session),
  );
}
function seeded<T>(arr: T[], seed: number) {
  const out = [...arr];
  let x = (Number(seed) || 1) >>> 0;
  const rnd = () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function complete(q: any, answer: any) {
  if (q.question_type === "single") return !!String(answer?.choice || "");
  if (q.question_type === "order") {
    return answer?.touched === true &&
      Array.isArray(answer?.order) &&
      answer.order.length === Number((q.public_config?.options || []).length);
  }
  if (q.question_type === "match") {
    const items = q.public_config?.options || [];
    const matches = answer?.matches || {};
    return items.length > 0 && items.every((x: any) => !!String(matches[x.id] || ""));
  }
  return false;
}
function grade(q: any, answer: any) {
  if (!complete(q, answer)) return false;
  const correct = q.answer_key?.correct;
  if (q.question_type === "single") return String(answer.choice) === String(correct);
  if (q.question_type === "order") return JSON.stringify(answer.order) === JSON.stringify(correct);
  if (q.question_type === "match") {
    const matches = answer.matches || {};
    return correct &&
      Object.keys(correct).length > 0 &&
      Object.keys(correct).every((key) => String(matches[key] || "") === String(correct[key]));
  }
  return false;
}
function publicQuestion(q: any, seed: number, index: number) {
  const publicConfig = { ...(q.public_config || {}) };
  if (Array.isArray(publicConfig.options)) {
    publicConfig.options = seeded(publicConfig.options, seed + index * 997);
  }
  if (Array.isArray(publicConfig.targets)) {
    publicConfig.targets = seeded(publicConfig.targets, seed + index * 719);
  }
  return {
    id: q.id,
    question_key: q.question_key,
    topic: q.topic,
    prompt: q.prompt,
    question_type: q.question_type,
    points: q.points,
    public_config: publicConfig,
    display_order: q.display_order,
  };
}
async function profile(db: any, userId: string) {
  return (await db.from("profiles")
    .select("id,full_name,email,role,active,must_change_password")
    .eq("id", userId)
    .maybeSingle()).data;
}
async function staffContext(db: any, user: any) {
  const [{ data: p }, { data: allow }] = await Promise.all([
    db.from("profiles").select("id,full_name,email,role,active,must_change_password").eq("id", user.id).maybeSingle(),
    db.from("staff_allowlist").select("role,full_name").eq("email", String(user.email).toLowerCase()).eq("active", true).maybeSingle(),
  ]);
  const role = String(allow?.role || p?.role || "");
  if (!p?.active || p.must_change_password || !STAFF.includes(role)) return null;
  const admin = ["admin", "super_admin"].includes(role);
  const { data: teacherClasses } = admin
    ? { data: [] }
    : await db.from("teacher_classes")
      .select("class_id")
      .eq("teacher_email", String(user.email).toLowerCase())
      .eq("active", true);
  return {
    role,
    admin,
    assigned: admin ? null : (teacherClasses || []).map((x: any) => String(x.class_id)),
    full_name: allow?.full_name || p.full_name,
  };
}
function assertScope(context: any, classId: string) {
  if (!context.admin && !context.assigned.includes(String(classId))) throw new Error("class_out_of_scope");
}
async function sessionForStudent(db: any, sessionId: string, userId: string) {
  const { data: session } = await db.from("recovery_exam_sessions").select("*").eq("id", sessionId).maybeSingle();
  if (!session) return null;
  const { data: membership } = await db.from("class_memberships")
    .select("user_id")
    .eq("class_id", session.class_id)
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();
  return membership ? session : null;
}
async function ensureMember(db: any, session: any, userId: string) {
  let { data: member } = await db.from("recovery_exam_members")
    .select("*")
    .eq("session_id", session.id)
    .eq("student_id", userId)
    .maybeSingle();
  if (!member) {
    const status = session.status === "review" ? "review" : "waiting";
    const inserted = await db.from("recovery_exam_members")
      .insert({ session_id: session.id, student_id: userId, status, last_seen_at: now() })
      .select()
      .single();
    if (inserted.error) throw inserted.error;
    member = inserted.data;
  }
  return member;
}
async function isRecoveryMember(db: any, sessionId: string, studentId: string) {
  const { data, error } = await db.from("recovery_exam_members")
    .select("student_id")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}
async function chatList(db: any, session: any, studentId: string, teacher: boolean) {
  if (teacher) {
    await db.from("recovery_exam_chat_messages")
      .update({ read_by_teacher_at: now() })
      .eq("session_id", session.id)
      .eq("student_id", studentId)
      .eq("sender_role", "student")
      .is("read_by_teacher_at", null);
  } else {
    await db.from("recovery_exam_chat_messages")
      .update({ read_by_student_at: now() })
      .eq("session_id", session.id)
      .eq("student_id", studentId)
      .eq("sender_role", "teacher")
      .is("read_by_student_at", null);
  }
  return (await db.from("recovery_exam_chat_messages")
    .select("id,student_id,sender_id,sender_role,category,message,created_at,read_by_teacher_at,read_by_student_at")
    .eq("session_id", session.id)
    .eq("student_id", studentId)
    .order("created_at", { ascending: true })
    .limit(200)).data || [];
}
async function studentBundle(db: any, session: any, userId: string) {
  const member = await ensureMember(db, session, userId);
  const [{ data: questions }, { data: answers }, { data: interventions }, { count: chatUnread }] = await Promise.all([
    db.from("recovery_exam_questions")
      .select("id,question_key,display_order,topic,prompt,question_type,points,public_config")
      .eq("session_id", session.id)
      .eq("active", true)
      .order("display_order"),
    db.from("recovery_exam_answers")
      .select("question_id,answer,response_ms,updated_at")
      .eq("session_id", session.id)
      .eq("student_id", userId)
      .eq("attempt_no", member.attempt_no),
    db.from("recovery_exam_interventions")
      .select("id,student_id,intervention_type,payload,created_at")
      .eq("session_id", session.id)
      .or(`student_id.is.null,student_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(30),
    db.from("recovery_exam_chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("session_id", session.id)
      .eq("student_id", userId)
      .eq("sender_role", "teacher")
      .is("read_by_student_at", null),
  ]);
  const answerMap = Object.fromEntries((answers || []).map((x: any) => [String(x.question_id), x.answer]));
  const ordered = seeded(questions || [], Number(member.seed || 1));
  const showQuestions = ["running", "paused"].includes(session.status) || member.status === "finished";
  return {
    session: {
      id: session.id,
      title: session.title,
      subject_key: session.subject_key,
      subject_name: session.subject_name,
      description: session.description,
      status: session.status,
      max_score: session.max_score,
      duration_minutes: session.duration_minutes,
      review_required: session.review_required,
      review_card_count: session.review_card_count,
      review_card_index: session.review_card_index || 0,
      review_stage_index: session.review_stage_index || 0,
      review_revision: session.review_revision || 0,
      review_started_at: session.review_started_at,
      review_ended_at: session.review_ended_at,
      global_message: session.global_message,
      global_effect: session.global_effect,
      global_effect_at: session.global_effect_at,
      double_xp_until: session.double_xp_until,
    },
    member: {
      status: member.status,
      review_completed_at: member.review_completed_at,
      current_question: member.current_question,
      attempt_no: member.attempt_no,
      max_attempts: member.max_attempts,
      extra_time_seconds: member.extra_time_seconds,
      accommodation: member.accommodation,
      submitted_at: member.submitted_at,
      score: session.status === "published" ? member.score : null,
      correct_count: session.status === "published" ? member.correct_count : null,
      answered_count: member.answered_count,
      xp: member.xp,
      focus_loss_count: member.focus_loss_count,
      fullscreen_exit_count: member.fullscreen_exit_count,
      remaining_seconds: remaining(session, member),
    },
    questions: showQuestions ? ordered.map((q: any, i: number) => publicQuestion(q, Number(member.seed || 1), i)) : [],
    answers: answerMap,
    interventions: interventions || [],
    chat_unread: Number(chatUnread || 0),
  };
}
async function metrics(db: any, session: any) {
  const [{ data: members }, { data: classMemberships }, { data: answers }, { data: questions }, { data: chats }] =
    await Promise.all([
      db.from("recovery_exam_members").select("*").eq("session_id", session.id),
      db.from("class_memberships").select("user_id").eq("class_id", session.class_id).eq("active", true),
      db.from("recovery_exam_answers").select("student_id,question_id,attempt_no,is_correct,response_ms").eq("session_id", session.id),
      db.from("recovery_exam_questions")
        .select("id,question_key,display_order,topic,prompt,points")
        .eq("session_id", session.id)
        .eq("active", true)
        .order("display_order"),
      db.from("recovery_exam_chat_messages")
        .select("student_id,sender_role,read_by_teacher_at")
        .eq("session_id", session.id),
    ]);
  const ids = (classMemberships || []).map((x: any) => x.user_id);
  const { data: profiles } = ids.length
    ? await db.from("profiles")
      .select("id,full_name,email,role,active")
      .in("id", ids)
      .eq("role", "student")
      .eq("active", true)
      .order("full_name")
    : { data: [] };
  const memberMap = new Map((members || []).map((x: any) => [String(x.student_id), x]));
  const attemptMap = new Map((members || []).map((x: any) => [String(x.student_id), Number(x.attempt_no || 1)]));
  const currentAnswers = (answers || []).filter(
    (x: any) => Number(x.attempt_no) === Number(attemptMap.get(String(x.student_id)) || 1),
  );
  const unreadMap = new Map<string, number>();
  for (const x of chats || []) {
    if (x.sender_role === "student" && !x.read_by_teacher_at) {
      unreadMap.set(String(x.student_id), Number(unreadMap.get(String(x.student_id)) || 0) + 1);
    }
  }
  const rows = (profiles || []).map((p: any) => {
    const m: any = memberMap.get(String(p.id));
    const current = currentAnswers.filter((x: any) => String(x.student_id) === String(p.id));
    const times = current.map((x: any) => Number(x.response_ms || 0)).filter((x: number) => x > 0);
    return {
      student_id: p.id,
      full_name: p.full_name,
      email: p.email,
      status: m?.status || "not_started",
      review_completed_at: m?.review_completed_at || null,
      current_question: m?.current_question || 1,
      attempt_no: m?.attempt_no || 1,
      max_attempts: m?.max_attempts || 1,
      extra_time_seconds: m?.extra_time_seconds || 0,
      accommodation: m?.accommodation || {},
      last_seen_at: m?.last_seen_at || null,
      online: !!(m?.last_seen_at && Date.now() - Date.parse(m.last_seen_at) < 45000),
      score: m?.score,
      correct_count: m?.correct_count || 0,
      answered_count: m?.answered_count || 0,
      xp: m?.xp || 0,
      focus_loss_count: m?.focus_loss_count || 0,
      fullscreen_exit_count: m?.fullscreen_exit_count || 0,
      avg_response_ms: times.length ? Math.round(times.reduce((a: number, b: number) => a + b, 0) / times.length) : 0,
      remaining_seconds: m ? remaining(session, m) : Number(session.duration_minutes) * 60,
      unread_chat: Number(unreadMap.get(String(p.id)) || 0),
    };
  });
  const qstats = (questions || []).map((q: any) => {
    const valid = currentAnswers.filter(
      (a: any) => String(a.question_id) === String(q.id) && a.is_correct !== null,
    );
    const correct = valid.filter((a: any) => a.is_correct === true).length;
    const times = valid.map((a: any) => Number(a.response_ms || 0)).filter((x: number) => x > 0);
    return {
      ...q,
      answered: valid.length,
      correct,
      accuracy: valid.length ? Math.round(correct / valid.length * 100) : 0,
      avg_response_ms: times.length ? Math.round(times.reduce((a: number, b: number) => a + b, 0) / times.length) : 0,
    };
  });
  const started = rows.filter((r: any) => ["running", "finished"].includes(r.status));
  return {
    rows,
    questions: qstats,
    kpis: {
      students: rows.length,
      online: rows.filter((r: any) => r.online).length,
      running: rows.filter((r: any) => r.status === "running").length,
      review: rows.filter((r: any) => r.status === "review").length,
      finished: rows.filter((r: any) => r.status === "finished").length,
      avg_score: started.length
        ? started.reduce((sum: number, r: any) => sum + Number(r.score || 0), 0) / started.length
        : 0,
      unread_chat: rows.reduce((sum: number, r: any) => sum + Number(r.unread_chat || 0), 0),
    },
  };
}
async function event(db: any, values: any) {
  const { error } = await db.from("recovery_exam_events").insert(values);
  if (error) console.error("event_log_failed", error.message);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: H });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const authorization = req.headers.get("Authorization") || "";
    const authClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authorization } },
    });
    const db = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) return J({ error: "unauthorized" }, 401);
    const live = await requireLiveAuthSession(db, authorization, user.id);
    if (!live.ok) return J({ error: live.error }, live.status);
    const p = await profile(db, user.id);
    if (!p?.active || p.must_change_password) return J({ error: "forbidden" }, 403);
    const body = await req.json().catch(() => ({}));
    const action = String(body.action || "student_state");

    if (action === "student_state") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const sessionId = id(body.session_id);
      if (!sessionId) {
        const { data: memberships } = await db.from("class_memberships")
          .select("class_id")
          .eq("user_id", user.id)
          .eq("active", true);
        const classIds = (memberships || []).map((x: any) => String(x.class_id));
        if (!classIds.length) return J({ profile: { full_name: p.full_name }, sessions: [] });
        const { data: sessions } = await db.from("recovery_exam_sessions")
          .select("id,class_id,subject_key,subject_name,title,status,max_score,duration_minutes,created_at")
          .in("class_id", classIds)
          .in("status", ["review", "waiting", "running", "paused", "finished", "published"])
          .order("created_at", { ascending: false })
          .limit(10);
        return J({ profile: { full_name: p.full_name }, sessions: sessions || [] });
      }
      const session = await sessionForStudent(db, sessionId, user.id);
      return session ? J(await studentBundle(db, session, user.id)) : J({ error: "out_of_scope" }, 403);
    }

    if (action === "start_exam") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const session = await sessionForStudent(db, id(body.session_id), user.id);
      if (!session) return J({ error: "out_of_scope" }, 403);
      if (session.status !== "running") return J({ error: "exam_not_running" }, 409);
      const member = await ensureMember(db, session, user.id);
      if (session.review_required && !member.review_completed_at) return J({ error: "review_required" }, 409);
      if (["finished", "removed"].includes(member.status)) return J({ error: "attempt_locked" }, 409);
      const { error } = await db.from("recovery_exam_members")
        .update({
          status: "running",
          started_at: member.started_at || now(),
          last_seen_at: now(),
          updated_at: now(),
        })
        .eq("session_id", session.id)
        .eq("student_id", user.id);
      if (error) throw error;
      await event(db, {
        session_id: session.id,
        student_id: user.id,
        actor_id: user.id,
        event_type: "exam_started",
        metadata: { attempt_no: member.attempt_no },
      });
      return J({ ok: true });
    }

    if (action === "save_answer") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const session = await sessionForStudent(db, id(body.session_id), user.id);
      if (!session || session.status !== "running") return J({ error: "exam_not_running" }, 409);
      const member = await ensureMember(db, session, user.id);
      if (member.status !== "running" || remaining(session, member) <= 0) return J({ error: "attempt_locked" }, 409);
      const { data: q } = await db.from("recovery_exam_questions")
        .select("*")
        .eq("id", id(body.question_id))
        .eq("session_id", session.id)
        .eq("active", true)
        .maybeSingle();
      if (!q) return J({ error: "question_not_found" }, 404);
      const answer = body.answer && typeof body.answer === "object" ? body.answer : {};
      const isComplete = complete(q, answer);
      const isCorrect = isComplete ? grade(q, answer) : null;
      const { error } = await db.from("recovery_exam_answers").upsert({
        session_id: session.id,
        student_id: user.id,
        question_id: q.id,
        attempt_no: member.attempt_no,
        answer,
        is_correct: isCorrect,
        score: isCorrect === true ? Number(q.points) : 0,
        response_ms: clamp(Number(body.response_ms || 0), 0, 3600000),
        updated_at: now(),
      }, { onConflict: "session_id,student_id,question_id,attempt_no" });
      if (error) throw error;

      const [{ data: allAnswers }, { data: allQuestions }] = await Promise.all([
        db.from("recovery_exam_answers")
          .select("question_id,answer")
          .eq("session_id", session.id)
          .eq("student_id", user.id)
          .eq("attempt_no", member.attempt_no),
        db.from("recovery_exam_questions")
          .select("id,question_type,public_config")
          .eq("session_id", session.id)
          .eq("active", true),
      ]);
      const qmap = new Map((allQuestions || []).map((x: any) => [String(x.id), x]));
      const answeredCount = (allAnswers || []).filter((x: any) => {
        const qq = qmap.get(String(x.question_id));
        return qq && complete(qq, x.answer);
      }).length;
      await db.from("recovery_exam_members")
        .update({
          answered_count: answeredCount,
          current_question: clamp(Number(body.current_question || member.current_question), 1, 20),
          last_seen_at: now(),
          updated_at: now(),
        })
        .eq("session_id", session.id)
        .eq("student_id", user.id);
      return J({ ok: true, saved: true, answered_count: answeredCount });
    }

    if (action === "submit_exam") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const session = await sessionForStudent(db, id(body.session_id), user.id);
      if (!session) return J({ error: "out_of_scope" }, 403);
      const member = await ensureMember(db, session, user.id);
      if (session.status !== "running" || member.status !== "running") {
        return J({ error: "attempt_locked" }, 409);
      }
      const { data: rows } = await db.from("recovery_exam_answers")
        .select("is_correct,score")
        .eq("session_id", session.id)
        .eq("student_id", user.id)
        .eq("attempt_no", member.attempt_no);
      const valid = (rows || []).filter((x: any) => x.is_correct !== null);
      const correctCount = valid.filter((x: any) => x.is_correct === true).length;
      const answeredCount = valid.length;
      const score = Number(valid.reduce((sum: number, x: any) => sum + Number(x.score || 0), 0).toFixed(2));
      const doubleXp = !!(session.double_xp_until && Date.parse(session.double_xp_until) > Date.now());
      const xp = correctCount * 10 * (doubleXp ? 2 : 1) + 20;
      const { error } = await db.from("recovery_exam_members")
        .update({
          status: "finished",
          submitted_at: now(),
          score,
          correct_count: correctCount,
          answered_count: answeredCount,
          xp,
          last_seen_at: now(),
          updated_at: now(),
        })
        .eq("session_id", session.id)
        .eq("student_id", user.id);
      if (error) throw error;
      await db.from("recovery_exam_answers")
        .update({ submitted_at: now() })
        .eq("session_id", session.id)
        .eq("student_id", user.id)
        .eq("attempt_no", member.attempt_no);
      await event(db, {
        session_id: session.id,
        student_id: user.id,
        actor_id: user.id,
        event_type: "exam_submitted",
        metadata: { attempt_no: member.attempt_no, answered: answeredCount, score },
      });
      return J({ ok: true, submitted: true });
    }

    if (action === "heartbeat" || action === "student_event") {
      if (p.role !== "student") return J({ error: "student_only" }, 403);
      const session = await sessionForStudent(db, id(body.session_id), user.id);
      if (!session) return J({ error: "out_of_scope" }, 403);
      const member = await ensureMember(db, session, user.id);
      const eventType = action === "heartbeat" ? "heartbeat" : String(body.event_type || "event").slice(0, 80);
      const patch: any = {
        last_seen_at: now(),
        updated_at: now(),
        current_question: clamp(Number(body.current_question || member.current_question || 1), 1, 20),
      };
      if (eventType === "focus_lost") patch.focus_loss_count = Number(member.focus_loss_count || 0) + 1;
      if (eventType === "fullscreen_exit") patch.fullscreen_exit_count = Number(member.fullscreen_exit_count || 0) + 1;
      const { error } = await db.from("recovery_exam_members")
        .update(patch)
        .eq("session_id", session.id)
        .eq("student_id", user.id);
      if (error) throw error;
      if (eventType !== "heartbeat") {
        await event(db, {
          session_id: session.id,
          student_id: user.id,
          actor_id: user.id,
          event_type: eventType,
          metadata: body.metadata || {},
        });
      }
      return J({ ok: true });
    }

    if ((action === "chat_list" || action === "chat_send") && p.role === "student") {
      const session = await sessionForStudent(db, id(body.session_id), user.id);
      if (!session) return J({ error: "out_of_scope" }, 403);
      if (action === "chat_send") {
        if (!["review", "waiting", "running", "paused", "finished"].includes(session.status)) {
          return J({ error: "chat_unavailable" }, 409);
        }
        const message = String(body.message || "").trim().slice(0, 800);
        const category = ["question", "technical", "guidance"].includes(String(body.category))
          ? String(body.category)
          : "message";
        if (!message) return J({ error: "empty_message" }, 400);
        const { error } = await db.from("recovery_exam_chat_messages").insert({
          session_id: session.id,
          student_id: user.id,
          sender_id: user.id,
          sender_role: "student",
          category,
          message,
          read_by_student_at: now(),
        });
        if (error) throw error;
      }
      return J({ messages: await chatList(db, session, user.id, false) });
    }

    const staff = await staffContext(db, user);
    if (!staff) return J({ error: "staff_only" }, 403);

    if (action === "staff_overview") {
      let sessionQuery = db.from("recovery_exam_sessions").select("*").order("created_at", { ascending: false }).limit(50);
      if (!staff.admin) sessionQuery = sessionQuery.in("class_id", staff.assigned);
      const { data: sessions } = await sessionQuery;
      let classQuery = db.from("classes").select("id,code,name,shift").eq("active", true).order("name");
      if (!staff.admin) classQuery = classQuery.in("id", staff.assigned);
      const { data: classes } = await classQuery;
      const sessionId = id(body.session_id);
      let detail: any = null;
      if (sessionId) {
        const session = (sessions || []).find((x: any) => String(x.id) === sessionId) ||
          (await db.from("recovery_exam_sessions").select("*").eq("id", sessionId).maybeSingle()).data;
        if (session) {
          assertScope(staff, session.class_id);
          detail = {
            session: {
              ...session,
              remaining_seconds: remaining(session, null),
              review_teacher_note: recoveryReviewNote(
                session.subject_key,
                Number(session.review_card_index || 0),
                Number(session.review_stage_index || 0),
              ),
            },
            metrics: await metrics(db, session),
          };
          const { data: events } = await db.from("recovery_exam_events")
            .select("id,student_id,actor_id,event_type,metadata,occurred_at")
            .eq("session_id", session.id)
            .order("occurred_at", { ascending: false })
            .limit(120);
          detail.events = events || [];
        }
      }
      return J({
        staff,
        classes: classes || [],
        sessions: sessions || [],
        templates: Object.entries(SUBJECTS).map(([key, value]) => ({ key, ...value })),
        detail,
      });
    }

    if (action === "create_session") {
      const classId = id(body.class_id);
      const subjectKey = String(body.subject_key || "");
      if (!classId || !SUBJECTS[subjectKey]) return J({ error: "invalid_parameters" }, 400);
      assertScope(staff, classId);
      const config = SUBJECTS[subjectKey];
      const list = RECOVERY_QUESTIONS.filter((x: any) => x.subject === subjectKey);
      if (list.length !== 20 || Math.abs(list.reduce((sum: number, x: any) => sum + Number(x.points || 0), 0) - 5) > .001) {
        return J({ error: "invalid_question_catalog" }, 500);
      }
      const inserted = await db.from("recovery_exam_sessions").insert({
        class_id: classId,
        subject_key: subjectKey,
        subject_name: config.name,
        title: String(body.title || `Recuperação — ${config.name}`).slice(0, 180),
        description: String(body.description || "Retomada coletiva sincronizada seguida de prova individual sem consulta.").slice(0, 1000),
        status: "draft",
        max_score: 5,
        duration_minutes: clamp(Number(body.duration_minutes || 40), 10, 180),
        review_card_count: config.cards,
        review_card_index: 0,
        review_stage_index: 0,
        review_revision: 0,
        created_by: user.id,
      }).select().single();
      if (inserted.error) throw inserted.error;
      const questionRows = list.map((x: any, i: number) => ({
        session_id: inserted.data.id,
        question_key: x.key,
        display_order: i + 1,
        topic: x.topic,
        prompt: x.prompt,
        question_type: x.type,
        points: .25,
        public_config: { options: x.options, visual: x.visual || null, targets: x.visual?.targets || null },
        answer_key: { correct: x.correct },
        hint: x.hint,
        explanation: x.explanation,
      }));
      const qInsert = await db.from("recovery_exam_questions").insert(questionRows);
      if (qInsert.error) throw qInsert.error;

      const { data: memberships } = await db.from("class_memberships")
        .select("user_id")
        .eq("class_id", classId)
        .eq("active", true);
      const ids = (memberships || []).map((x: any) => x.user_id);
      const { data: students } = ids.length
        ? await db.from("profiles").select("id").in("id", ids).eq("role", "student").eq("active", true)
        : { data: [] };
      if (students?.length) {
        const membersInsert = await db.from("recovery_exam_members").insert(
          students.map((x: any) => ({ session_id: inserted.data.id, student_id: x.id, status: "waiting" })),
        );
        if (membersInsert.error) throw membersInsert.error;
      }
      await event(db, {
        session_id: inserted.data.id,
        actor_id: user.id,
        event_type: "session_created",
        metadata: { subject_key: subjectKey },
      });
      return J({ ok: true, session: inserted.data });
    }

    if (action === "review_control") {
      const sessionId = id(body.session_id);
      const { data: session } = await db.from("recovery_exam_sessions").select("*").eq("id", sessionId).maybeSingle();
      if (!session) return J({ error: "not_found" }, 404);
      assertScope(staff, session.class_id);
      if (session.status !== "review") return J({ error: "review_not_running" }, 409);
      const config = SUBJECTS[session.subject_key];
      let card = Number(session.review_card_index || 0);
      let stage = Number(session.review_stage_index || 0);
      if (body.command === "next") {
        if (stage < config.stages - 1) stage++;
        else if (card < config.cards - 1) { card++; stage = 0; }
      } else if (body.command === "prev") {
        if (stage > 0) stage--;
        else if (card > 0) { card--; stage = config.stages - 1; }
      } else if (body.command === "goto") {
        card = clamp(Number(body.card_index || 0), 0, config.cards - 1);
        stage = clamp(Number(body.stage_index || 0), 0, config.stages - 1);
      } else return J({ error: "invalid_review_command" }, 400);

      const updated = await db.from("recovery_exam_sessions")
        .update({
          review_card_index: card,
          review_stage_index: stage,
          review_revision: Number(session.review_revision || 0) + 1,
          updated_at: now(),
        })
        .eq("id", sessionId)
        .select()
        .single();
      if (updated.error) throw updated.error;
      return J({ ok: true, session: updated.data });
    }

    if (action === "session_control") {
      const sessionId = id(body.session_id);
      const command = String(body.command || "");
      const { data: session } = await db.from("recovery_exam_sessions").select("*").eq("id", sessionId).maybeSingle();
      if (!session) return J({ error: "not_found" }, 404);
      assertScope(staff, session.class_id);
      const patch: any = { updated_at: now() };

      if (command === "start_review" && ["draft", "waiting"].includes(session.status)) {
        Object.assign(patch, {
          status: "review",
          review_card_index: 0,
          review_stage_index: 0,
          review_revision: Number(session.review_revision || 0) + 1,
          review_started_at: now(),
          review_ended_at: null,
        });
        await db.from("recovery_exam_members")
          .update({ status: "review", review_completed_at: null, updated_at: now() })
          .eq("session_id", sessionId)
          .neq("status", "removed");
      } else if (command === "end_review" && session.status === "review") {
        Object.assign(patch, {
          status: "waiting",
          review_ended_at: now(),
          review_revision: Number(session.review_revision || 0) + 1,
        });
        await db.from("recovery_exam_members")
          .update({ status: "waiting", review_completed_at: now(), updated_at: now() })
          .eq("session_id", sessionId)
          .neq("status", "removed");
      } else if (command === "start" && session.status === "waiting") {
        if (session.review_required && !session.review_ended_at) return J({ error: "review_not_finished" }, 409);
        Object.assign(patch, { status: "running", started_at: session.started_at || now(), paused_at: null });
      } else if (command === "pause" && session.status === "running") {
        Object.assign(patch, { status: "paused", paused_at: now() });
      } else if (command === "resume" && session.status === "paused") {
        Object.assign(patch, {
          status: "running",
          pause_total_seconds: Number(session.pause_total_seconds || 0) +
            (session.paused_at ? Math.floor((Date.now() - Date.parse(session.paused_at)) / 1000) : 0),
          paused_at: null,
        });
      } else if (command === "add_time" && ["running", "paused"].includes(session.status)) {
        patch.duration_minutes = Number(session.duration_minutes) + clamp(Number(body.minutes || 5), 1, 60);
      } else if (command === "finish" && ["running", "paused", "waiting"].includes(session.status)) {
        Object.assign(patch, { status: "finished", finished_at: now(), paused_at: null });
      } else if (command === "reopen_session" && session.status === "finished") {
        Object.assign(patch, {
          status: "running",
          started_at: now(),
          pause_total_seconds: 0,
          finished_at: null,
          published_at: null,
          paused_at: null,
        });
      } else if (command === "publish" && session.status === "finished") {
        Object.assign(patch, { status: "published", published_at: now() });
      } else if (command === "cancel" && session.status !== "published") {
        patch.status = "cancelled";
      } else return J({ error: "invalid_transition" }, 409);

      const updated = await db.from("recovery_exam_sessions").update(patch).eq("id", sessionId).select().single();
      if (updated.error) throw updated.error;
      await event(db, { session_id: sessionId, actor_id: user.id, event_type: `session_${command}`, metadata: {} });
      return J({ ok: true, session: updated.data });
    }

    if (action === "chat_list" || action === "chat_send") {
      const sessionId = id(body.session_id);
      const studentId = id(body.student_id);
      const { data: session } = await db.from("recovery_exam_sessions").select("*").eq("id", sessionId).maybeSingle();
      if (!session) return J({ error: "not_found" }, 404);
      assertScope(staff, session.class_id);
      if (!studentId) return J({ error: "student_required" }, 400);
      if (!await isRecoveryMember(db, sessionId, studentId)) return J({ error: "member_not_found" }, 404);
      if (action === "chat_send") {
        const message = String(body.message || "").trim().slice(0, 800);
        const category = ["question", "technical", "guidance"].includes(String(body.category))
          ? String(body.category)
          : "message";
        if (!message) return J({ error: "empty_message" }, 400);
        const { error } = await db.from("recovery_exam_chat_messages").insert({
          session_id: sessionId,
          student_id: studentId,
          sender_id: user.id,
          sender_role: "teacher",
          category,
          message,
          read_by_teacher_at: now(),
        });
        if (error) throw error;
      }
      return J({ messages: await chatList(db, session, studentId, true) });
    }

    if (action === "broadcast") {
      const sessionId = id(body.session_id);
      const { data: session } = await db.from("recovery_exam_sessions").select("*").eq("id", sessionId).maybeSingle();
      if (!session) return J({ error: "not_found" }, 404);
      assertScope(staff, session.class_id);
      const type = String(body.type || "message");
      const studentId = body.student_id ? id(body.student_id) : null;
      const payload = body.payload || {};
      if (studentId && !await isRecoveryMember(db, sessionId, studentId)) {
        return J({ error: "member_not_found" }, 404);
      }
      if (type === "message" && !studentId) {
        await db.from("recovery_exam_sessions")
          .update({ global_message: String(payload.text || "").slice(0, 500), updated_at: now() })
          .eq("id", sessionId);
      }
      if (type === "effect" && !studentId) {
        await db.from("recovery_exam_sessions")
          .update({
            global_effect: String(payload.effect || "attention").slice(0, 40),
            global_effect_at: now(),
            updated_at: now(),
          })
          .eq("id", sessionId);
      }
      if (type === "double_xp" && !studentId) {
        await db.from("recovery_exam_sessions")
          .update({
            double_xp_until: new Date(Date.now() + clamp(Number(payload.minutes || 10), 1, 60) * 60000).toISOString(),
            updated_at: now(),
          })
          .eq("id", sessionId);
      }
      const interventionType = type === "double_xp" ? "double_xp" : type;
      const { error } = await db.from("recovery_exam_interventions").insert({
        session_id: sessionId,
        student_id: studentId,
        intervention_type: interventionType,
        payload,
        created_by: user.id,
      });
      if (error) throw error;
      return J({ ok: true });
    }

    if (action === "member_action") {
      const sessionId = id(body.session_id);
      const studentId = id(body.student_id);
      const command = String(body.command || "");
      const { data: session } = await db.from("recovery_exam_sessions").select("*").eq("id", sessionId).maybeSingle();
      if (!session) return J({ error: "not_found" }, 404);
      assertScope(staff, session.class_id);
      const { data: member } = await db.from("recovery_exam_members")
        .select("*")
        .eq("session_id", sessionId)
        .eq("student_id", studentId)
        .maybeSingle();
      if (!member) return J({ error: "member_not_found" }, 404);

      const patch: any = { updated_at: now() };
      let interventionType = command;
      let payload: any = {};
      if (command === "add_time") {
        const seconds = clamp(Number(body.minutes || 5), 1, 120) * 60;
        patch.extra_time_seconds = Number(member.extra_time_seconds || 0) + seconds;
        payload = { seconds };
        interventionType = "extra_time";
      } else if (command === "add_attempt") {
        patch.max_attempts = clamp(Number(member.max_attempts || 1) + 1, 1, 10);
        payload = { max_attempts: patch.max_attempts };
        interventionType = "extra_attempt";
      } else if (command === "reopen") {
        if (Number(member.attempt_no) >= Number(member.max_attempts)) return J({ error: "no_attempt_available" }, 409);
        Object.assign(patch, {
          attempt_no: Number(member.attempt_no) + 1,
          status: session.status === "running" ? "running" : "waiting",
          submitted_at: null,
          score: null,
          correct_count: 0,
          answered_count: 0,
          current_question: 1,
          started_at: session.status === "running" ? now() : null,
        });
        interventionType = "reopen";
        payload = { attempt_no: patch.attempt_no };
      } else if (command === "remove") {
        patch.status = "removed";
        interventionType = "remove";
      } else if (command === "restore") {
        patch.status = session.status === "review" ? "review" : "waiting";
        interventionType = "reopen";
      } else if (command === "accommodation") {
        patch.accommodation = { ...(member.accommodation || {}), ...(body.accommodation || {}) };
        payload = patch.accommodation;
        interventionType = "accommodation";
      } else return J({ error: "invalid_member_action" }, 400);

      const updated = await db.from("recovery_exam_members")
        .update(patch)
        .eq("session_id", sessionId)
        .eq("student_id", studentId);
      if (updated.error) throw updated.error;
      const intervention = await db.from("recovery_exam_interventions").insert({
        session_id: sessionId,
        student_id: studentId,
        intervention_type: interventionType,
        payload,
        created_by: user.id,
      });
      if (intervention.error) throw intervention.error;
      await event(db, {
        session_id: sessionId,
        student_id: studentId,
        actor_id: user.id,
        event_type: `teacher_${command}`,
        metadata: payload,
      });
      return J({ ok: true });
    }

    return J({ error: "unknown_action" }, 400);
  } catch (e) {
    console.error(e);
    return J({ error: String((e as any)?.message || e) }, 500);
  }
});
