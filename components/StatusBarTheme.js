"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DARK = "#241f2e";
const LIGHT = "#f2f2f5";

export default function StatusBarTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const isDark = pathname.startsWith("/interview");
    const color = isDark ? DARK : LIGHT;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);

    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;
  }, [pathname]);

  return null;
}
