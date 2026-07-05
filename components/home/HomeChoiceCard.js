import Link from "next/link";
import Avatar from "../Avatar";
import { Mic, FileText, ChevronRight } from "../Icons";
import s from "./home-choice-card.module.css";

const DETAIL = {
  interview: { Icon: Mic, label: "Mock interview" },
  apply: { Icon: FileText, label: "CV & applications" },
};

export default function HomeChoiceCard({
  href,
  eyebrow,
  title,
  subtitle,
  cta,
  avatarPose,
  avatarAlt,
  variant = "interview",
}) {
  const { Icon: DetailIcon } = DETAIL[variant] ?? DETAIL.interview;

  return (
    <Link href={href} className={`${s.card} ${s[variant]}`}>
      <span className={s.iconBadge} aria-hidden>
        <DetailIcon size={15} />
      </span>

      <div className={s.content}>
        <span className={s.eyebrow}>{eyebrow}</span>
        <h2 className={s.title}>{title}</h2>
        <p className={s.sub}>{subtitle}</p>
      </div>

      <Avatar
        pose={avatarPose}
        alt={avatarAlt}
        className={`${s.avatar} ${s[`avatar_${variant}`]}`}
      />

      <span className={s.cta}>
        <span className={s.ctaText}>{cta}</span>
        <ChevronRight size={14} className={s.ctaArrow} aria-hidden />
      </span>
    </Link>
  );
}
