import Link from "next/link";
import Avatar from "../Avatar";
import s from "./home-choice-card.module.css";

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
  return (
    <Link href={href} className={`${s.card} ${s[variant]}`}>
      <div className={s.content}>
        <span className={s.eyebrow}>{eyebrow}</span>
        <h2 className={s.title}>{title}</h2>
        <p className={s.sub}>{subtitle}</p>
      </div>
      <Avatar pose={avatarPose} alt={avatarAlt} className={s.avatar} />
      <span className={s.cta}>{cta}</span>
    </Link>
  );
}
