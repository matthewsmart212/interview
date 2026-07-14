import type {
  AppState,
  Interview,
  InterviewPrep,
  MasterCV,
  MockSession,
  UserProfile,
} from "../types";
import { getState, setState } from "../store";
import {
  accentFor,
  createId,
  dateChipFrom,
  daysAwayFrom,
  extractJdHighlights,
  formatDisplayDate,
  formatDisplayTime,
  initialsFrom,
} from "../ids";
import type { InterviewType } from "../../onboarding-store";
import type { InterviewAnswer, InterviewFeedbackResult } from "../../types";
import type { MockSetupConfig } from "../../mock-setup";
import {
  calculateInterviewReadiness,
  normalizePrep,
} from "../../readiness";

/* ---------------- user ---------------- */

export function getUser(): UserProfile {
  return getState().user;
}

export function updateUser(patch: Partial<UserProfile>): UserProfile {
  return setState((s) => ({
    ...s,
    user: { ...s.user, ...patch, updatedAt: Date.now() },
  })).user;
}

/* ---------------- CV (single permanent file) ---------------- */

export function getMasterCv(): MasterCV {
  return getState().masterCv;
}

export function setMasterCv(cv: MasterCV): MasterCV {
  return setState((s) => ({ ...s, masterCv: cv })).masterCv;
}

/** Replace the one permanent CV (no version history). */
export function uploadMasterCv(input: {
  fileName: string;
  summary?: string;
  score?: number;
  text?: string;
  sections?: MasterCV["sections"];
}): MasterCV {
  const updatedAt = formatDisplayDate();
  const score = input.score ?? 72;
  const cv: MasterCV = {
    id: "master-cv",
    exists: true,
    source: "upload",
    fileName: input.fileName,
    updatedAt,
    score,
    summary:
      input.summary ??
      "Your CV — used to personalise mock questions and feedback.",
    text: input.text,
    sections: input.sections ?? {
      experience: [],
      education: [],
      skills: [],
    },
  };
  return setMasterCv(cv);
}

export function createMasterCvFromForm(input: {
  targetRole?: string;
  about: string;
  jobs: { role: string; company: string; period: string }[];
  skills: string[];
}): MasterCV {
  const updatedAt = formatDisplayDate();
  const fileName = `${(getUser().name || "My").replace(/\s+/g, "-")}-CV.pdf`;
  const score = Math.min(88, 55 + input.skills.length * 3 + input.jobs.length * 5);
  return setMasterCv({
    id: "master-cv",
    exists: true,
    source: "create",
    fileName,
    updatedAt,
    score,
    summary: input.about,
    sections: {
      experience: input.jobs.map((j) => ({
        role: j.role,
        company: j.company,
        period: j.period,
        points: [`Worked as ${j.role} at ${j.company}`],
      })),
      education: [],
      skills: input.skills,
    },
  });
}

/* ---------------- interviews ---------------- */

export function listInterviews(): Interview[] {
  return getState().interviews.map(refreshInterviewDerived);
}

export function getInterview(id: string): Interview | null {
  const iv = getState().interviews.find((i) => i.id === id);
  return iv ? refreshInterviewDerived(iv) : null;
}

function refreshInterviewDerived(iv: Interview): Interview {
  const daysAway = daysAwayFrom(iv.date);
  const derivedStatus: Interview["status"] =
    iv.status === "past" || daysAway < 0 ? "past" : "upcoming";
  const prep = normalizePrep(iv.prep);
  const withPrep: Interview = {
    ...iv,
    prep,
    daysAway,
    status: derivedStatus,
  };
  return {
    ...withPrep,
    readiness: calculateInterviewReadiness(withPrep),
  };
}

export function createInterview(input: {
  role: string;
  company?: string;
  type?: InterviewType;
  date?: string;
  jd?: string;
}): Interview {
  const id = createId("iv");
  const company = input.company?.trim() || "Company";
  const date = input.date?.trim() || formatDisplayDate(new Date(Date.now() + 14 * 86400000));
  const hasJD = Boolean(input.jd?.trim());
  const t = Date.now();
  const interview: Interview = {
    id,
    role: input.role.trim(),
    company,
    initials: initialsFrom(company, input.role),
    accent: accentFor(id),
    type: input.type ?? "In-person",
    date,
    dateChip: dateChipFrom(date),
    daysAway: daysAwayFrom(date),
    status: "upcoming",
    readiness: 0,
    hasJD,
    jd: hasJD ? input.jd!.trim() : null,
    jdHighlights: hasJD ? extractJdHighlights(input.jd!) : [],
    prep: normalizePrep(null),
    mockIds: [],
    createdAt: t,
    updatedAt: t,
  };

  setState((s) => ({
    ...s,
    interviews: [interview, ...s.interviews],
  }));
  return refreshInterviewDerived(interview);
}

