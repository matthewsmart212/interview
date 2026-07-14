"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AppShell,
  SheetBack,
  PrimaryButton,
} from "../../../components/ui";
import CircularProgress from "../../../components/CircularProgress";
import {
  Calendar,
  Clock,
  Mic,
  MessageCircle,
  Check,
  ChevronRight,
  Plus,
} from "../../../components/Icons";
import { getInterview, mocksForInterview } from "../../../lib/db";
import { useAppDb } from "../../../lib/db/use-app-db";
import s from "../interviews.module.css";

function scoreCls(score) {
  if (score >= 80) return "good";
  if (score < 65) return "low";
  return "";
}

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

  const checklist = [
    {
      done: iv.hasJD,
      title: iv.hasJD ? "Job description added" : "Add the job description",
      sub: iv.hasJD
        ? "Mocks will use this JD with your CV"
        : "Paste the JD so questions match the role",
      href: `/interviews/${iv.id}/jd`,
      cta: iv.hasJD ? "View" : "Add",
    },
    {
      done: mocks.length > 0,
      title:
        mocks.length > 0
          ? `${mocks.length} mock interview${mocks.length > 1 ? "s" : ""} completed`
          : "Do your first mock interview",
      sub:
        mocks.length > 0
          ? `Latest score ${mocks[0].score}/100 — keep practising`
          : "About 8–10 minutes with your AI interviewer",
      href: `/mock`,
      cta: "Practise",
    },
  ];

  const speech = past
    ? `How did ${iv.company} go? Review your mocks or practise for the next one.`
    : iv.hasJD
      ? `${iv.company} in ${iv.daysAway} day${iv.daysAway === 1 ? "" : "s"}. Run a mock and I'll quiz you on this role.`
      : `Let's prep for ${iv.company}. Add the job description, then we'll practise.`;

  return (
    <AppShell
      navActive="interviews"
      coachPose={past ? "idle" : "presenting"}
      coachTitle={`${iv.role}`}
      coachSpeech={speech}
    >
      <SheetBack href="/interviews">Interviews</SheetBack>

      <div className={s.detailMeta}>
        <div className={s.detailMetaText}>
          <p className={s.sheetTitle}>{iv.company}</p>
          <div className={s.heroMeta}>
            <span className={s.heroChip}>
              <Calendar size={13} /> {iv.date}
            </span>
            <span className={s.heroChip}>
              <Clock size={13} />
              {past ? iv.outcome ?? "Completed" : `in ${iv.daysAway} days`}
            </span>
            <span className={s.heroChip}>{iv.type}</span>
          </div>
        </div>
        <div className={s.detailRing}>
          <CircularProgress
            value={iv.readiness}
            size={64}
            stroke={7}
            color="#fff"
            track="rgba(255,255,255,0.2)"
          >
            <span className={s.ringPct}>{iv.readiness}%</span>
          </CircularProgress>
        </div>
      </div>

      <p className="section-title" style={{ marginTop: 18 }}>
        Your prep checklist
      </p>
      <div className="card">
        {checklist.map((c) => (
          <div className={s.checkRow} key={c.title}>
            <span className={`check${c.done ? "" : " todo"}`}>
              {c.done ? (
                <Check size={15} stroke={3} />
              ) : (
                <ChevronRight size={15} stroke={3} />
              )}
            </span>
            <span className={s.checkText}>
              <span className={s.checkTitle}>{c.title}</span>
              <span className={s.checkSub}>{c.sub}</span>
            </span>
            <Link href={c.href} className={s.checkCta}>
              {c.cta}
            </Link>
          </div>
        ))}
      </div>

      <p className="section-title" style={{ marginTop: 22 }}>
        Practise
      </p>
      <div className="stack">
        <Link href="/mock" className="action-row">
          <span className="ar-icon">
            <Mic size={22} />
          </span>
          <span className="ar-body">
            <span className="ar-title">Start AI mock interview</span>
            <span className="ar-sub">
              {iv.hasJD
                ? "Questions from this job description + your CV"
                : `Generic ${iv.role} questions — add a JD for better prep`}
            </span>
          </span>
          <ChevronRight size={20} className="chev" />
        </Link>
        <Link href="/questions" className="action-row">
          <span className="ar-icon">
            <MessageCircle size={22} />
          </span>
          <span className="ar-body">
            <span className="ar-title">Browse likely questions</span>
            <span className="ar-sub">Read model answers for this role</span>
          </span>
          <ChevronRight size={20} className="chev" />
        </Link>
      </div>

      {mocks.length > 0 && (
        <>
          <div className={s.headRow} style={{ marginTop: 22, marginBottom: 0 }}>
            <p className="section-title" style={{ marginBottom: 12 }}>
              Mock history
            </p>
            <Link href="/history" className="link-btn">
              See all
            </Link>
          </div>
          <div className="card">
            {mocks.map((mk) => (
              <Link href={`/history/${mk.id}`} className={s.mockRow} key={mk.id}>
                <span
                  className={`${s.mockScore} ${scoreCls(mk.score) ? s[scoreCls(mk.score)] : ""}`}
                >
                  {mk.score}
                </span>
                <span className={s.mockBody}>
                  <span className={s.mockTitle}>{mk.headline}</span>
                  <span className={s.mockSub}>
                    {mk.date} · {mk.questions} questions · {mk.durationMin} min
                  </span>
                </span>
                <ChevronRight size={18} className="chev" />
              </Link>
            ))}
          </div>
        </>
      )}

      {!iv.hasJD && (
        <Link
          href={`/interviews/${iv.id}/jd`}
          className="btn btn-soft"
          style={{ marginTop: 18 }}
        >
          <Plus size={17} /> Add job description
        </Link>
      )}
    </AppShell>
  );
}
