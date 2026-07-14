/**
 * Demo seed data for the mock-prep product.
 */

import type { AppState, Interview, MasterCV, MockSession, UserProfile } from "./types";
import { APP_STATE_VERSION } from "./types";
import { USER, MASTER_CV, INTERVIEWS, MOCK_HISTORY } from "../app-data";

function now() {
  return Date.now();
}

export function buildSeedUser(name = USER.name): UserProfile {
  const t = now();
  return {
    id: "user-local",
    name,
    goal: "interview",
    preferences: {
      interviewFormat: "In-person",
      voicePractice: true,
    },
    streak: USER.streak,
    onboardingCompletedAt: t,
    createdAt: t,
    updatedAt: t,
  };
}

export function buildEmptyUser(): UserProfile {
  const t = now();
  return {
    id: "user-local",
    name: "",
    goal: null,
    preferences: {
      interviewFormat: "In-person",
      voicePractice: true,
    },
    streak: 0,
    onboardingCompletedAt: null,
    createdAt: t,
    updatedAt: t,
  };
}

export function buildSeedMasterCv(): MasterCV {
  return {
    id: "master-cv",
    exists: MASTER_CV.exists,
    source: "seed",
    fileName: MASTER_CV.fileName,
    updatedAt: MASTER_CV.updatedAt,
    score: MASTER_CV.score,
    summary: MASTER_CV.summary,
    sections: structuredClone(MASTER_CV.sections),
  };
}

export function buildEmptyMasterCv(): MasterCV {
  return {
    id: "master-cv",
    exists: false,
    source: null,
    fileName: "",
    updatedAt: "",
    score: 0,
    summary: "",
    sections: { experience: [], education: [], skills: [] },
  };
}

export function buildSeedInterviews(): Interview[] {
  const t = now();
  return INTERVIEWS.map((iv, index) => {
    const { tailoredCv: _removed, ...rest } = structuredClone(iv) as Interview & {
      tailoredCv?: unknown;
    };
    // Seed prep flags so readiness reflects real completed actions.
    const prep =
      index === 0
        ? {
            questionsReviewed: true,
            starPrepared: true,
            companyResearched: true,
            feedbackReviewed: true,
          }
        : {
            questionsReviewed: false,
            starPrepared: false,
            companyResearched: false,
            feedbackReviewed: false,
          };
    return { ...rest, prep, createdAt: t, updatedAt: t };
  }) as Interview[];
}

export function buildSeedMockSessions(): MockSession[] {
  return MOCK_HISTORY.map((m) => ({
    ...structuredClone(m),
    contextMode: m.interviewId ? "interview" : "generic",
    contextLabel: `${m.company} — ${m.role}`,
    completedAt: Date.parse(m.date) || now(),
  })) as MockSession[];
}

export function buildDemoState(): AppState {
  return {
    version: APP_STATE_VERSION,
    seededAt: now(),
    user: buildSeedUser(),
    masterCv: buildSeedMasterCv(),
    interviews: buildSeedInterviews(),
    mockSessions: buildSeedMockSessions(),
    savedQuestionIds: [],
  };
}

export function buildEmptyState(): AppState {
  return {
    version: APP_STATE_VERSION,
    seededAt: now(),
    user: buildEmptyUser(),
    masterCv: buildEmptyMasterCv(),
    interviews: [],
    mockSessions: [],
    savedQuestionIds: [],
  };
}
