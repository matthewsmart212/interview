"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AppShell,
  SheetBack,
  PrimaryButton,
  PrepChecklist,
  ReadinessRing,
  PrimaryActionCard,
  NavigationRow,
} from "../../../components/ui";
import {
  Calendar,
  Clock,
  Mic,
  MessageCircle,
} from "../../../components/Icons";
import {
  getInterview,
  mocksForInterview,
  updateInterviewPrep,
} from "../../../lib/db";
import { useAppDb } from "../../../lib/db/use-app-db";
import {
  buildPrepRoadmap,
  calculateInterviewReadiness,
} from "../../../lib/readiness";
import s from "../interviews.module.css";

export default function InterviewPrepPage() {
  const { id } = useParams();
  useAppDb();
  const iv = getInterview(id);

  if (!iv) {
    return (
      <AppShell
        navActive="interviews"
        coachPose="idle"
        coachTitle="Hmm…"
        coachSpeech="I can't find that interview. It may have been removed."
        heroVariant="medium"
        messageVariant="compact"
      >
        <SheetBack href="/interviews">Back to interviews</SheetBack>
        <div className={s.empty}>
          <div className={s.emptyTitle}>Interview not found</div>
          <p className={s.emptySub}>It may have been removed.</p>
          <PrimaryButton href="/interviews">Back to my interviews</PrimaryButton>
        </div>
      </AppShell>
    );
  }

  const mocks = mocksForInterview(iv.id);
  const past = iv.status === "past";
  const readiness = calculateInterviewReadiness(iv);
  const roadmap = buildPrepRoadmap(iv, { mocks });

  const countdown = past
    ? iv.outcome ?? "Completed"
    : iv.daysAway === 0
      ? "Today"
      : iv.daysAway === 1
        ? "Tomorrow"
        : `in ${iv.daysAway} days`;

  const handlePrepAction = (item) => {
    if (!item.markComplete) return;
    if (item.toggle) {
      const current = Boolean(iv.prep?.[item.markComplete]);
      updateInterviewPrep(iv.id, { [item.markComplete]: !current });
      return;
    }
    updateInterviewPrep(iv.id, { [item.markComplete]: true });
  };

  return (
    <AppShell
      navActive="interviews"
      coachPose="presenting"
      heroVariant="pointing"
      messageVariant="none"
      sheetVariant="elevated"
    >
      <SheetBack href="/interviews">Interviews</SheetBack>

      <div className={s.detailTop}>
        <div className={s.detailCopy}>
          <p className={s.detailCompany}>{iv.company}</p>
          <h1 className={s.detailRole}>{iv.role}</h1>
          <div className={s.heroMeta}>
            <span className={s.heroChip}>
              <Calendar size={12} /> {iv.date}
            </span>
            <span className={s.heroChip}>
              <Clock size={12} />
              {countdown}
            </span>
            <span className={s.heroChip}>{iv.type}</span>
          </div>
        </div>
        <ReadinessRing
          value={readiness}
          size={68}
          stroke={7}
          showLabel
          label="Ready"
        />
      </div>

      <PrepChecklist items={roadmap} onAction={handlePrepAction} />

      <p className={s.practiseLabel}>Practise</p>
      <PrimaryActionCard
        href="/mock"
        icon={Mic}
        title="Start AI mock interview"
        sub={
          iv.hasJD
            ? "Questions from this job description + your CV"
            : `Generic ${iv.role} questions — add a JD for better prep`
        }
      />

      <div className={s.navBlock}>
        <NavigationRow
          href="/questions"
          icon={MessageCircle}
          title="Browse likely questions"
          sub="Read model answers for this role"
        />
      </div>

      {mocks.length > 0 ? (
        <div className={s.mockBlock}>
          <div className={s.headRow}>
            <p className="section-title" style={{ marginBottom: 0 }}>
              Mock history
            </p>
            <Link href="/history" className="link-btn">
              See all
            </Link>
          </div>
          <div className={s.mockList}>
            {mocks.slice(0, 3).map((mk) => (
              <Link href={`/history/${mk.id}`} className={s.mockRow} key={mk.id}>
                <span className={s.mockScore}>{mk.score}</span>
                <span className={s.mockBody}>
                  <span className={s.mockTitle}>{mk.headline}</span>
                  <span className={s.mockSub}>
                    {mk.date} · {mk.questions} questions
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
