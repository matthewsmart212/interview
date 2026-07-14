"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AppShell,
  PrimaryActionCard,
  ReadinessRing,
  SheetPageTitle,
} from "../../components/ui";
import { Mic, Calendar, ChevronRight } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { getSessionUser, pullSupabaseToLocal } from "../../lib/supabase/sync";
import { getFirstName, loadProfile } from "../../lib/onboarding-store";
import { journeyStateFromDb } from "../../lib/app-journey-state";
import styles from "./home.module.css";

function countdownLabel(daysAway) {
  if (daysAway === 0) return "Today";
  if (daysAway === 1) return "Tomorrow";
  return `in ${daysAway} days`;
}

function LastPracticeRow({ mock }) {
  if (!mock) return null;
  return (
    <div className={styles.recent}>
      <p className={styles.sectionLabel}>Last practice</p>
      <Link href={`/history/${mock.id}`} className={styles.recentRow}>
        <span className={styles.recentScore}>{mock.score}</span>
        <span className={styles.recentBody}>
          <span className={styles.recentTitle}>
            {mock.role} · {mock.company}
          </span>
          <span className={styles.recentMeta}>{mock.date}</span>
        </span>
        <span className={styles.recentAction}>Review feedback</span>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const db = useAppDb();
  const { INTERVIEWS, MASTER_CV, user, USER } = db;
  const journey = journeyStateFromDb(db);
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

  const next = journey.nearestUpcoming;
  const lastMock = journey.lastMock;
  const hasUpcoming = journey.hasUpcoming && Boolean(next);

  const speech = hasUpcoming
    ? `${next.company} is in ${next.daysAway} day${next.daysAway === 1 ? "" : "s"}. Let's get you ready.`
    : "Add your next interview and I'll help you prepare, practise and improve.";

  return (
    <AppShell
      navActive="home"
      className={styles.home}
      coachPose="waving"
      coachTitle={`Hi ${firstName}`}
      coachSpeech={speech}
      heroVariant="home"
      messageVariant="default"
      sheetVariant="standard"
      messageClampLines={2}
    >
      <SheetPageTitle>Home</SheetPageTitle>

      {hasUpcoming ? (
        <>
          <Link href={`/interviews/${next.id}`} className={styles.nextCard}>
            <span className={styles.nextMain}>
              <span className={styles.nextLabel}>Next interview</span>
              <span className={styles.nextRole}>{next.role}</span>
              <span className={styles.nextCompany}>{next.company}</span>
              <span className={styles.nextMeta}>
                <Calendar size={12} aria-hidden />
                {next.date}
                <span className={styles.dot}>·</span>
                {countdownLabel(next.daysAway)}
              </span>
            </span>
            <ReadinessRing
              value={journey.nearestReadiness ?? 0}
              size={48}
              stroke={5}
              showLabel
              label="Ready"
            />
            <ChevronRight size={18} className={styles.nextChev} aria-hidden />
          </Link>

          <div className={styles.stack}>
            <PrimaryActionCard
              href="/mock"
              icon={Mic}
              title={`Practise for ${next.company}`}
              sub={`${next.role} · ${countdownLabel(next.daysAway)}`}
              className={styles.primaryCard}
            />

            <Link href={`/interviews/${next.id}`} className={styles.secondaryCard}>
              <span className={styles.secondaryBody}>
                <span className={styles.secondaryTitle}>Continue preparation</span>
                <span className={styles.secondarySub}>
                  {journey.openPrepTasks > 0
                    ? `${journey.openPrepTasks} step${journey.openPrepTasks === 1 ? "" : "s"} left`
                    : "View your preparation plan"}
                </span>
              </span>
              <ChevronRight size={16} className={styles.secondaryChev} aria-hidden />
            </Link>

            <Link href="/mock" className={styles.tertiaryLink}>
              Generic practice
            </Link>
          </div>

          {journey.hasMocks ? <LastPracticeRow mock={lastMock} /> : null}
        </>
      ) : (
        <div className={styles.stack}>
          <PrimaryActionCard
            href="/interviews/new"
            icon={Calendar}
            title="Add your next interview"
            sub="Get tailored questions and a simple preparation plan."
            className={styles.primaryCard}
          />

          <Link href="/mock" className={styles.secondaryCard}>
            <span className={styles.secondaryIcon} aria-hidden>
              <Mic size={18} />
            </span>
            <span className={styles.secondaryBody}>
              <span className={styles.secondaryTitle}>Try a generic mock</span>
              <span className={styles.secondarySub}>
                Practise common questions in 8–10 minutes.
              </span>
            </span>
            <ChevronRight size={16} className={styles.secondaryChev} aria-hidden />
          </Link>

          {journey.hasMocks ? <LastPracticeRow mock={lastMock} /> : null}
        </div>
      )}
    </AppShell>
  );
}
