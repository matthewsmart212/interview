"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AppShell,
  PrimaryActionCard,
  NavigationRow,
  ReadinessRing,
} from "../../components/ui";
import { Mic, Plus, ChevronRight, Calendar } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { getSessionUser, pullSupabaseToLocal } from "../../lib/supabase/sync";
import { getFirstName, loadProfile } from "../../lib/onboarding-store";
import {
  calculateInterviewReadiness,
  buildPrepRoadmap,
} from "../../lib/readiness";
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
  const readiness = next ? calculateInterviewReadiness(next) : 0;
  const openPrepTasks = next
    ? buildPrepRoadmap(next, { mocks: MOCK_HISTORY.filter((m) => m.interviewId === next.id) }).filter(
        (t) => !t.done
      ).length
    : 0;

  const speech = next
    ? `${next.company} is in ${next.daysAway} day${next.daysAway === 1 ? "" : "s"}. Let's get you ready.`
    : "Add an interview, then run a mock. I'll guide you the whole way.";

  const countdown =
    next == null
      ? ""
      : next.daysAway === 0
        ? "Today"
        : next.daysAway === 1
          ? "Tomorrow"
          : `in ${next.daysAway} days`;

  return (
    <AppShell
      navActive="home"
      className={styles.home}
      coachPose="waving"
      coachTitle={`Hi ${firstName}`}
      coachSpeech={speech}
      heroVariant="large"
      messageVariant="default"
      sheetVariant="standard"
    >
      {next ? (
        <Link href={`/interviews/${next.id}`} className={styles.nextCard}>
          <span className={styles.nextMain}>
            <span className={styles.nextLabel}>Next interview</span>
            <span className={styles.nextRole}>{next.role}</span>
            <span className={styles.nextCompany}>{next.company}</span>
            <span className={styles.nextMeta}>
              <Calendar size={12} aria-hidden />
              {next.date}
              <span className={styles.dot}>·</span>
              {countdown}
            </span>
          </span>
          <ReadinessRing value={readiness} size={52} stroke={6} showLabel label="Ready" />
          <ChevronRight size={18} className={styles.nextChev} aria-hidden />
        </Link>
      ) : null}

      <div className={styles.primaryStack}>
        <PrimaryActionCard
          href="/mock"
          icon={Mic}
          title="Start a mock interview"
          sub={
            next
              ? `Practise for ${next.company}`
              : "Generic practice or pick an interview"
          }
        />

        {next && openPrepTasks > 0 ? (
          <Link href={`/interviews/${next.id}`} className={styles.secondaryCta}>
            Continue preparation
            <span className={styles.secondaryHint}>
              {openPrepTasks} step{openPrepTasks === 1 ? "" : "s"} left
            </span>
          </Link>
        ) : null}

        <Link href="/interviews/new" className={styles.tertiaryCta}>
          <Plus size={16} />
          <span>Add an interview</span>
        </Link>
      </div>

      {lastMock ? (
        <div className={styles.recent}>
          <p className={styles.sectionLabel}>Last practice</p>
          <NavigationRow
            href={`/history/${lastMock.id}`}
            title={`${lastMock.role} · ${lastMock.company}`}
            sub={`${lastMock.date} · Score ${lastMock.score}`}
          />
        </div>
      ) : null}
    </AppShell>
  );
}
