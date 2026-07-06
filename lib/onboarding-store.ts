/**
 * Front-end onboarding profile — persisted in localStorage until a backend exists.
 */

export type UserGoal = "interview" | "apply" | "practice" | "both";

export type CvSource = "upload" | "create" | "skip";

export type InterviewType = "In-person" | "Phone" | "Video";

export interface CvJob {
  role: string;
  company: string;
  period: string;
}

export interface OnboardingCv {
  source: CvSource | null;
  fileName?: string;
  targetRole?: string;
  about?: string;
  jobs?: CvJob[];
  skills?: string[];
}

export interface OnboardingInterview {
  role: string;
  company: string;
  type: InterviewType;
  date: string;
  hasJd: boolean;
  jd: string;
}

export interface OnboardingApply {
  targetRole: string;
  hasJd: boolean;
  jd: string;
}

export interface OnboardingPreferences {
  interviewFormat: InterviewType;
  voicePractice: boolean;
}

export interface OnboardingProfile {
  version: 1;
  completedAt: number | null;
  name: string;
  goal: UserGoal | null;
  cv: OnboardingCv;
  interview: OnboardingInterview;
  apply: OnboardingApply;
  preferences: OnboardingPreferences;
}

const STORAGE_KEY = "ic.onboarding.v1";
const VERSION = 1 as const;

export function defaultProfile(): OnboardingProfile {
  return {
    version: VERSION,
    completedAt: null,
    name: "",
    goal: null,
    cv: { source: null },
    interview: {
      role: "",
      company: "",
      type: "In-person",
      date: "",
      hasJd: false,
      jd: "",
    },
    apply: {
      targetRole: "",
      hasJd: false,
      jd: "",
    },
    preferences: {
      interviewFormat: "In-person",
      voicePractice: true,
    },
  };
}

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function loadProfile(): OnboardingProfile | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingProfile;
    if (parsed?.version !== VERSION) return null;
    return { ...defaultProfile(), ...parsed };
  } catch {
    return null;
  }
}

export function saveProfile(profile: OnboardingProfile): void {
  storage()?.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  storage()?.removeItem(STORAGE_KEY);
}

export function isOnboardingComplete(): boolean {
  const p = loadProfile();
  return Boolean(p?.completedAt);
}

export function completeOnboarding(profile: OnboardingProfile): OnboardingProfile {
  const next = { ...profile, completedAt: Date.now() };
  saveProfile(next);
  return next;
}

export type OnboardingStepId =
  | "welcome"
  | "goal"
  | "cv"
  | "interview"
  | "jd"
  | "apply"
  | "prefs"
  | "done";

export function getStepsForGoal(goal: UserGoal | null): OnboardingStepId[] {
  const steps: OnboardingStepId[] = ["welcome", "goal", "cv"];

  if (goal === "interview" || goal === "both") {
    steps.push("interview", "jd");
  } else if (goal === "apply") {
    steps.push("apply");
  }

  steps.push("prefs", "done");
  return steps;
}

export function getDisplayName(profile: OnboardingProfile | null): string {
  if (profile?.name?.trim()) return profile.name.trim();
  return "there";
}

export function getFirstName(profile: OnboardingProfile | null): string {
  const name = profile?.name?.trim();
  if (!name) return "there";
  return name.split(/\s+/)[0] ?? name;
}

/** Where to send the user right after onboarding. */
export function getPostOnboardingRoute(profile: OnboardingProfile): string {
  switch (profile.goal) {
    case "interview":
    case "both":
      return "/mock";
    case "apply":
      return profile.cv.source === "skip" ? "/cv/start" : "/cv";
    case "practice":
      return "/mock";
    default:
      return "/home";
  }
}

export function getPostOnboardingCta(profile: OnboardingProfile): {
  label: string;
  href: string;
  secondary?: { label: string; href: string };
} {
  switch (profile.goal) {
    case "interview":
    case "both":
      return {
        label: "Start my first mock",
        href: "/mock",
        secondary: { label: "View my dashboard", href: "/home" },
      };
    case "apply":
      return profile.cv.source === "skip"
        ? {
            label: "Set up my CV",
            href: "/cv/start",
            secondary: { label: "Explore the app", href: "/home" },
          }
        : {
            label: "Improve my CV",
            href: "/cv",
            secondary: { label: "View my dashboard", href: "/home" },
          };
    case "practice":
      return {
        label: "Start practising",
        href: "/mock",
        secondary: { label: "View my dashboard", href: "/home" },
      };
    default:
      return { label: "Go to dashboard", href: "/home" };
  }
}
