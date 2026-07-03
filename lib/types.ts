/**
 * Shared types for the mock interview flow.
 * These shapes are designed so the mock generator in `feedback-generator.ts`
 * can later be swapped for a real AI/API call without touching the UI.
 */

export interface InterviewQuestion {
  id: number;
  category: string;
  text: string;
  /** Curated example STAR answer used as the "better answer" source. */
  better: {
    Situation: string;
    Task: string;
    Action: string;
    Result: string;
  };
}

export interface InterviewAnswer {
  questionId: number;
  transcript: string;
  /** True when the user edited the transcript by hand. */
  edited?: boolean;
  /** True when the transcript was typed rather than spoken. */
  typed?: boolean;
  recordedAt?: number;
}

export interface StarPart {
  covered: boolean;
  note: string;
}

export interface StarBreakdown {
  Situation: StarPart;
  Task: StarPart;
  Action: StarPart;
  Result: StarPart;
}

export interface QuestionFeedback {
  id: number;
  question: string;
  category: string;
  transcript: string;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  starBreakdown: StarBreakdown;
  betterAnswer: string;
  quickTip: string;
}

export interface InterviewFeedbackResult {
  overallScore: number;
  averageScore: number;
  topAnswerIndex: number;
  headline: string;
  questions: QuestionFeedback[];
  overallStrengths: string[];
  overallImprovements: string[];
  generatedAt: number;
}

export type InterviewPhase =
  | "question"
  | "listening"
  | "reviewTranscript"
  | "analyzing"
  | "feedback"
  | "questionDetail";

export interface InterviewSession {
  version: number;
  startedAt: number;
  currentIndex: number;
  phase: InterviewPhase;
  answers: Record<number, InterviewAnswer>;
  /** Unconfirmed transcript waiting on the review screen (refresh-safe). */
  draft?: { questionId: number; transcript: string } | null;
}
