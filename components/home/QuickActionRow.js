import Link from "next/link";
import { ChevronRight } from "../Icons";
import s from "./quick-action-row.module.css";

export default function QuickActionRow({ href, icon: Icon, title, subtitle }) {
  return (
    <Link href={href} className={s.row}>
      <span className={s.icon}>
        <Icon size={18} />
      </span>
      <span className={s.body}>
        <span className={s.title}>{title}</span>
        <span className={s.sub}>{subtitle}</span>
      </span>
      <ChevronRight size={18} className={s.chev} />
    </Link>
  );
}
