/**
 * Demo seed data for the mock-prep product.
 * Interview and mock dates are generated relative to "now" so demo state
 * stays internally consistent (upcoming vs past).
 */

import type { AppState, Interview, MasterCV, MockSession, UserProfile } from "./types";
import { APP_STATE_VERSION } from "./types";
import { USER, MASTER_CV, INTERVIEWS, MOCK_HISTORY } from "../app-data";
import {
  dateChipFrom,
  formatDisplayDate,
  formatDisplayTime,
} from "./ids";
import { computePracticeStreak } from "../app-journey-state";

function now() {
  return Date.now();
}

function daysFromNow(offset: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
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
    streak: 0, // overwritten after mocks are built
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
    updatedAt: formatDisplayDate(daysFromNow(-2)),
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

/**
 * Seed interviews with relative dates:
 * - Tesco: upcoming in 7 days
 * - Costa: upcoming in 16 days
 * - Zara: past (−20 days) so orphaned history mocks have a home
 */
export function buildSeedInterviews(): Interview[] {
  const t = now();
  const schedule = [
    { id: "tesco-csa", offsetDays: 7 },
    { id: "costa-barista", offsetDays: 16 },
  ];

  const fromFixtures = INTERVIEWS.map((iv, index) => {
    const { tailoredCv: _removed, ...rest } = structuredClone(iv) as Interview & {
      tailoredCv?: unknown;
    };
    const sched = schedule.find((s) => s.id === iv.id) || {
      id: iv.id,
      offsetDays: 7 + index * 7,
    };
    const date = daysFromNow(sched.offsetDays);
    const dateStr = formatDisplayDate(date);
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

    // Keep mockIds aligned with seed mocks for this interview
    const mockIds =
      iv.id === "tesco-csa"
        ? ["mock-3", "mock-2"]
        : iv.id === "costa-barista"
          ? ["mock-4"]
          : rest.mockIds || [];

    return {
      ...rest,
      date: dateStr,
      dateChip: dateChipFrom(dateStr),
      daysAway: sched.offsetDays,
      status: "upcoming" as const,
      mockIds,
      prep,
      createdAt: t,
      updatedAt: t,
    };
  }) as Interview[];

  // Past interview referenced by mock-1
  const zaraDate = daysFromNow(-20);
  const zaraDateStr = formatDisplayDate(zaraDate);
  const zara: Interview = {
    id: "zara-retail",
    role: "Retail Assistant",
    company: "Zara",
    initials: "Z",
    accent: "#1f1f24",
    type: "In-person",
    date: zaraDateStr,
    dateChip: dateChipFrom(zaraDateStr),
    daysAway: -20,
    status: "past",
    outcome: "Completed",
    readiness: 0,
    hasJD: false,
    jd: null,
    jdHighlights: [],
    prep: {
      questionsReviewed: true,
      starPrepared: true,
      companyResearched: true,
      feedbackReviewed: true,
    },
    mockIds: ["mock-1"],
    createdAt: t,
    updatedAt: t,
  };

  return [...fromFixtures, zara];
}

export function buildSeedMockSessions(): MockSession[] {
  // Relative mock completion timeline (newest first in list order after sort)
  const offsets: Record<string, { day: number; hour: number; minute: number }> = {
    "mock-4": { day: -1, hour: 18, minute: 40 },
    "mock-3": { day: -2, hour: 20, minute: 15 },
    "mock-2": { day: -5, hour: 19, minute: 2 },
    "mock-1": { day: -22, hour: 17, minute: 30 },
  };

  return MOCK_HISTORY.map((m) => {
    const off = offsets[m.id] || { day: -3, hour: 18, minute: 0 };
    const completed = daysFromNow(off.day);
    completed.setHours(off.hour, off.minute, 0, 0);
    const interviewId =
      m.id === "mock-1"
        ? "zara-retail"
        : m.id === "mock-4"
          ? "costa-barista"
          : m.interviewId;

    return {
      ...structuredClone(m),
      interviewId,
      date: formatDisplayDate(completed),
      time: formatDisplayTime(completed),
      contextMode: interviewId ? "interview" : "generic",
      contextLabel: `${m.company} — ${m.role}`,
      completedAt: completed.getTime(),
    };
  }) as MockSession[];
}

export function buildDemoState(): AppState {
  const mockSessions = buildSeedMockSessions();
  const user = buildSeedUser();
  user.streak = computePracticeStreak(mockSessions);

  return {
    version: APP_STATE_VERSION,
    seededAt: now(),
    user,
    masterCv: buildSeedMasterCv(),
    interviews: buildSeedInterviews(),
    mockSessions,
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
