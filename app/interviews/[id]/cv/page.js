"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

/** Tailored CV per interview removed — JD + mocks live on the interview. */
export default function InterviewCvRedirect() {
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    router.replace(`/interviews/${id}`);
  }, [router, id]);
  return null;
}
