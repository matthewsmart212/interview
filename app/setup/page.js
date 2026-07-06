"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy route — onboarding replaced the old single-step setup. */
export default function SetupRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);

  return null;
}
