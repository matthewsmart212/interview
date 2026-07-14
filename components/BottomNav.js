"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, BarChart, Mic } from "./Icons";

const ITEMS = [
  { href: "/home", label: "Home", Icon: Home, key: "home" },
  { href: "/interviews", label: "Interviews", Icon: Calendar, key: "interviews" },
  { href: "/mock", label: "Mock", Icon: Mic, key: "mock", center: true },
  { href: "/progress", label: "Progress", Icon: BarChart, key: "progress" },
];

export default function BottomNav({ active }) {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {ITEMS.map(({ href, label, Icon, key, center }) => {
        const isActive = active
          ? active === key
          : pathname === href || pathname.startsWith(href + "/");

        if (center) {
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item nav-item-mock${isActive ? " active" : ""}`}
              aria-label="Mock Interview"
              aria-current={isActive ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                <span className="nav-mock-btn">
                  <Mic size={24} stroke={2.1} />
                </span>
              </span>
              <span className="nav-label">{label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={`nav-item${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="nav-icon" aria-hidden="true">
              <Icon size={22} stroke={isActive ? 2.3 : 1.9} />
            </span>
            <span className="nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
