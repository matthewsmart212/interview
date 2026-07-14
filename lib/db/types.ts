/**
 * Domain types — mock interview prep focused.
 * One permanent CV per user. Multiple interviews with JDs. Mock history.
 */

import type { InterviewType, UserGoal } from "../onboarding-store";
import type { InterviewFeedbackResult, InterviewAnswer } from "../types";
import type { MockContextMode } from "../mock-setup";

export type { InterviewType, UserGoal, MockContextMode };

export interface UserPreferences {
  interviewFormat: InterviewType;
  voicePractice: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  goal: UserGoal | null;
  preferences: UserPreferences;
  streak: number;
  onboardingCompletedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface CvExperience {
  role: string;
  company: string;
  period: string;
  points: string[];
}

export interface CvEducation {
  title: string;
  place: string;
  period: string;
}

/** Single permanent CV used to personalise every mock. */
export interface MasterCV {
  id: string;
  exists: boolean;
  source: "upload" | "create" | "seed" | null;
  fileName: string;
  updatedAt: string;
  /** Internal parse quality signal — not a role "match score". */
  score: number;
  summary: string;
  /** Raw extracted text for AI question/feedback context. */
  text?: string;
  sections: {
    experience: CvExperience[];
    education: CvEducation[];
    skills: string[];
  };
}

export interface Interview {
  id: string;
  role: string;
  company: string;
  initials: string;
  accent: string;
  type: InterviewType;
  date: string;
  dateChip: { d: string; m: string };
  daysAway: number;
  status: "upcoming" | "past";
  outcome?: string;
  readiness: number;
  hasJD: boolean;
  jd: string | null;
  jdHighlights: string[];
  mockIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface MockSession {
  id: string;
  interviewId?: string;
  contextMode: MockContextMode;
  contextLabel: string;
  role: string;
  company: string;
  date: string;
  time: string;
  score: number;
  headline: string;
  questions: number;
  durationMin: number;
  best: string;
  weakest: string;
  skills: { name: string; value: number }[];
  completedAt: number;
  feedback?: InterviewFeedbackResult;
  answers?: Record<number, InterviewAnswer>;
}

export interface AppState {
  version: 2;
  seededAt: number | null;
  user: UserProfile;
  masterCv: MasterCV;
  interviews: Interview[];
  mockSessions: MockSession[];
  savedQuestionIds: string[];
}

export const APP_STATE_KEY = "ic.app.v1";
/** Bumped when tailored CV / history fields were removed. */
export const APP_STATE_VERSION = 2 as const;
