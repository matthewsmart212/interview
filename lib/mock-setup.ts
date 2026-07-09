/**
 * Persists mock-interview setup choices (context + CV) so the interview flow
 * can read them on entry. Uses sessionStorage — cleared when the tab closes.
 */

export type MockContextMode = "generic" | "interview" | "jd";
export type MockCvType = "master" | "upload" | "tailored";

export interface MockSetupConfig {
  version: 1;
  contextMode: MockContextMode;
  /** Human-readable label for the confirm screen */
  contextLabel: string;
  interviewId?: string;
  jdText?: string;
  jdFileName?: string;
  cvId: string;
  cvType: MockCvType;
  cvLabel: string;
}

const SETUP_KEY = "ic.mock-setup.v1";
const SETUP_VERSION = 1;

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

/** Build the interview entry URL; heavy JD text stays in sessionStorage. */
export function buildInterviewHref(config: MockSetupConfig): string {
  if (config.contextMode === "interview" && config.interviewId) {
    return `/interview?for=${encodeURIComponent(config.interviewId)}`;
  }
  if (config.contextMode === "jd") {
    return "/interview?jd=1";
  }
  return "/interview";
}
