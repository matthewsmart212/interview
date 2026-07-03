import type {
  InterviewAnswer,
  InterviewFeedbackResult,
  InterviewSession,
} from "./types";

/**
 * localStorage persistence for the in-progress interview and the generated
 * feedback result, so a refresh doesn't lose progress. All functions are
 * safe to call during SSR (they no-op without `window`).
 */

const SESSION_KEY = "ic.session.v1";
const RESULT_KEY = "ic.result.v1";
const SESSION_VERSION = 1;

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function newSession(): InterviewSession {
  return {
    version: SESSION_VERSION,
    startedAt: Date.now(),
    currentIndex: 0,
    phase: "question",
    answers: {},
  };
}

export function loadSession(): InterviewSession | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InterviewSession;
    if (parsed?.version !== SESSION_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: InterviewSession): void {
  storage()?.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  storage()?.removeItem(SESSION_KEY);
}

export function saveAnswer(
  session: InterviewSession,
  answer: InterviewAnswer
): InterviewSession {
  const next: InterviewSession = {
    ...session,
    answers: { ...session.answers, [answer.questionId]: answer },
  };
  saveSession(next);
  return next;
}

export function loadResult(): InterviewFeedbackResult | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(RESULT_KEY);
    return raw ? (JSON.parse(raw) as InterviewFeedbackResult) : null;
  } catch {
    return null;
  }
}

export function saveResult(result: InterviewFeedbackResult): void {
  storage()?.setItem(RESULT_KEY, JSON.stringify(result));
}

export function clearResult(): void {
  storage()?.removeItem(RESULT_KEY);
}
