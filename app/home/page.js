"use client";

import { useEffect, useRef } from "react";
import PersonalizedPageHeader from "../../components/home/PersonalizedPageHeader";
import HomeChoiceCard from "../../components/home/HomeChoiceCard";
import NextInterviewCard from "../../components/home/NextInterviewCard";
import StatPillRow, { StatPill } from "../../components/home/StatPillRow";
import QuickActionRow from "../../components/home/QuickActionRow";
import { AppShell, PageSection } from "../../components/ui";
import { Mic, MessageCircle, Calendar, Plus } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { getSessionUser, pullSupabaseToLocal } from "../../lib/supabase/sync";
import styles from "./home.module.css";

const QUICK_ACTIONS = [
  {
    href: "/mock",
    icon: Mic,
    title: "Mock interview",
    subtitle: "Practice with your AI interviewer",
  },
  {
    href: "/interviews/new",
    icon: Plus,
    title: "Add interview",
    subtitle: "Role, date and job description",
  },
  {
    href: "/questions",
    icon: MessageCircle,
    title: "Interview questions",
    subtitle: "See role-specific questions",
  },
];

export default function HomePage() {
  const { INTERVIEWS, MASTER_CV, MOCK_HISTORY, user } = useAppDb();
  const synced = useRef(false);

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
  const upcomingCount = INTERVIEWS.filter((i) => i.status === "upcoming").length;
  const lastMock = MOCK_HISTORY[0];

  return (
    <AppShell navActive="home" className={styles.home}>
      <PersonalizedPageHeader
        icon="home"
        description={
          next
            ? `Your ${next.company} interview is in ${next.daysAway} days.`
            : "Add an interview, then run a mock — that's the loop."
        }
      />

      <NextInterviewCard interview={next} />

      <StatPillRow>
        <StatPill href="/interviews" icon={Calendar}>
          {upcomingCount} upcoming
        </StatPill>
        {lastMock ? (
          <StatPill href={`/history/${lastMock.id}`} icon={Mic}>
            Last mock {lastMock.score}
          </StatPill>
        ) : (
          <StatPill href="/mock" icon={Mic}>
            Start mock
          </StatPill>
        )}
        <StatPill href="/progress" icon={Calendar}>
          {MOCK_HISTORY.length} mocks
        </StatPill>
      </StatPillRow>

      <hr className={styles.choiceDivider} aria-hidden />

      <div className={styles.choiceGrid}>
        <HomeChoiceCard
          href="/mock"
          variant="interview"
          eyebrow="I have an interview"
          title="Prepare for interview"
          subtitle={
            next
              ? `Mock practice for ${next.company}`
              : "AI mock interviews with feedback"
          }
          cta="Start practice"
          avatarPose="presenting"
          avatarAlt="AI coach ready to mock interview"
        />
        <HomeChoiceCard
          href="/interviews/new"
          variant="apply"
          eyebrow="New opportunity"
          title="Add an interview"
          subtitle="Save the role and job description"
          cta="Add interview"
          avatarPose="thinking"
          avatarAlt="AI coach helping you add an interview"
        />
      </div>

      <PageSection title="Quick actions" className={styles.quickSection}>
        <div className={styles.quickStack}>
          {QUICK_ACTIONS.map((action) => (
            <QuickActionRow key={action.href} {...action} />
          ))}
        </div>
      </PageSection>
    </AppShell>
  );
}
