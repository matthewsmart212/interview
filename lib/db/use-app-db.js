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

  void tick;
  const live = getAppSnapshot();

  return {
    ready,
    user: live.user,
    masterCv: live.masterCv,
    interviews: live.interviews,
    mockSessions: live.mockSessions,
    savedQuestionIds: live.savedQuestionIds,
    USER: { name: live.user.name, streak: live.user.streak },
    MASTER_CV: live.masterCv,
    INTERVIEWS: live.interviews,
    MOCK_HISTORY: live.mockSessions,
  };
}
