"use client";

import Link from "next/link";
import {
  AppShell,
  InterviewCard,
  EmptyStateCard,
  PrimaryButton,
} from "../../components/ui";
import { Plus, Calendar } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import s from "./interviews.module.css";

export default function InterviewsPage() {
  const { INTERVIEWS } = useAppDb();
  const upcoming = INTERVIEWS.filter((i) => i.status === "upcoming").sort(
    (a, b) => a.daysAway - b.daysAway
  );
  const past = INTERVIEWS.filter((i) => i.status === "past");

  const next = upcoming[0];
  const speech =
    upcoming.length === 0
      ? "Add the interview you're preparing for — I'll build practice around it."
      : upcoming.length === 1
        ? "You've got one upcoming interview."
        : `You've got ${upcoming.length} upcoming interviews.`;

  return (
    <AppShell
      navActive="interviews"
      coachPose="presenting"
      coachTitle="Your interviews"
      coachSpeech={speech}
      heroVariant="medium"
      messageVariant="compact"
      sheetVariant="elevated"
    >
      <div className={s.sheetHead}>
        <p className={s.sheetTitle}>Interviews</p>
        <Link href="/interviews/new" className={s.addBtn}>
          <Plus size={15} stroke={2.6} /> Add
        </Link>
      </div>

      {INTERVIEWS.length === 0 ? (
        <EmptyStateCard
          icon={Calendar}
          title="No interviews yet"
          description="Add a role and job description, then practise mocks against it."
        >
          <PrimaryButton href="/interviews/new">Add an interview</PrimaryButton>
        </EmptyStateCard>
      ) : (
        <>
          {upcoming.length > 0 ? (
            <div className={s.block}>
              <p className="section-title">Upcoming</p>
              <div className={`stack ${s.interviewStack}`}>
                {upcoming.map((iv, i) => (
                  <InterviewCard
                    interview={iv}
                    key={iv.id}
                    featured={i === 0}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {past.length > 0 ? (
            <div className={s.block}>
              <p className="section-title">Past</p>
              <div className={`stack ${s.interviewStack}`}>
                {past.map((iv) => (
                  <InterviewCard interview={iv} key={iv.id} />
                ))}
              </div>
            </div>
          ) : null}

          <p className={s.skipNote}>
            Just want to practise?{" "}
            <Link href="/mock" className="link-btn">
              Start a mock →
            </Link>
          </p>
        </>
      )}
    </AppShell>
  );
}
