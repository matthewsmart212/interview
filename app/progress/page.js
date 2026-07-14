"use client";

import Link from "next/link";
import {
  AppShell,
  EmptyProgressState,
} from "../../components/ui";
import { ChevronRight } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { calculateInterviewReadiness } from "../../lib/readiness";
import styles from "./progress.module.css";

function scoreCls(score) {
  if (score >= 80) return styles.good;
  if (score < 65) return styles.low;
  return "";
}

export default function ProgressPage() {
  const { MOCK_HISTORY, INTERVIEWS, user, USER } = useAppDb();
  const recent = MOCK_HISTORY.slice(0, 6);
  const streak = user?.streak ?? USER?.streak ?? 0;

  const scores = MOCK_HISTORY.map((m) => m.score).filter((n) => typeof n === "number");
  const avg = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;
  const best = scores.length ? Math.max(...scores) : null;
  const count = MOCK_HISTORY.length;

  const upcoming = INTERVIEWS.filter((i) => i.status === "upcoming").sort(
    (a, b) => a.daysAway - b.daysAway
  );
  const readinessFocus = upcoming[0]
    ? calculateInterviewReadiness(upcoming[0])
    : INTERVIEWS.length
      ? Math.round(
          INTERVIEWS.reduce((a, iv) => a + calculateInterviewReadiness(iv), 0) /
            INTERVIEWS.length
        )
      : 0;

  // Aggregate skills from mocks that actually have them
  const skillTotals = {};
  MOCK_HISTORY.forEach((mk) => {
    (mk.skills || []).forEach((sk) => {
      if (!skillTotals[sk.name]) skillTotals[sk.name] = [];
      skillTotals[sk.name].push(sk.value);
    });
  });
  const skillAvgs = Object.entries(skillTotals)
    .map(([name, vals]) => ({
      name,
      value: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    }))
    .sort((a, b) => b.value - a.value);
  const strongest = skillAvgs[0];
  const weakest = skillAvgs[skillAvgs.length - 1];

  const speech =
    count === 0
      ? "Complete your first mock to unlock personalised scores and feedback."
      : `You've done ${count} mock${count === 1 ? "" : "s"}. Average score ${avg}. Keep going.`;

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
      {count === 0 ? (
        <EmptyProgressState streak={streak} />
      ) : (
        <>
          <div className={styles.strip}>
            <div className={styles.stripItem}>
              <span className={styles.stripNum}>{readinessFocus}%</span>
              <span className={styles.stripLab}>Readiness</span>
            </div>
            <div className={styles.stripItem}>
              <span className={styles.stripNum}>{avg}</span>
              <span className={styles.stripLab}>Average</span>
            </div>
            <div className={styles.stripItem}>
              <span className={styles.stripNum}>{best}</span>
              <span className={styles.stripLab}>Best</span>
            </div>
          </div>

          <div className={styles.metaRow}>
            <span>{count} mock{count === 1 ? "" : "s"}</span>
            <span className={styles.dot}>·</span>
            <span>{streak} day streak</span>
          </div>

          {(strongest || weakest) && strongest?.name !== weakest?.name ? (
            <div className={styles.insightRow}>
              {strongest ? (
                <div className={styles.insight}>
                  <span className={styles.insightLab}>Strongest</span>
                  <span className={styles.insightVal}>{strongest.name}</span>
                </div>
              ) : null}
              {weakest ? (
                <div className={styles.insight}>
                  <span className={styles.insightLab}>Improve</span>
                  <span className={styles.insightVal}>{weakest.name}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          {skillAvgs.length > 0 ? (
            <div className={styles.block}>
              <p className="section-title">Category improvements</p>
              <div className={styles.skills}>
                {skillAvgs.map((sk) => (
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
                  <span className={`${styles.score} ${scoreCls(mk.score)}`}>
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
