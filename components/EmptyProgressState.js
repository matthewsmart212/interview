import Link from "next/link";
import { Mic } from "./Icons";
import styles from "./empty-progress.module.css";

/**
 * Focused empty state for Progress when no mocks exist yet.
 * No fake scores or fabricated metrics.
 */
export default function EmptyProgressState() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.title}>Your progress starts with one mock</p>
        <p className={styles.body}>
          Complete a practice interview to unlock scores, strengths and
          personalised feedback.
        </p>
        <Link href="/mock" className={`btn btn-primary ${styles.cta}`}>
          <Mic size={17} /> Start your first mock
        </Link>
      </div>
    </div>
  );
}
