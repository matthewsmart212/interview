"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** CV hub removed — redirect to profile where you can replace your CV. */
export default function CvHubRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/profile");
  }, [router]);
  return null;
}
