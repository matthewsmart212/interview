"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CvCreateRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/cv/upload");
  }, [router]);
  return null;
}
