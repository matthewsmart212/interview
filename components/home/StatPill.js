import Link from "next/link";
import s from "./stat-pill.module.css";

export default function StatPill({ href, icon: Icon, children }) {
  return (
    <Link href={href} className={s.pill}>
      <Icon size={16} />
      {children}
    </Link>
  );
}
