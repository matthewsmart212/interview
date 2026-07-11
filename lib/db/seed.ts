/**
 * Demo seed data — used on first launch so the app feels populated.
 * Later this becomes optional; fresh users start empty after onboarding.
 */

import type { AppState, Interview, MasterCV, MockSession, UserProfile } from "./types";
import {
  USER,
  MASTER_CV,
  CV_HISTORY,
  INTERVIEWS,
  MOCK_HISTORY,
} from "../app-data";

function now() {
  return Date.now();
}

export function buildSeedUser(name = USER.name): UserProfile {
  const t = now();
  return {
    id: "user-local",
    name,
    goal: "both",
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
  return INTERVIEWS.map((iv) => ({
    ...structuredClone(iv),
    createdAt: t,
    updatedAt: t,
  })) as Interview[];
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
    version: 1,
    seededAt: now(),
    user: buildSeedUser(),
    masterCv: buildSeedMasterCv(),
    cvHistory: structuredClone(CV_HISTORY).map((h) => ({
      ...h,
      current: Boolean(h.current),
    })),
    interviews: buildSeedInterviews(),
    tailoredCvs: Object.fromEntries(
      INTERVIEWS.filter((iv) => iv.tailoredCv?.exists).map((iv) => [
        iv.id,
        {
          id: `tailored-${iv.id}`,
          interviewId: iv.id,
          score: iv.tailoredCv.score ?? 0,
          updatedAt: iv.tailoredCv.updatedAt ?? "",
          changes: iv.tailoredCv.changes ?? [],
        },
      ])
    ),
    mockSessions: buildSeedMockSessions(),
    savedQuestionIds: [],
  };
}

export function buildEmptyState(): AppState {
  return {
    version: 1,
    seededAt: now(),
    user: buildEmptyUser(),
    masterCv: buildEmptyMasterCv(),
    cvHistory: [],
    interviews: [],
    tailoredCvs: {},
    mockSessions: [],
    savedQuestionIds: [],
  };
}
