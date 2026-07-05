import Link from "next/link";
import s from "./feature-card.module.css";

export default function FeatureCard({
  href,
  kicker,
  title,
  description,
  children,
  variant = "hero",
  className = "",
}) {
  const cls = `${s.card} ${s[variant]}${className ? ` ${className}` : ""}`;

  const content = (
    <>
      {kicker ? <div className={s.kicker}>{kicker}</div> : null}
      {title ? <div className={s.title}>{title}</div> : null}
      {description ? <p className={s.sub}>{description}</p> : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }

  return <div className={cls}>{content}</div>;
}
