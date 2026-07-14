"use client";

import Link from "next/link";
import {
  AppShell,
  SheetBack,
  EmptyStateCard,
  PrimaryButton,
  PageSection,
} from "../../components/ui";
import { ChevronRight, Mic } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import s from "./history.module.css";

function scoreCls(score) {
  if (score >= 80) return "good";
  if (score < 65) return "low";
  return "";
}

export default function HistoryPage() {
  const { MOCK_HISTORY } = useAppDb();

  return (
    <AppShell
      navActive="progress"
      coachPose="idle"
      coachTitle="Mock history"
      coachSpeech={
        MOCK_HISTORY.length === 0
          ? "Complete a mock and I'll keep every session here for you to revisit."
          : "Tap a session and I'll walk you through what went well — and what to fix."
      }
    >
      <SheetBack href="/progress">Progress</SheetBack>
      <p className={s.sheetTitle}>Past sessions</p>

      {MOCK_HISTORY.length === 0 ? (
        <EmptyStateCard
          icon={Mic}
          title="No mock interviews yet"
          description="Your completed practice sessions will appear here so you can revisit them any time."
        >
          <PrimaryButton href="/mock">Start your first mock</PrimaryButton>
        </EmptyStateCard>
      ) : (
        <>
          <PageSection>
            <div className="stack">
              {MOCK_HISTORY.map((mk) => (
                <Link href={`/history/${mk.id}`} className={s.row} key={mk.id}>
                  <span
                    className={`${s.score} ${scoreCls(mk.score) ? s[scoreCls(mk.score)] : ""}`}
                  >
                    {mk.score}
                  </span>
                  <span className={s.body}>
                    <span className={s.title}>
                      {mk.role} · {mk.company}
                    </span>
                    <span className={s.sub}>
                      {mk.date} · {mk.time} · {mk.questions} questions
                    </span>
                  </span>
                  <ChevronRight size={18} className="chev" />
                </Link>
              ))}
            </div>
          </PageSection>

          <PrimaryButton href="/mock" style={{ marginTop: 20 }}>
            <Mic size={18} /> Start a new mock interview
          </PrimaryButton>
        </>
      )}
    </AppShell>
  );
}
