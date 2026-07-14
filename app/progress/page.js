"use client";

import Link from "next/link";
import { AppShell } from "../../components/ui";
import { ChevronRight } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import styles from "./progress.module.css";

export default function ProgressPage() {
  const { MOCK_HISTORY } = useAppDb();
  const recent = MOCK_HISTORY.slice(0, 6);

  const scores = MOCK_HISTORY.map((m) => m.score).filter((n) => typeof n === "number");
  const avg = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;
  const best = scores.length ? Math.max(...scores) : null;
  const count = MOCK_HISTORY.length;

  const speech =
    count === 0
      ? "Run your first mock and I'll track how you're improving."
      : `You've done ${count} mock${count === 1 ? "" : "s"}. Average score ${avg}. Keep going.`;

  return (
    <AppShell
      navActive="progress"
      coachPose="thumbsup"
      coachTitle="Your progress"
      coachSpeech={speech}
    >
      <div className={styles.strip}>
        <div className={styles.stripItem}>
          <span className={styles.stripNum}>{count}</span>
          <span className={styles.stripLab}>Mocks</span>
        </div>
        <div className={styles.stripItem}>
          <span className={styles.stripNum}>{avg ?? "—"}</span>
          <span className={styles.stripLab}>Average</span>
        </div>
        <div className={styles.stripItem}>
          <span className={styles.stripNum}>{best ?? "—"}</span>
          <span className={styles.stripLab}>Best</span>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <p className="section-title">Recent mocks</p>
          {MOCK_HISTORY.length > 0 ? (
            <Link href="/history" className="link-btn">
              See all
            </Link>
          ) : null}
        </div>

        {recent.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No mocks yet</p>
            <p className={styles.emptySub}>
              Run your first practice and scores will show up here.
            </p>
            <Link href="/mock" className="btn btn-primary" style={{ marginTop: 16 }}>
              Start a mock
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {recent.map((mk) => (
              <Link href={`/history/${mk.id}`} className={styles.row} key={mk.id}>
                <span
                  className={`${styles.score}${
                    mk.score >= 80
                      ? " " + styles.good
                      : mk.score < 65
                        ? " " + styles.low
                        : ""
                  }`}
                >
                  {mk.score}
                </span>
                <span className={styles.body}>
                  <span className={styles.title}>
                    {mk.role} · {mk.company}
                  </span>
                  <span className={styles.sub}>
                    {mk.date} · {mk.questions} questions
                  </span>
                </span>
                <ChevronRight size={17} className={styles.chev} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
