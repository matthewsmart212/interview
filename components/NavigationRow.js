import Link from "next/link";
import { ChevronRight } from "./Icons";
import styles from "./navigation-row.module.css";

/**
 * Compact supporting navigation row (less prominent than PrimaryActionCard).
 */
export default function NavigationRow({
  href,
  icon: Icon,
  title,
  sub,
  className = "",
}) {
  return (
    <Link href={href} className={`${styles.row} ${className}`.trim()}>
      {Icon ? (
        <span className={styles.icon} aria-hidden>
          <Icon size={18} />
        </span>
      ) : null}
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        {sub ? <span className={styles.sub}>{sub}</span> : null}
      </span>
      <ChevronRight size={16} className={styles.chev} aria-hidden />
    </Link>
  );
}
