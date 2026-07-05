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
import { INTERVIEWS } from "../../lib/app-data";
import s from "./interviews.module.css";

export default function InterviewsPage() {
  const upcoming = INTERVIEWS.filter((i) => i.status === "upcoming").sort(
    (a, b) => a.daysAway - b.daysAway
  );
  const past = INTERVIEWS.filter((i) => i.status === "past");

  return (
    <AppShell navActive="interviews">
      <PageHeader
        icon="calendar"
        title="My Interviews"
        description="Upcoming and past interviews"
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
          description="Add your first interview and we'll build a prep plan around it."
        >
          <PrimaryButton href="/interviews/new">Add an interview</PrimaryButton>
        </EmptyStateCard>
      ) : (
        <>
          <PageSection title="Upcoming interviews">
            <div className={`stack ${s.interviewStack}`}>
              {upcoming.map((iv, i) => (
                <InterviewCard interview={iv} key={iv.id} featured={i === 0} />
              ))}
            </div>
          </PageSection>

          {past.length > 0 && (
            <PageSection title="Past interviews">
              <div className={`stack ${s.interviewStack}`}>
                {past.map((iv) => (
                  <InterviewCard interview={iv} key={iv.id} />
                ))}
              </div>
            </PageSection>
          )}

          <p className={s.skipNote}>
            Preparing without a set date?{" "}
            <Link href="/mock" className="link-btn">
              Start a practice mock →
            </Link>
          </p>
        </>
      )}
    </AppShell>
  );
}
