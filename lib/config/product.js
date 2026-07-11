/**
 * Product defaults — tweak here, not scattered across screens.
 */

/** Standard mock: 5 questions ≈ 8–10 minutes including coach talk + thinking time. */
export const MOCK_QUESTION_COUNT = 5;

/** Quick practice option (wire later if needed). */
export const MOCK_QUICK_QUESTION_COUNT = 3;

export const MOCK_DURATION_LABEL = "8–10 minutes";
export const MOCK_QUICK_DURATION_LABEL = "4–6 minutes";

/** OpenAI model for structured tasks (CV parse, JD, feedback, questions). */
export const DEFAULT_AI_MODEL = "gpt-4.1-mini";

/** Coach is unnamed — first-person voice only. */
export const COACH_DISPLAY_NAME = null;

export const PRODUCT = {
  mock: {
    questionCount: MOCK_QUESTION_COUNT,
    quickQuestionCount: MOCK_QUICK_QUESTION_COUNT,
    durationLabel: MOCK_DURATION_LABEL,
    quickDurationLabel: MOCK_QUICK_DURATION_LABEL,
  },
  ai: {
    model: process.env.OPENAI_MODEL || DEFAULT_AI_MODEL,
  },
  coach: {
    displayName: COACH_DISPLAY_NAME,
  },
};
