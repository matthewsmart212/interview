/**
 * Persist a finished mock into history (after analyzing/feedback).
 * Does not generate questions or TTS — only stores results.
 */

import { loadMockSetup } from "../../mock-setup";
import { loadResult, loadSession } from "../../interview-session";
import { recordMockSession } from "../repositories";
import type { MockSession } from "../types";

export function completeMockFromLiveResult(): MockSession | null {
  const feedback = loadResult();
  if (!feedback) return null;

  const setup = loadMockSetup();
  const session = loadSession();
  const startedAt = session?.startedAt;
  const durationMin = startedAt
    ? Math.max(1, Math.round((Date.now() - startedAt) / 60000))
    : 10;

  return recordMockSession({
    setup,
    feedback,
    answers: session?.answers,
    durationMin,
  });
}
