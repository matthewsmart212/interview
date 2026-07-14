"use client";

import Link from "next/link";
import {
  AppShell,
  EmptyProgressState,
} from "../../components/ui";
import { ChevronRight } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { journeyStateFromDb } from "../../lib/app-journey-state";
import styles from "./progress.module.css";

function scoreCls(score, stylesMap) {
  if (score >= 80) return stylesMap.good;
  if (score < 65) return stylesMap.low;
  return "";
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

  return (
    <AppShell
      navActive="progress"
      coachPose="thumbsup"
      coachTitle="Your progress"
      coachSpeech={speech}
      heroVariant="medium"
      messageVariant="compact"
      sheetVariant="elevated"
    >
      {!hasMocks ? (
        <EmptyProgressState streak={0} />
      ) : (
        <>
          <div className={styles.strip}>
            {progress.readinessFocus != null ? (
              <div className={styles.stripItem}>
                <span className={styles.stripNum}>{progress.readinessFocus}%</span>
                <span className={styles.stripLab}>Readiness</span>
              </div>
            ) : null}
            {progress.averageScore != null ? (
              <div className={styles.stripItem}>
                <span className={styles.stripNum}>{progress.averageScore}</span>
                <span className={styles.stripLab}>Average</span>
              </div>
            ) : null}
            {progress.bestScore != null ? (
              <div className={styles.stripItem}>
                <span className={styles.stripNum}>{progress.bestScore}</span>
                <span className={styles.stripLab}>Best</span>
              </div>
            ) : null}
          </div>

          <div className={styles.metaRow}>
            <span>
              {progress.mockCount} mock{progress.mockCount === 1 ? "" : "s"}
            </span>
            {progress.streak > 0 ? (
              <>
                <span className={styles.dot}>·</span>
                <span>{progress.streak} day streak</span>
              </>
            ) : null}
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
              <p className="section-title">Category improvements</p>
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
              <p className="section-title">Recent mocks</p>
              <Link href="/history" className="link-btn">
                See all
              </Link>
            </div>
            <div className={styles.list}>
              {recent.map((mk) => (
                <Link href={`/history/${mk.id}`} className={styles.row} key={mk.id}>
                  <span className={`${styles.score} ${scoreCls(mk.score, styles)}`}>
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
          </div>
        </>
      )}
    </AppShell>
  );
}
