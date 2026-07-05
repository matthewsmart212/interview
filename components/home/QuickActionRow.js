import Link from "next/link";
import { ChevronRight } from "../Icons";
import HomeIconTile from "./HomeIconTile";
import s from "./quick-action-row.module.css";

const ICON_SIZE = 18;

export default function QuickActionRow({ href, icon, title, subtitle }) {
  return (
    <Link href={href} className={s.row}>
      <HomeIconTile icon={icon} size={ICON_SIZE} />
      <span className={s.body}>
        <span className={s.title}>{title}</span>
        <span className={s.sub}>{subtitle}</span>
      </span>
      <ChevronRight size={ICON_SIZE} className={s.chev} aria-hidden />
    </Link>
  );
}
