"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const INTERVIEW = "#302651";
const LIGHT = "#f2f2f5";

/** True only for the immersive mock-interview flow, not /interviews management. */
function isMockInterviewRoute(pathname) {
  return pathname === "/interview" || pathname.startsWith("/interview/");
}

export default function StatusBarTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const isInterview = isMockInterviewRoute(pathname);
    const theme = isInterview ? INTERVIEW : LIGHT;
    const pageBg = isInterview ? "#4a3d78" : LIGHT;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", theme);

    document.documentElement.style.backgroundColor = pageBg;
    document.body.style.backgroundColor = pageBg;
  }, [pathname]);

  return null;
}
