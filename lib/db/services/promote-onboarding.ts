/**
 * Promote onboarding answers into the durable app store.
 */

import type { OnboardingProfile } from "../../onboarding-store";
import { getState, setState, resetToEmpty } from "../store";
import { buildEmptyMasterCv } from "../seed";
import {
  createInterview,
  createMasterCvFromForm,
  uploadMasterCv,
  updateUser,
} from "../repositories";
import { formatDisplayDate } from "../ids";

export function promoteOnboarding(profile: OnboardingProfile, options?: {
  /** Wipe demo seed and start from this user's data only. */
  fresh?: boolean;
}): void {
  if (options?.fresh) {
    resetToEmpty();
  }

  const name = profile.name.trim() || getState().user.name || "Friend";

  updateUser({
    name,
    goal: profile.goal,
    preferences: { ...profile.preferences },
    onboardingCompletedAt: profile.completedAt ?? Date.now(),
  });

  // CV
  if (profile.cv.source === "upload" && profile.cv.fileName) {
    uploadMasterCv({
      fileName: profile.cv.fileName,
      summary:
        "Uploaded during onboarding. Improve and tailor it for each interview.",
      score: 70,
    });
  } else if (profile.cv.source === "create") {
    createMasterCvFromForm({
      targetRole: profile.cv.targetRole,
      about:
        profile.cv.about?.trim() ||
        `${name} is building a CV for ${profile.cv.targetRole || "their next role"}.`,
      jobs: (profile.cv.jobs ?? []).filter((j) => j.role.trim()),
      skills: profile.cv.skills ?? [],
    });
  } else if (options?.fresh) {
    setState((s) => ({ ...s, masterCv: buildEmptyMasterCv(), cvHistory: [] }));
  }

  // First interview from onboarding
  if (
    (profile.goal === "interview" || profile.goal === "both") &&
    profile.interview.role.trim()
  ) {
    const existing = getState().interviews.find(
      (iv) =>
        iv.role.toLowerCase() === profile.interview.role.trim().toLowerCase() &&
        iv.company.toLowerCase() ===
          (profile.interview.company.trim() || "company").toLowerCase()
    );
    if (!existing) {
      createInterview({
        role: profile.interview.role,
        company: profile.interview.company || undefined,
        type: profile.interview.type,
        date: profile.interview.date || formatDisplayDate(new Date(Date.now() + 7 * 86400000)),
        jd: profile.interview.hasJd ? profile.interview.jd : undefined,
      });
    }
  }
}
