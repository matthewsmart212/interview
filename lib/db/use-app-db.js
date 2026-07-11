"use client";

import { useEffect, useState } from "react";
import {
  getAppSnapshot,
  hydrateFromStorage,
  subscribe,
} from "./index";

/**
 * React hook for reactive access to the local app database.
 * Re-renders whenever any repository mutates state.
 */
export function useAppDb() {
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateFromStorage();
    setReady(true);
    return subscribe(() => setTick((n) => n + 1));
  }, []);

  // Re-read after each notify (tick)
  void tick;
  const live = getAppSnapshot();

  return {
    ready,
    user: live.user,
    masterCv: live.masterCv,
    cvHistory: live.cvHistory,
    interviews: live.interviews,
    tailoredCvs: live.tailoredCvs,
    mockSessions: live.mockSessions,
    savedQuestionIds: live.savedQuestionIds,
    USER: { name: live.user.name, streak: live.user.streak },
    MASTER_CV: live.masterCv,
    CV_HISTORY: live.cvHistory,
    INTERVIEWS: live.interviews,
    MOCK_HISTORY: live.mockSessions,
  };
}
