import Link from "next/link";
import { ChevronLeft } from "./Icons";
import styles from "./sheet-back.module.css";

/**
 * Back control for the coach options sheet (replaces PageHeader on coach pages).
 */
export default function SheetBack({ href, onClick, children = "Back" }) {
  if (onClick) {
    return (
      <button type="button" className={styles.back} onClick={onClick}>
        <ChevronLeft size={18} />
        {children}
      </button>
    );
  }

  return (
    <Link href={href || "/"} className={styles.back}>
      <ChevronLeft size={18} />
      {children}
    </Link>
  );
}
