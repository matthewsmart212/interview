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
import { journeyStateFromDb } from "../../lib/app-journey-state";
import styles from "./home.module.css";

function countdownLabel(daysAway) {
  if (daysAway === 0) return "Today";
  if (daysAway === 1) return "Tomorrow";
  return `in ${daysAway} days`;
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

  let speech = "Add an interview to get started — I'll guide you from there.";
  if (journey.hasUpcoming && next) {
    speech = `${next.company} is in ${next.daysAway} day${next.daysAway === 1 ? "" : "s"}. Let's get you ready.`;
  } else if (journey.isHistoryOnly) {
    speech = journey.hasMocks
      ? "Nice work practising. Add your next interview when you're ready."
      : "Add your next interview and I'll build a prep plan around it.";
  }

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
      {journey.hasUpcoming && next ? (
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
            size={52}
            stroke={6}
            showLabel
            label="Ready"
          />
          <ChevronRight size={18} className={styles.nextChev} aria-hidden />
        </Link>
      ) : null}

      <div className={styles.primaryStack}>
        {journey.isEmpty ? (
          <>
            <PrimaryActionCard
              href="/interviews/new"
              icon={Plus}
              title="Add an interview"
              sub="Tell me the role and date — I'll build your prep plan."
            />
            <Link href="/mock" className={styles.secondaryCta}>
              Try a generic mock
              <span className={styles.secondaryHint}>
                Practise common questions anytime
              </span>
            </Link>
          </>
        ) : null}

        {journey.isHistoryOnly ? (
          <>
            <PrimaryActionCard
              href="/mock"
              icon={Mic}
              title="Try a generic mock"
              sub="Build confidence with common interview questions"
            />
            <Link href="/interviews/new" className={styles.secondaryCta}>
              Add an interview
              <span className={styles.secondaryHint}>
                Start preparing for your next role
              </span>
            </Link>
          </>
        ) : null}

        {journey.hasUpcoming && next ? (
          <>
            <PrimaryActionCard
              href="/mock"
              icon={Mic}
              title={`Practise for ${next.company}`}
              sub={`${next.role} · ${countdownLabel(next.daysAway)}`}
            />
            {journey.openPrepTasks > 0 ? (
              <Link href={`/interviews/${next.id}`} className={styles.secondaryCta}>
                Continue preparation
                <span className={styles.secondaryHint}>
                  {journey.openPrepTasks} step
                  {journey.openPrepTasks === 1 ? "" : "s"} left
                </span>
              </Link>
            ) : (
              <Link href={`/interviews/${next.id}`} className={styles.secondaryCta}>
                View preparation plan
              </Link>
            )}
            <Link href="/mock" className={styles.tertiaryCta}>
              <Mic size={16} />
              <span>Generic practice</span>
            </Link>
          </>
        ) : null}
      </div>

      {journey.hasMocks && lastMock ? (
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
