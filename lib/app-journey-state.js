/**
 * Single source of truth for interview/mock journey states.
 * Use across Home, Interviews, Mock, and Progress so conditionals stay aligned.
 *
 * STATE A — empty: no interviews, no mocks
 * STATE B — historyOnly: no upcoming, but past interviews and/or mocks
 * STATE C — upcoming: at least one upcoming interview
 * STATE D — hasMocks: at least one completed mock (orthogonal progress flag)
 */

import {
  buildPrepRoadmap,
  calculateInterviewReadiness,
} from "./readiness";

export const JOURNEY = {
  EMPTY: "empty",
  HISTORY_ONLY: "historyOnly",
  UPCOMING: "upcoming",
};

function dayKey(ts) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Consecutive practice days ending on the most recent mock day. */
export function computePracticeStreak(mockSessions = []) {
  if (!mockSessions.length) return 0;

  const days = [
    ...new Set(
      mockSessions
        .map((m) => dayKey(m.completedAt || Date.parse(m.date)))
        .filter(Boolean)
    ),
  ]
    .map((key) => {
      const [y, m, d] = key.split("-").map(Number);
      return new Date(y, m, d).getTime();
    })
    .sort((a, b) => b - a);

  if (!days.length) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const gap = (days[i - 1] - days[i]) / 86400000;
    if (gap === 1) streak += 1;
    else break;
  }
  return streak;
}

function aggregateSkills(mockSessions) {
  const totals = {};
  mockSessions.forEach((mk) => {
    (mk.skills || []).forEach((sk) => {
      if (typeof sk?.value !== "number" || !sk.name) return;
      if (!totals[sk.name]) totals[sk.name] = [];
      totals[sk.name].push(sk.value);
    });
  });

  return Object.entries(totals)
    .map(([name, vals]) => ({
      name,
      value: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * @param {{
 *   interviews?: Array,
 *   mockSessions?: Array,
 * }} input
 */
export function selectAppJourneyState({
  interviews = [],
  mockSessions = [],
} = {}) {
  const upcoming = interviews
    .filter((i) => i.status === "upcoming")
    .sort((a, b) => a.daysAway - b.daysAway);

  const past = interviews
    .filter((i) => i.status === "past")
    // Latest first (daysAway closest to zero)
    .sort((a, b) => b.daysAway - a.daysAway);

  const mocks = [...mockSessions].sort(
    (a, b) => (b.completedAt || 0) - (a.completedAt || 0)
  );

  const nearestUpcoming = upcoming[0] || null;
  const lastMock = mocks[0] || null;
  const hasMocks = mocks.length > 0;
  const hasInterviews = interviews.length > 0;

  let journey = JOURNEY.EMPTY;
  if (nearestUpcoming) journey = JOURNEY.UPCOMING;
  else if (hasInterviews || hasMocks) journey = JOURNEY.HISTORY_ONLY;

  const scores = mocks
    .map((m) => m.score)
    .filter((n) => typeof n === "number");

  const skillAvgs = aggregateSkills(mocks);
  const strongest = skillAvgs[0] || null;
  const weakest =
    skillAvgs.length > 1 ? skillAvgs[skillAvgs.length - 1] : null;

  const nearestMocks = nearestUpcoming
    ? mocks.filter((m) => m.interviewId === nearestUpcoming.id)
    : [];

  const openPrepTasks = nearestUpcoming
    ? buildPrepRoadmap(nearestUpcoming, { mocks: nearestMocks }).filter(
        (t) => !t.done
      ).length
    : 0;

  const nearestReadiness = nearestUpcoming
    ? calculateInterviewReadiness(nearestUpcoming)
    : null;

  return {
    journey,
    isEmpty: journey === JOURNEY.EMPTY,
    isHistoryOnly: journey === JOURNEY.HISTORY_ONLY,
    hasUpcoming: journey === JOURNEY.UPCOMING,
    hasMocks,
    hasInterviews,
    hasPast: past.length > 0,

    upcoming,
    past,
    interviews,
    mocks,
    nearestUpcoming,
    lastMock,

    openPrepTasks,
    nearestReadiness,

    progress: {
      mockCount: mocks.length,
      averageScore: scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null,
      bestScore: scores.length ? Math.max(...scores) : null,
      streak: computePracticeStreak(mocks),
      skillAvgs,
      strongest,
      weakest,
      readinessFocus: nearestReadiness,
    },
  };
}

/** Convenience: derive journey state from a useAppDb() snapshot. */
export function journeyStateFromDb(db) {
  return selectAppJourneyState({
    interviews: db?.INTERVIEWS || db?.interviews || [],
    mockSessions: db?.MOCK_HISTORY || db?.mockSessions || [],
  });
}
