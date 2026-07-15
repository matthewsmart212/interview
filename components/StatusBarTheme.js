"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const BAR = "#141026";
const PAGE = "#141026";

export default function StatusBarTheme() {
  const pathname = usePathname();

  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", BAR);

    document.documentElement.style.backgroundColor = PAGE;
    document.body.style.backgroundColor = PAGE;
  }, [pathname]);

  return null;
}
