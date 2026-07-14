"use client";

import Link from "next/link";
import {
  AppShell,
  InterviewCard,
} from "../../components/ui";
import { Plus } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import { journeyStateFromDb } from "../../lib/app-journey-state";
import s from "./interviews.module.css";

export default function InterviewsPage() {
  const db = useAppDb();
  const journey = journeyStateFromDb(db);
  const { upcoming, nearestUpcoming } = journey;

  // Latest past interview first
  const past = [...journey.past].sort((a, b) => b.daysAway - a.daysAway);

  const speech = journey.hasUpcoming
    ? upcoming.length === 1
      ? "You've got one upcoming interview."
      : `You've got ${upcoming.length} upcoming.`
    : "Add your next interview and I'll build a prep plan around it.";

  return (
    <AppShell
      navActive="interviews"
      className={s.page}
      coachPose="presenting"
      coachTitle="Your interviews"
      coachSpeech={speech}
      heroVariant="interviews"
      messageVariant="compact"
      sheetVariant="elevated"
      messageClampLines={2}
    >
      <div className={s.sheetHead}>
        <p className={s.sheetTitle}>Interviews</p>
        <Link href="/interviews/new" className={s.addBtn}>
          <Plus size={15} stroke={2.6} /> Add
        </Link>
      </div>

      <section className={s.block}>
        <p className={s.sectionLabel}>Upcoming</p>
        {upcoming.length > 0 ? (
          <div className={s.interviewStack}>
            {upcoming.map((iv) => (
              <InterviewCard
                interview={iv}
                key={iv.id}
                featured={iv.id === nearestUpcoming?.id}
              />
            ))}
          </div>
        ) : (
          <div className={s.upcomingEmpty}>
            <p className={s.upcomingEmptyTitle}>No upcoming interviews</p>
            <p className={s.upcomingEmptySub}>
              Add your next interview to start preparing.
            </p>
            <Link href="/interviews/new" className={s.upcomingEmptyBtn}>
              <Plus size={15} stroke={2.6} /> Add an interview
            </Link>
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section className={s.block}>
          <p className={s.sectionLabel}>Past</p>
          <div className={s.interviewStack}>
            {past.map((iv) => (
              <InterviewCard interview={iv} key={iv.id} quiet />
            ))}
          </div>
        </section>
      ) : null}

      <p className={s.practiseLink}>
        Just want to practise?{" "}
        <Link href="/mock">Start a mock →</Link>
      </p>
    </AppShell>
  );
}
