import Link from "next/link";
import { Mic } from "./Icons";
import styles from "./empty-progress.module.css";

/**
 * Motivating empty state for Progress when no mocks exist yet.
 */
export default function EmptyProgressState({ streak = 0 }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.strip}>
        <div className={styles.item}>
          <span className={styles.num}>Not started</span>
          <span className={styles.lab}>Interview readiness</span>
        </div>
        <div className={styles.item}>
          <span className={styles.num}>0</span>
          <span className={styles.lab}>Mocks completed</span>
        </div>
        <div className={styles.item}>
          <span className={styles.num}>{streak}</span>
          <span className={styles.lab}>Day streak</span>
        </div>
      </div>

      <p className={styles.explain}>
        Complete your first mock to unlock scores, strengths and personalised
        improvement areas.
      </p>

      <Link href="/mock" className={`btn btn-primary ${styles.cta}`}>
        <Mic size={17} /> Start your first mock
      </Link>
    </div>
  );
}
