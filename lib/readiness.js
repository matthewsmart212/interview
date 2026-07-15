/**
 * Interview readiness — derived from real prep actions only.
 * Weights live here so they can be tuned without touching UI.
 */

export const READINESS_WEIGHTS = {
  jobDescription: 15,
  questionsReviewed: 15,
  starPrepared: 20,
  companyResearched: 15,
  firstMock: 20,
  feedbackOrRetry: 15,
};

export const DEFAULT_PREP = {
  questionsReviewed: false,
  starPrepared: false,
  companyResearched: false,
  feedbackReviewed: false,
};

export function normalizePrep(prep) {
  return {
    ...DEFAULT_PREP,
    ...(prep || {}),
  };
}

/**
 * @param {{
 *   hasJD?: boolean,
 *   mockIds?: string[],
 *   prep?: Partial<typeof DEFAULT_PREP>,
 * }} interview
 */
export function getPrepCompletion(interview) {
  const prep = normalizePrep(interview?.prep);
  const mockCount = interview?.mockIds?.length ?? 0;

  return {
    jobDescription: Boolean(interview?.hasJD),
    questionsReviewed: Boolean(prep.questionsReviewed),
    starPrepared: Boolean(prep.starPrepared),
    companyResearched: Boolean(prep.companyResearched),
    firstMock: mockCount >= 1,
    feedbackOrRetry: Boolean(prep.feedbackReviewed) || mockCount >= 2,
  };
}

/** 0–100 readiness from completed prep actions. */
export function calculateInterviewReadiness(interview) {
  const done = getPrepCompletion(interview);
  let total = 0;
  for (const [key, weight] of Object.entries(READINESS_WEIGHTS)) {
    if (done[key]) total += weight;
  }
  return Math.min(100, total);
}

export function readinessLabel(score) {
  if (score >= 70) return "Ready";
  if (score >= 40) return "On track";
  if (score > 0) return "Needs prep";
  return "Not started";
}

/**
 * Build the preparation roadmap for the interview detail screen.
 * Actions are UI-facing; completion is never guessed.
 */
export function buildPrepRoadmap(interview, { mocks = [] } = {}) {
  const prep = normalizePrep(interview?.prep);
  const mockCount = mocks.length || interview?.mockIds?.length || 0;
  const latestMock = mocks[0];
  const id = interview?.id;

  return [
    {
      id: "jd",
      title: "Add the job description",
      sub: interview?.hasJD
        ? "Mocks will use this JD with your CV"
        : "Paste the listing so questions match the role",
      done: Boolean(interview?.hasJD),
      href: id ? `/interviews/${id}/jd` : "/interviews",
      cta: interview?.hasJD ? "View" : "Add",
      icon: "file",
    },
    {
      id: "questions",
      title: "Review likely questions",
      sub: "Browse common questions for this kind of role",
      done: Boolean(prep.questionsReviewed),
      href: "/questions",
      cta: prep.questionsReviewed ? "Review" : "Start",
      icon: "message",
      markComplete: "questionsReviewed",
    },
    {
      id: "star",
      title: "Prepare STAR examples",
      sub: "Have 2–3 stories ready: Situation, Task, Action, Result",
      done: Boolean(prep.starPrepared),
      cta: prep.starPrepared ? "Done" : "Mark done",
      icon: "star",
      markComplete: "starPrepared",
      toggle: true,
    },
    {
      id: "company",
      title: "Research the company",
      sub: "Know what they do, their values, and recent news",
      done: Boolean(prep.companyResearched),
      cta: prep.companyResearched ? "Done" : "Mark done",
      icon: "target",
      markComplete: "companyResearched",
      toggle: true,
    },
    {
      id: "mock",
      title: "Complete a mock interview",
      sub:
        mockCount > 0
          ? `Latest score ${latestMock?.score ?? "—"}/100 — keep practising`
          : "About 8–10 minutes with your AI interviewer",
      done: mockCount >= 1,
      href: "/mock",
      cta: mockCount > 0 ? "Practise" : "Start",
      icon: "mic",
    },
    {
      id: "feedback",
      title: "Review feedback and retry",
      sub:
        mockCount >= 2
          ? "You've practised more than once — great habit"
          : mockCount === 1
            ? "Read your feedback, then run another mock"
            : "Finish a mock to unlock personalised feedback",
      done: Boolean(prep.feedbackReviewed) || mockCount >= 2,
      href: latestMock ? `/history/${latestMock.id}` : "/history",
      cta: mockCount > 0 ? "Review" : "View",
      icon: "chart",
      markComplete: mockCount > 0 ? "feedbackReviewed" : null,
    },
  ];
}
