"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Calendar, BarChart, Mic } from "./Icons";

const ITEMS = [
  { href: "/home", label: "Home", Icon: Home, key: "home" },
  { href: "/interviews", label: "Interviews", Icon: Calendar, key: "interviews" },
  { href: "/mock", label: "Mock", Icon: Mic, key: "mock", center: true },
  { href: "/cv", label: "CV", Icon: FileText, key: "cv" },
  { href: "/progress", label: "Progress", Icon: BarChart, key: "progress" },
];

export default function BottomNav({ active }) {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
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
            >
              <span className="nav-mock-btn">
                <Mic size={24} stroke={2.1} />
              </span>
              <span>{label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={`nav-item${isActive ? " active" : ""}`}
          >
            <Icon size={22} stroke={isActive ? 2.3 : 1.9} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
