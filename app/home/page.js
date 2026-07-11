"use client";

import { useEffect, useRef } from "react";
import PersonalizedPageHeader from "../../components/home/PersonalizedPageHeader";
import HomeChoiceCard from "../../components/home/HomeChoiceCard";
import NextInterviewCard from "../../components/home/NextInterviewCard";
import StatPillRow, { StatPill } from "../../components/home/StatPillRow";
import QuickActionRow from "../../components/home/QuickActionRow";
import { AppShell, PageSection } from "../../components/ui";
import { FileText, Mic, MessageCircle, Calendar } from "../../components/Icons";
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
    href: "/cv",
    icon: FileText,
    title: "My CV",
    subtitle: "Improve, tailor and download",
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
      // Prefer cloud when local is still a blank fresh user
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
            : undefined
        }
      />

      <NextInterviewCard interview={next} />

      <StatPillRow>
        <StatPill href="/interviews" icon={Calendar}>
          {upcomingCount} upcoming
        </StatPill>
        <StatPill href="/cv" icon={FileText}>
          CV score {MASTER_CV.score}
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
              ? `Mock practice & prep for ${next.company}`
              : "AI mock interviews & role prep"
          }
          cta="Start practice"
          avatarPose="presenting"
          avatarAlt="AI coach ready to mock interview"
        />
        <HomeChoiceCard
          href="/cv"
          variant="apply"
          eyebrow="I'm applying"
          title="Get ready to apply"
          subtitle="Improve & tailor your CV for roles"
          cta="Improve CV"
          avatarPose="thinking"
          avatarAlt="AI coach helping with your CV"
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
