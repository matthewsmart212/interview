"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Mic, BarChart, User } from "./Icons";

const ITEMS = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/cv", label: "CV", Icon: FileText },
  { href: "/interview", label: "Interview", Icon: Mic },
  { href: "/progress", label: "Progress", Icon: BarChart },
  { href: "/profile", label: "Profile", Icon: User },
];

export default function BottomNav({ active }) {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ href, label, Icon }) => {
        const isActive = active
          ? active === label.toLowerCase()
          : pathname === href || pathname.startsWith(href + "/");
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
