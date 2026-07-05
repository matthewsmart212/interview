import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import {
  AppShell,
  EmptyStateCard,
  PrimaryButton,
  PageSection,
} from "../../components/ui";
import { ChevronRight, Mic } from "../../components/Icons";
import { MOCK_HISTORY } from "../../lib/app-data";
import s from "./history.module.css";

function scoreCls(score) {
  if (score >= 80) return "good";
  if (score < 65) return "low";
  return "";
}

export default function HistoryPage() {
  return (
    <AppShell navActive="progress">
      <PageHeader
        icon="mic"
        title="Mock History"
        description="Revisit feedback from practice sessions"
        back
        backHref="/progress"
      />

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
          <p className="page-sub" style={{ marginBottom: 16 }}>
            Every mock you&apos;ve completed — tap one to revisit the feedback.
          </p>
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

          <PrimaryButton href="/mock" style={{ marginTop: 24 }}>
            <Mic size={18} /> Start a new mock interview
          </PrimaryButton>
        </>
      )}
    </AppShell>
  );
}
