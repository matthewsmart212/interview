/**
 * Full local wipe — app state, onboarding, mock handoff, live session.
 * After this, the next visit should show welcome / onboarding again.
 */

import { clearAppData, resetToEmpty } from "../store";
import { clearProfile } from "../../onboarding-store";
import { clearMockSetup } from "../../mock-setup";
import { clearSession, clearResult } from "../../interview-session";

export function resetToFreshOnboarding(): void {
  resetToEmpty();
  clearAppData();
  clearProfile();
  clearMockSetup();
  clearSession();
  clearResult();
}
