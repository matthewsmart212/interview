/**
 * Persists mock-interview setup so the interview flow can read it on entry.
 * sessionStorage — cleared when the tab closes.
 *
 * Modes: generic practice OR an upcoming interview (JD comes from that interview).
 */

export type MockContextMode = "generic" | "interview";

export interface MockSetupConfig {
  version: 2;
  contextMode: MockContextMode;
  contextLabel: string;
  interviewId?: string;
  /** Always the user's permanent CV when present. */
  hasCv: boolean;
  cvLabel: string;
}

const SETUP_KEY = "ic.mock-setup.v1";
const SETUP_VERSION = 2;

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveMockSetup(config: Omit<MockSetupConfig, "version">): void {
  const payload: MockSetupConfig = { ...config, version: SETUP_VERSION };
  storage()?.setItem(SETUP_KEY, JSON.stringify(payload));
}

export function loadMockSetup(): MockSetupConfig | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(SETUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockSetupConfig;
    if (parsed?.version !== SETUP_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearMockSetup(): void {
  storage()?.removeItem(SETUP_KEY);
}

export function buildInterviewHref(config: MockSetupConfig): string {
  if (config.contextMode === "interview" && config.interviewId) {
    return `/interview?for=${encodeURIComponent(config.interviewId)}`;
  }
  return "/interview";
}
