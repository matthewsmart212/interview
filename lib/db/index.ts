/**
 * Public data-layer API.
 * Screens should import from `lib/db` (or useAppDb) instead of app-data.js.
 */

export type * from "./types";
export {
  getState,
  setState,
  updateState,
  subscribe,
  hydrateFromStorage,
  resetToDemo,
  resetToEmpty,
  clearAppData,
  isHydrated,
} from "./store";

export {
  getUser,
  updateUser,
  getMasterCv,
  getCvHistory,
  setMasterCv,
  uploadMasterCv,
  createMasterCvFromForm,
  bumpMasterCvScore,
  listInterviews,
  getInterview,
  createInterview,
  updateInterview,
  saveInterviewJd,
  saveTailoredCv,
  getTailoredCv,
  listMockSessions,
  getMockSession,
  mocksForInterview,
  recordMockSession,
  getSavedQuestionIds,
  toggleSavedQuestion,
  getAppSnapshot,
} from "./repositories";

export { promoteOnboarding } from "./services/promote-onboarding";
export { completeMockFromLiveResult } from "./services/complete-mock";
export { resetToFreshOnboarding } from "./services/reset-fresh";
