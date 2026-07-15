/**
 * Promote onboarding answers into the durable app store.
 */

import type { OnboardingProfile } from "../../onboarding-store";
import { getState, setState, resetToEmpty } from "../store";
import { buildEmptyMasterCv } from "../seed";
import {
  createInterview,
  uploadMasterCv,
  updateUser,
} from "../repositories";
import { formatDisplayDate } from "../ids";

export function promoteOnboarding(profile: OnboardingProfile, options?: {
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

  if (profile.cv.source === "upload" && profile.cv.fileName) {
    uploadMasterCv({
      fileName: profile.cv.fileName,
      summary:
        "Uploaded during onboarding. Used to personalise your mock interviews.",
      score: 70,
      text: profile.cv.text,
    });
  } else if (options?.fresh) {
    setState((s) => ({ ...s, masterCv: buildEmptyMasterCv() }));
  }

  if (
    (profile.goal === "interview" || profile.goal === "both" || profile.goal === "practice") &&
    profile.interview.role.trim()
  ) {
    const existing = getState().interviews.find(
      (iv) =>
        iv.role.toLowerCase() === profile.interview.role.trim().toLowerCase() &&
        iv.company.toLowerCase() ===
          (profile.interview.company.trim() || "company").toLowerCase()
    );
    if (!existing && profile.interview.role.trim()) {
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
