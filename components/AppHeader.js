"use client";

import Link from "next/link";
import { Menu, Settings } from "./Icons";
import Logo from "./Logo";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header-side">
        <button type="button" className="icon-btn" aria-label="Open menu">
          <Menu size={24} />
        </button>
      </div>
      <div className="app-header-logo">
        <Logo size="md" priority />
      </div>
      <div className="app-header-side right">
        <Link href="/profile" className="icon-btn" aria-label="Settings">
          <Settings size={22} />
        </Link>
      </div>
    </header>
  );
}