export function updateInterview(
  id: string,
  patch: Partial<Interview>
): Interview | null {
  let updated: Interview | null = null;
  setState((s) => ({
    ...s,
    interviews: s.interviews.map((iv) => {
      if (iv.id !== id) return iv;
      updated = refreshInterviewDerived({
        ...iv,
        ...patch,
        updatedAt: Date.now(),
      });
      return updated;
    }),
  }));
  return updated;
}

export function saveInterviewJd(id: string, jd: string): Interview | null {
  const trimmed = jd.trim();
  return updateInterview(id, {
    hasJD: Boolean(trimmed),
    jd: trimmed || null,
    jdHighlights: trimmed ? extractJdHighlights(trimmed) : [],
  });
}

/** Mark or toggle a prep checklist flag. Readiness is recalculated on read. */
export function updateInterviewPrep(
  id: string,
  patch: Partial<InterviewPrep>
): Interview | null {
  const iv = getInterview(id);
  if (!iv) return null;
  return updateInterview(id, {
    prep: { ...normalizePrep(iv.prep), ...patch },
  });
}

/* ---------------- mock sessions / history ---------------- */

export function listMockSessions(): MockSession[] {
  return [...getState().mockSessions].sort(
    (a, b) => (b.completedAt || 0) - (a.completedAt || 0)
  );
}

export function getMockSession(id: string): MockSession | null {
  return getState().mockSessions.find((m) => m.id === id) ?? null;
}

export function mocksForInterview(interviewId: string): MockSession[] {
  return listMockSessions().filter((m) => m.interviewId === interviewId);
}

export function recordMockSession(input: {
  setup?: MockSetupConfig | null;
  feedback: InterviewFeedbackResult;
  answers?: Record<number, InterviewAnswer>;
  durationMin?: number;
}): MockSession {
  const setup = input.setup;
  const interviewId = setup?.interviewId;
  const interview = interviewId ? getInterview(interviewId) : null;
  const now = new Date();
  const top = input.feedback.questions[input.feedback.topAnswerIndex];
  const weakest = [...input.feedback.questions].sort((a, b) => a.score - b.score)[0];

  const session: MockSession = {
    id: createId("mock"),
    interviewId,
    contextMode: setup?.contextMode ?? "generic",
    contextLabel: setup?.contextLabel ?? "Generic Practice",
    role: interview?.role ?? setup?.contextLabel ?? "Practice interview",
    company: interview?.company ?? "Generic",
    date: formatDisplayDate(now),
    time: formatDisplayTime(now),
    score: input.feedback.overallScore,
    headline: input.feedback.headline,
    questions: input.feedback.questions.length,
    durationMin: input.durationMin ?? 10,
    best: top?.category ?? "Top answer",
    weakest: weakest?.category ?? "Needs work",
    skills: [
      {
        name: "Relevance",
        value: Math.round(
          input.feedback.questions.reduce((a, q) => a + q.score, 0) /
            Math.max(1, input.feedback.questions.length)
        ),
      },
      { name: "STAR structure", value: Math.max(40, input.feedback.overallScore - 5) },
      { name: "Clarity", value: Math.min(98, input.feedback.overallScore + 4) },
    ],
    completedAt: now.getTime(),
    feedback: input.feedback,
    answers: input.answers,
  };

  setState((s) => ({
    ...s,
    mockSessions: [session, ...s.mockSessions],
    interviews: s.interviews.map((iv) => {
      if (!interviewId || iv.id !== interviewId) return iv;
      const mockIds = [session.id, ...iv.mockIds.filter((mid) => mid !== session.id)];
      return { ...iv, mockIds, updatedAt: Date.now() };
    }),
    user: {
      ...s.user,
      streak: s.user.streak + 1,
      updatedAt: Date.now(),
    },
  }));

  return session;
}

/* ---------------- saved questions ---------------- */

export function getSavedQuestionIds(): string[] {
  return getState().savedQuestionIds;
}

export function toggleSavedQuestion(id: string): string[] {
  return setState((s) => {
    const exists = s.savedQuestionIds.includes(id);
    return {
      ...s,
      savedQuestionIds: exists
        ? s.savedQuestionIds.filter((x) => x !== id)
        : [...s.savedQuestionIds, id],
    };
  }).savedQuestionIds;
}

/* ---------------- snapshot helpers for UI ---------------- */

export function getAppSnapshot(): AppState {
  const s = getState();
  return {
    ...s,
    interviews: s.interviews.map(refreshInterviewDerived),
    mockSessions: listMockSessions(),
  };
}
