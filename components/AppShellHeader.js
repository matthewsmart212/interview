"use client";

import { usePathname } from "next/navigation";
import AppHeader from "./AppHeader";

function showAppHeader(pathname) {
  if (pathname === "/") return false;
  if (pathname === "/login" || pathname === "/onboarding") return false;
  if (pathname === "/interview" || pathname.startsWith("/interview/")) {
    return false;
  }
  return true;
}

export default function AppShellHeader() {
  const pathname = usePathname();
  if (!showAppHeader(pathname)) return null;
  return <AppHeader />;
}
