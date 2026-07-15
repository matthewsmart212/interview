"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AppShell,
  PrimaryActionCard,
  ReadinessRing,
} from "../../components/ui";
import { Mic, Calendar, Clock, ChevronRight, FileText } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { getSessionUser, pullSupabaseToLocal } from "../../lib/supabase/sync";
import { getFirstName, loadProfile } from "../../lib/onboarding-store";
import { journeyStateFromDb } from "../../lib/app-journey-state";
import styles from "./home.module.css";

function countdownLabel(daysAway) {
  if (daysAway === 0) return "Today";
  if (daysAway === 1) return "Tomorrow";
  return `${daysAway} days`;
}

function countdownPhrase(daysAway) {
  if (daysAway === 0) return "today";
  if (daysAway === 1) return "tomorrow";
  return `${daysAway} days`;
}

function HomeHero({ firstName, next, hasUpcoming }) {
  return (
    <div className={styles.heroCopy}>
      <h1 className={styles.greeting}>
        Hi {firstName} <span aria-hidden>👋</span>
      </h1>
      {hasUpcoming ? (
        <>
          <p className={styles.statusLine}>
            {next.company} interview in{" "}
            <strong>{countdownPhrase(next.daysAway)}.</strong>
          </p>
          <p className={styles.statusSub}>Let&apos;s make sure you&apos;re ready.</p>
          <div className={styles.chips}>
            <span className={styles.chip}>
              <Calendar size={13} aria-hidden />
              <span>
                <b>{next.date}</b>
                <i>Interview date</i>
              </span>
            </span>
            <span className={styles.chip}>
              <Clock size={13} aria-hidden />
              <span>
                <b>{countdownLabel(next.daysAway)}</b>
                <i>To go</i>
              </span>
            </span>
          </div>
        </>
      ) : (
        <>
          <p className={styles.statusLine}>
            Ready when you are.
          </p>
          <p className={styles.statusSub}>
            Add your next interview and I&apos;ll help you prepare.
          </p>
        </>
      )}
    </div>
  );
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
        <span className={styles.recentAction}>
          Review feedback <ChevronRight size={14} aria-hidden />
        </span>
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
  const readiness = journey.nearestReadiness ?? 0;

  return (
    <AppShell
      navActive="home"
      className={styles.home}
      coachPose="idle"
      heroVariant="home"
      messageVariant="none"
      heroSlot={
        <HomeHero
          firstName={firstName}
          next={next}
          hasUpcoming={hasUpcoming}
        />
      }
    >
      {hasUpcoming ? (
        <>
          <Link href={`/interviews/${next.id}`} className={styles.nextCard}>
            <span className={styles.nextMain}>
              <span className={styles.nextLabel}>Next interview</span>
              <span className={styles.nextRole}>{next.role}</span>
              <span className={styles.nextCompany}>{next.company}</span>
              <span className={styles.nextMeta}>
                <span>
                  <Calendar size={12} aria-hidden />
                  {next.date}
                </span>
                <span>
                  <Clock size={12} aria-hidden />
                  {countdownLabel(next.daysAway)}
                </span>
              </span>
            </span>
            <ReadinessRing
              value={readiness}
              size={64}
              stroke={6}
              showLabel
              label="Ready"
              className={styles.readyRing}
            />
            <ChevronRight size={18} className={styles.nextChev} aria-hidden />
          </Link>

          <div className={styles.stack}>
            <PrimaryActionCard
              href="/mock"
              icon={Mic}
              title={`Practise for ${next.company}`}
              sub="Start a mock interview"
              className={styles.primaryCard}
            />

            <Link href={`/interviews/${next.id}`} className={styles.secondaryCard}>
              <span className={styles.secondaryIcon} aria-hidden>
                <FileText size={18} />
              </span>
              <span className={styles.secondaryBody}>
                <span className={styles.secondaryTitle}>Continue preparation</span>
                <span className={styles.secondarySub}>
                  View your preparation plan
                </span>
              </span>
              <ChevronRight size={16} className={styles.secondaryChev} aria-hidden />
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
            sub="Get a prep plan tailored to the role"
            className={styles.primaryCard}
          />

          <Link href="/mock" className={styles.secondaryCard}>
            <span className={styles.secondaryIcon} aria-hidden>
              <Mic size={18} />
            </span>
            <span className={styles.secondaryBody}>
              <span className={styles.secondaryTitle}>Try a generic mock</span>
              <span className={styles.secondarySub}>
                Practise common questions in 8–10 minutes
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
