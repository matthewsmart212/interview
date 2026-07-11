/**
 * Sync local app state ↔ Supabase when the user is authenticated.
 * Local-first: screens keep using lib/db; this layer mirrors when online.
 */

import { createClient } from "./client";
import type { AppState } from "../db/types";
import { getState, setState } from "../db/store";
import { buildEmptyState } from "../db/seed";

export async function getSessionUser() {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function signOut() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    /* ignore */
  }
}

function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

/** Push current local state to Supabase for the signed-in user. */
export async function pushLocalToSupabase(
  state?: AppState
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return { ok: false, error: "Not signed in" };

    const s = state || getState();
    const now = new Date().toISOString();

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      name: s.user.name || "",
      goal: s.user.goal,
      preferences: s.user.preferences,
      streak: s.user.streak || 0,
      onboarding_completed_at: s.user.onboardingCompletedAt
        ? new Date(s.user.onboardingCompletedAt).toISOString()
        : null,
      updated_at: now,
    });
    if (profileError) return { ok: false, error: profileError.message };

    if (s.masterCv?.exists) {
      const { error: cvError } = await supabase.from("master_cvs").upsert(
        {
          user_id: user.id,
          exists: true,
          source: s.masterCv.source,
          file_name: s.masterCv.fileName,
          updated_at: s.masterCv.updatedAt,
          score: s.masterCv.score,
          summary: s.masterCv.summary,
          sections: s.masterCv.sections,
        },
        { onConflict: "user_id" }
      );
      if (cvError) return { ok: false, error: cvError.message };
    }

    await supabase.from("interviews").delete().eq("user_id", user.id);
    if (s.interviews?.length) {
      const rows = s.interviews.map((iv) => ({
        ...(isUuid(iv.id) ? { id: iv.id } : {}),
        user_id: user.id,
        role: iv.role,
        company: iv.company,
        initials: iv.initials,
        accent: iv.accent,
        type: iv.type,
        date: iv.date,
        date_chip: iv.dateChip,
        days_away: iv.daysAway,
        status: iv.status,
        outcome: iv.outcome ?? null,
        readiness: iv.readiness,
        has_jd: iv.hasJD,
        jd: iv.jd,
        jd_highlights: iv.jdHighlights,
        tailored_cv: iv.tailoredCv,
        mock_ids: iv.mockIds,
        updated_at: now,
      }));
      const { error: ivError } = await supabase.from("interviews").insert(rows);
      if (ivError) return { ok: false, error: ivError.message };
    }

    await supabase.from("mock_sessions").delete().eq("user_id", user.id);
    if (s.mockSessions?.length) {
      const rows = s.mockSessions.map((m) => ({
        ...(isUuid(m.id) ? { id: m.id } : {}),
        user_id: user.id,
        interview_id: m.interviewId && isUuid(m.interviewId) ? m.interviewId : null,
        context_mode: m.contextMode,
        context_label: m.contextLabel,
        role: m.role,
        company: m.company,
        date: m.date,
        time: m.time,
        score: m.score,
        headline: m.headline,
        questions: m.questions,
        duration_min: m.durationMin,
        best: m.best,
        weakest: m.weakest,
        skills: m.skills,
        feedback: m.feedback ?? null,
        answers: m.answers ?? null,
        completed_at: new Date(m.completedAt).toISOString(),
      }));
      const { error: mockError } = await supabase.from("mock_sessions").insert(rows);
      if (mockError) return { ok: false, error: mockError.message };
    }

    await supabase.from("saved_questions").delete().eq("user_id", user.id);
    if (s.savedQuestionIds?.length) {
      const { error: sqError } = await supabase.from("saved_questions").insert(
        s.savedQuestionIds.map((question_id) => ({
          user_id: user.id,
          question_id,
        }))
      );
      if (sqError) return { ok: false, error: sqError.message };
    }

    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return { ok: false, error: message };
  }
}

/** Pull remote profile into local store. */
export async function pullSupabaseToLocal(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return { ok: false, error: "Not signed in" };

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    if (profileError) return { ok: false, error: profileError.message };

    const { data: masterCv } = await supabase
      .from("master_cvs")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: interviews } = await supabase
      .from("interviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: cvHistory } = await supabase
      .from("cv_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: mocks } = await supabase
      .from("mock_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    const { data: savedQuestions } = await supabase
      .from("saved_questions")
      .select("question_id")
      .eq("user_id", user.id);

    const empty = buildEmptyState();
    const next: AppState = {
      ...empty,
      user: {
        id: user.id,
        name:
          profile?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "",
        goal: profile?.goal ?? null,
        preferences: profile?.preferences || empty.user.preferences,
        streak: profile?.streak || 0,
        onboardingCompletedAt: profile?.onboarding_completed_at
          ? Date.parse(profile.onboarding_completed_at)
          : null,
        createdAt: profile?.created_at
          ? Date.parse(profile.created_at)
          : Date.now(),
        updatedAt: Date.now(),
      },
      masterCv: masterCv
        ? {
            id: "master-cv",
            exists: Boolean(masterCv.exists),
            source: masterCv.source,
            fileName: masterCv.file_name || "",
            updatedAt: masterCv.updated_at || "",
            score: masterCv.score || 0,
            summary: masterCv.summary || "",
            sections: masterCv.sections || {
              experience: [],
              education: [],
              skills: [],
            },
          }
        : empty.masterCv,
      cvHistory: (cvHistory || []).map((h) => ({
        id: h.id,
        fileName: h.file_name,
        uploadedAt: h.uploaded_at,
        score: h.score,
        current: Boolean(h.is_current),
      })),
      interviews: (interviews || []).map((iv) => ({
        id: iv.id,
        role: iv.role,
        company: iv.company,
        initials: iv.initials,
        accent: iv.accent,
        type: iv.type,
        date: iv.date,
        dateChip: iv.date_chip,
        daysAway: iv.days_away,
        status: iv.status,
        outcome: iv.outcome ?? undefined,
        readiness: iv.readiness,
        hasJD: Boolean(iv.has_jd),
        jd: iv.jd,
        jdHighlights: iv.jd_highlights || [],
        tailoredCv: iv.tailored_cv || { exists: false },
        mockIds: iv.mock_ids || [],
        createdAt: iv.created_at ? Date.parse(iv.created_at) : Date.now(),
        updatedAt: iv.updated_at ? Date.parse(iv.updated_at) : Date.now(),
      })),
      mockSessions: (mocks || []).map((m) => ({
        id: m.id,
        interviewId: m.interview_id ?? undefined,
        contextMode: m.context_mode || "generic",
        contextLabel: m.context_label || "Generic Practice",
        role: m.role,
        company: m.company,
        date: m.date,
        time: m.time,
        score: m.score,
        headline: m.headline,
        questions: m.questions,
        durationMin: m.duration_min,
        best: m.best,
        weakest: m.weakest,
        skills: m.skills || [],
        completedAt: m.completed_at ? Date.parse(m.completed_at) : Date.now(),
        feedback: m.feedback ?? undefined,
        answers: m.answers ?? undefined,
      })),
      savedQuestionIds: (savedQuestions || []).map((q) => q.question_id),
    };

    setState(next);
    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Pull failed";
    return { ok: false, error: message };
  }
}
