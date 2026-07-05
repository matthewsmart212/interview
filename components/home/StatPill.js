import Link from "next/link";
import s from "./stat-pill.module.css";

const ICON_SIZE = 18;

export default function StatPill({ href, icon: Icon, children }) {
  return (
    <Link href={href} className={s.pill}>
      <Icon size={ICON_SIZE} />
      <span className={s.label}>{children}</span>
    </Link>
  );
}
