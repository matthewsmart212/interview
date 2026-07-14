import Link from "next/link";
import { ChevronRight } from "./Icons";
import styles from "./primary-action-card.module.css";

/**
 * Strong primary CTA card for coach sheets.
 */
export default function PrimaryActionCard({
  href,
  onClick,
  icon: Icon,
  title,
  sub,
  className = "",
}) {
  const content = (
    <>
      {Icon ? (
        <span className={styles.icon} aria-hidden>
          <Icon size={22} />
        </span>
      ) : null}
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        {sub ? <span className={styles.sub}>{sub}</span> : null}
      </span>
      <ChevronRight size={18} className={styles.chev} aria-hidden />
    </>
  );

  const cls = `${styles.card} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} onClick={onClick}>
      {content}
    </button>
  );
}
