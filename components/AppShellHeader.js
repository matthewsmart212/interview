"use client";

import { usePathname } from "next/navigation";
import AppHeader from "./AppHeader";

function showAppHeader(pathname) {
  if (pathname === "/") return false;
  if (pathname === "/interview" || pathname.startsWith("/interview/")) {
    return false;
  }
  return true;
}

function isMockHub(pathname) {
  return pathname === "/mock" || pathname.startsWith("/mock/");
}

export default function AppShellHeader() {
  const pathname = usePathname();
  if (!showAppHeader(pathname)) return null;
  return <AppHeader dark={isMockHub(pathname)} />;
}
