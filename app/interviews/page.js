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
import { journeyStateFromDb } from "../../lib/app-journey-state";
import s from "./interviews.module.css";

export default function InterviewsPage() {
  const db = useAppDb();
  const journey = journeyStateFromDb(db);
  const { upcoming, past, nearestUpcoming } = journey;

  const speech = journey.isEmpty
    ? "Add an upcoming interview and I'll build your preparation plan around it."
    : journey.hasUpcoming
      ? upcoming.length === 1
        ? "You've got one upcoming interview."
        : `You've got ${upcoming.length} upcoming interviews.`
      : "Nothing coming up yet — add your next interview when you're ready.";

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

      {journey.isEmpty ? (
        <EmptyStateCard
          icon={Calendar}
          title="No interviews yet"
          description="Add an upcoming interview and I'll build your preparation plan around it."
        >
          <PrimaryButton href="/interviews/new">Add an interview</PrimaryButton>
          <p className={s.skipNote} style={{ marginTop: 16 }}>
            Just want to practise?{" "}
            <Link href="/mock" className="link-btn">
              Start a generic mock
            </Link>
          </p>
        </EmptyStateCard>
      ) : (
        <>
          <div className={s.block}>
            <p className="section-title">Upcoming</p>
            {upcoming.length > 0 ? (
              <div className={`stack ${s.interviewStack}`}>
                {upcoming.map((iv, i) => (
                  <InterviewCard
                    interview={iv}
                    key={iv.id}
                    featured={i === 0 && iv.id === nearestUpcoming?.id}
                  />
                ))}
              </div>
            ) : (
              <div className={s.upcomingEmpty}>
                <p className={s.upcomingEmptyTitle}>Nothing coming up yet</p>
                <p className={s.upcomingEmptySub}>
                  Add your next interview to start preparing.
                </p>
                <Link href="/interviews/new" className={s.upcomingEmptyCta}>
                  <Plus size={14} /> Add an interview
                </Link>
              </div>
            )}
          </div>

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

          {!journey.hasUpcoming ? (
            <p className={s.skipNote}>
              Just want to practise?{" "}
              <Link href="/mock" className="link-btn">
                Start a generic mock
              </Link>
            </p>
          ) : (
            <p className={s.skipNote}>
              Just want to practise?{" "}
              <Link href="/mock" className="link-btn">
                Start a mock →
              </Link>
            </p>
          )}
        </>
      )}
    </AppShell>
  );
}
