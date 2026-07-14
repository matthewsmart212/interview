"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Avatar from "../../components/Avatar";
import { AppShell } from "../../components/ui";
import { Mic, Plus, ChevronRight, Calendar } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { getSessionUser, pullSupabaseToLocal } from "../../lib/supabase/sync";
import { getFirstName, loadProfile } from "../../lib/onboarding-store";
import styles from "./home.module.css";

export default function HomePage() {
  const { INTERVIEWS, MASTER_CV, MOCK_HISTORY, user, USER } = useAppDb();
  const synced = useRef(false);
  const [firstName, setFirstName] = useState(
    (USER.name || "").split(/\s+/)[0] || "there"
  );

  useEffect(() => {
    const profile = loadProfile();
    if (profile?.name?.trim()) setFirstName(getFirstName(profile));
    else if (USER.name) setFirstName(USER.name.split(/\s+/)[0]);
  }, [USER.name]);

  useEffect(() => {
    if (synced.current) return;
    synced.current = true;
    (async () => {
      const sessionUser = await getSessionUser();
      if (!sessionUser) return;
      if (!user?.onboardingCompletedAt && !MASTER_CV.exists && INTERVIEWS.length === 0) {
        await pullSupabaseToLocal();
      }
    })();
  }, [user, MASTER_CV.exists, INTERVIEWS.length]);

  const next = INTERVIEWS.filter((i) => i.status === "upcoming").sort(
    (a, b) => a.daysAway - b.daysAway
  )[0];
  const lastMock = MOCK_HISTORY[0];

  return (
    <AppShell navActive="home" className={styles.home}>
      <div className={styles.coachIntro}>
        <div className={styles.coachCopy}>
          <p className={styles.eyebrow}>Your coach</p>
          <h1 className={styles.greeting}>Hi {firstName}.</h1>
          <p className={styles.lead}>
            {next
              ? `${next.company} is in ${next.daysAway} day${next.daysAway === 1 ? "" : "s"}. Let's practise.`
              : "Add an interview, then run a mock. That's the whole loop."}
          </p>
        </div>
        <Avatar
          pose="waving"
          alt="AI coach"
          className={styles.coachAvatar}
        />
      </div>

      {next ? (
        <Link href={`/interviews/${next.id}`} className={styles.nextCard}>
          <span className={styles.nextIcon}>
            <Calendar size={18} />
          </span>
          <span className={styles.nextBody}>
            <span className={styles.nextLabel}>Next interview</span>
            <span className={styles.nextTitle}>
              {next.role} · {next.company}
            </span>
            <span className={styles.nextMeta}>
              {next.date}
              {next.hasJD ? " · JD ready" : " · Add a job description"}
            </span>
          </span>
          <ChevronRight size={18} className={styles.nextChev} />
        </Link>
      ) : null}

      <div className={styles.primaryStack}>
        <Link href="/mock" className={styles.primaryCta}>
          <span className={styles.primaryIcon}>
            <Mic size={22} />
          </span>
          <span className={styles.primaryText}>
            <span className={styles.primaryTitle}>Start a mock interview</span>
            <span className={styles.primarySub}>
              {next
                ? `Practise for ${next.company}`
                : "Generic practice or pick an interview"}
            </span>
          </span>
          <ChevronRight size={18} />
        </Link>

        <Link href="/interviews/new" className={styles.secondaryCta}>
          <Plus size={18} />
          <span>Add an interview</span>
        </Link>
      </div>

      {lastMock ? (
        <div className={styles.recent}>
          <p className="section-title">Last practice</p>
          <Link href={`/history/${lastMock.id}`} className={styles.recentRow}>
            <span className={styles.recentScore}>{lastMock.score}</span>
            <span className={styles.recentBody}>
              <span className={styles.recentTitle}>
                {lastMock.role} · {lastMock.company}
              </span>
              <span className={styles.recentSub}>{lastMock.date}</span>
            </span>
            <ChevronRight size={16} className={styles.nextChev} />
          </Link>
        </div>
      ) : null}
    </AppShell>
  );
}
