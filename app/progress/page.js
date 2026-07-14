"use client";

import Link from "next/link";
import {
  AppShell,
  EmptyProgressState,
  ReadinessRing,
} from "../../components/ui";
import { ChevronRight } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { journeyStateFromDb } from "../../lib/app-journey-state";
import styles from "./progress.module.css";

/** Consistent mock score bands used across Progress rows. */
function scoreBand(score) {
  if (score >= 80) return { key: "strong", label: "Strong" };
  if (score >= 65) return { key: "good", label: "Good" };
  return { key: "needs", label: "Needs work" };
}

export default function ProgressPage() {
  const db = useAppDb();
  const journey = journeyStateFromDb(db);
  const { progress, mocks, hasMocks } = journey;
  const recent = mocks.slice(0, 6);

  const speech = !hasMocks
    ? "Complete your first mock to unlock personalised scores and feedback."
    : `You've done ${progress.mockCount} mock${progress.mockCount === 1 ? "" : "s"}${
        progress.averageScore != null ? `. Average score ${progress.averageScore}` : ""
      }. Keep going.`;

  const showInsights =
    progress.strongest &&
    progress.weakest &&
    progress.strongest.name !== progress.weakest.name;

  const readiness = progress.readinessFocus;
  const streakLabel =
    progress.streak > 0
      ? `${progress.streak}-day streak`
      : null;

  return (
    <AppShell
      navActive="progress"
      className={styles.page}
      coachPose="thumbsup"
      coachTitle="Your progress"
      coachSpeech={speech}
      heroVariant="progress"
      messageVariant="compact"
      sheetVariant="elevated"
      messageClampLines={2}
    >
      {!hasMocks ? (
        <EmptyProgressState />
      ) : (
        <>
          <div className={styles.metrics}>
            {readiness != null ? (
              <div className={styles.readinessCard}>
                <div className={styles.readinessCopy}>
                  <span className={styles.readinessLab}>Interview readiness</span>
                  <span className={styles.readinessNum}>{readiness}%</span>
                  <div className={styles.readinessBar} aria-hidden>
                    <i style={{ width: `${Math.max(0, Math.min(100, readiness))}%` }} />
                  </div>
                </div>
                <ReadinessRing value={readiness} size={56} stroke={6} />
              </div>
            ) : null}

            <div className={styles.supportRow}>
              {progress.averageScore != null ? (
                <div className={styles.supportCard}>
                  <span className={styles.supportLab}>Average score</span>
                  <span className={styles.supportNum}>{progress.averageScore}</span>
                </div>
              ) : null}
              {progress.bestScore != null ? (
                <div className={styles.supportCard}>
                  <span className={styles.supportLab}>Best score</span>
                  <span className={styles.supportNum}>{progress.bestScore}</span>
                </div>
              ) : null}
            </div>

            <p className={styles.metaRow}>
              <span>
                {progress.mockCount} mock{progress.mockCount === 1 ? "" : "s"}
              </span>
              {streakLabel ? (
                <>
                  <span className={styles.dot}>·</span>
                  <span>{streakLabel}</span>
                </>
              ) : null}
            </p>
          </div>

          {showInsights ? (
            <div className={styles.insightRow}>
              <div className={styles.insight}>
                <span className={styles.insightLab}>Strongest</span>
                <span className={styles.insightVal}>{progress.strongest.name}</span>
              </div>
              <div className={styles.insight}>
                <span className={styles.insightLab}>Improve</span>
                <span className={styles.insightVal}>{progress.weakest.name}</span>
              </div>
            </div>
          ) : null}

          {progress.skillAvgs.length > 0 ? (
            <div className={styles.block}>
              <p className={styles.sectionLabel}>Skill scores</p>
              <div className={styles.skills}>
                {progress.skillAvgs.map((sk) => (
                  <div className={styles.skillRow} key={sk.name}>
                    <div className={styles.skillTop}>
                      <span>{sk.name}</span>
                      <span className={styles.skillVal}>{sk.value}%</span>
                    </div>
                    <div className={styles.meter}>
                      <i style={{ width: `${sk.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className={styles.block}>
            <div className={styles.blockHead}>
              <p className={styles.sectionLabel}>Recent mocks</p>
              <Link href="/history" className="link-btn">
                See all
              </Link>
            </div>
            <div className={styles.list}>
              {recent.map((mk) => {
                const band = scoreBand(mk.score);
                return (
                  <Link
                    href={`/history/${mk.id}`}
                    className={styles.row}
                    key={mk.id}
                  >
                    <span className={`${styles.score} ${styles[band.key]}`}>
                      {mk.score}
                    </span>
                    <span className={styles.body}>
                      <span className={styles.title}>
                        {mk.role} · {mk.company}
                      </span>
                      <span className={styles.sub}>
                        {mk.date} · {mk.questions} questions
                      </span>
                      <span className={`${styles.band} ${styles[`band_${band.key}`]}`}>
                        {band.label}
                      </span>
                    </span>
                    <ChevronRight size={16} className={styles.chev} />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
