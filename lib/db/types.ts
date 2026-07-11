/**
 * Domain types for the app data layer.
 * Shapes mirror what a future Supabase/Neon schema would store.
 */

import type { InterviewType, UserGoal } from "../onboarding-store";
import type { InterviewFeedbackResult, InterviewAnswer } from "../types";
import type { MockContextMode, MockCvType } from "../mock-setup";

export type { InterviewType, UserGoal, MockContextMode, MockCvType };

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

export interface MasterCV {
  id: string;
  exists: boolean;
  source: "upload" | "create" | "seed" | null;
  fileName: string;
  updatedAt: string;
  score: number;
  summary: string;
  sections: {
    experience: CvExperience[];
    education: CvEducation[];
    skills: string[];
  };
}

export interface CvHistoryEntry {
  id: string;
  fileName: string;
  uploadedAt: string;
  score: number;
  current: boolean;
}

export interface TailoredCvSummary {
  exists: boolean;
  score?: number;
  updatedAt?: string;
  changes?: string[];
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
  tailoredCv: TailoredCvSummary;
  mockIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TailoredCV {
  id: string;
  interviewId: string;
  score: number;
  updatedAt: string;
  changes: string[];
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
  /** Full feedback payload when available from a live mock. */
  feedback?: InterviewFeedbackResult;
  answers?: Record<number, InterviewAnswer>;
}

export interface AppState {
  version: 1;
  seededAt: number | null;
  user: UserProfile;
  masterCv: MasterCV;
  cvHistory: CvHistoryEntry[];
  interviews: Interview[];
  tailoredCvs: Record<string, TailoredCV>;
  mockSessions: MockSession[];
  savedQuestionIds: string[];
}

export const APP_STATE_KEY = "ic.app.v1";
export const APP_STATE_VERSION = 1 as const;
