"use client";

import Link from "next/link";
import {
  AppShell,
  PageSection,
  InterviewCard,
  EmptyStateCard,
  PrimaryButton,
} from "../../components/ui";
import PageHeader from "../../components/PageHeader";
import { Plus, Calendar } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import s from "./interviews.module.css";

export default function InterviewsPage() {
  const { INTERVIEWS } = useAppDb();
  const upcoming = INTERVIEWS.filter((i) => i.status === "upcoming").sort(
    (a, b) => a.daysAway - b.daysAway
  );
  const past = INTERVIEWS.filter((i) => i.status === "past");

  return (
    <AppShell navActive="interviews">
      <PageHeader
        title="Interviews"
        description="Your upcoming roles and past practice"
        right={
          <Link href="/interviews/new" className={s.addBtn}>
            <Plus size={15} stroke={2.6} /> Add
          </Link>
        }
      />

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
            <PageSection title="Upcoming">
              <div className={`stack ${s.interviewStack}`}>
                {upcoming.map((iv) => (
                  <InterviewCard interview={iv} key={iv.id} />
                ))}
              </div>
            </PageSection>
          ) : null}

          {past.length > 0 ? (
            <PageSection title="Past">
              <div className={`stack ${s.interviewStack}`}>
                {past.map((iv) => (
                  <InterviewCard interview={iv} key={iv.id} />
                ))}
              </div>
            </PageSection>
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
