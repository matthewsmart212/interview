import Link from "next/link";
import Avatar from "../Avatar";
import { Mic, FileText, ChevronRight } from "../Icons";
import s from "./home-choice-card.module.css";

const DETAIL = {
  interview: Mic,
  apply: FileText,
};

const ICON_SIZE = 16;
const CTA_ARROW = 13;

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
  const DetailIcon = DETAIL[variant] ?? DETAIL.interview;

  return (
    <Link href={href} className={`${s.card} ${s[variant]}`}>
      <div className={s.top}>
        <div className={s.textScrim} aria-hidden />
        <span className={s.iconBadge} aria-hidden>
          <DetailIcon size={ICON_SIZE} />
        </span>
        <div className={s.content}>
          <span className={s.eyebrow}>{eyebrow}</span>
          <h2 className={s.title}>{title}</h2>
          <p className={s.sub}>{subtitle}</p>
        </div>
      </div>

      <div className={s.avatarStage} aria-hidden>
        <Avatar
          pose={avatarPose}
          alt={avatarAlt}
          className={`${s.avatar} ${s[`avatar_${variant}`]}`}
        />
      </div>

      <div className={s.footer}>
        <span className={s.cta}>
          <span className={s.ctaText}>{cta}</span>
          <ChevronRight size={CTA_ARROW} className={s.ctaArrow} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
