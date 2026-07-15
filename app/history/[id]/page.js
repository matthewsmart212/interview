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
  CheckCircle,
  AlertCircle,
  Mic,
  ChevronRight,
} from "../../../components/Icons";
import { getMockSession, getInterview } from "../../../lib/db";
import { useAppDb } from "../../../lib/db/use-app-db";
import s from "../history.module.css";
import iv from "../../interviews/interviews.module.css";

export default function MockDetailPage() {
  const { id } = useParams();
  useAppDb();
  const mk = getMockSession(id);

  if (!mk) {
    return (
      <AppShell
        navActive="progress"
        noNav
        coachPose="idle"
        coachTitle="Hmm…"
        coachSpeech="I can't find that practice session."
      >
        <SheetBack href="/history">History</SheetBack>
        <div className={iv.empty}>
          <div className={iv.emptyTitle}>Session not found</div>
          <PrimaryButton href="/history" style={{ marginTop: 16 }}>
            Back to history
          </PrimaryButton>
        </div>
      </AppShell>
    );
  }

  const linkedInterview = getInterview(mk.interviewId);
  const speech =
    mk.score >= 80
      ? `Strong session — ${mk.score}/100. Let's lock in what worked and tighten the rest.`
      : mk.score >= 65
        ? `${mk.score}/100 — solid start. Here's what I'd practise next.`
        : `${mk.score}/100. Don't worry — we'll work through the weak spots together.`;

  return (
    <AppShell
      navActive="progress"
      noNav
      coachPose={mk.score >= 80 ? "thumbsup" : "idle"}
      coachTitle={mk.headline}
      coachSpeech={speech}
    >
      <SheetBack href="/history">History</SheetBack>

      <div className={s.detailTop}>
        <div className={s.detailCopy}>
          <p className={s.sheetTitle} style={{ marginBottom: 4 }}>
            {mk.role} · {mk.company}
          </p>
          <p className={s.detailSub}>
            {mk.date} · {mk.time}
          </p>
        </div>
        <CircularProgress
          value={mk.score}
          size={72}
          stroke={8}
          color="#fff"
          track="rgba(255,255,255,0.2)"
        >
          <span className={s.ringScore}>{mk.score}</span>
        </CircularProgress>
      </div>

      <div className={s.factRow}>
        <div className={s.fact}>
          <div className={s.factVal}>{mk.questions}</div>
          <div className={s.factLab}>Questions</div>
        </div>
        <div className={s.fact}>
          <div className={s.factVal}>{mk.durationMin}m</div>
          <div className={s.factLab}>Duration</div>
        </div>
        <div className={s.fact}>
          <div className={s.factVal}>{mk.score}/100</div>
          <div className={s.factLab}>Score</div>
        </div>
      </div>

      <p className="section-title" style={{ marginTop: 20 }}>
        Highlights
      </p>
      <div className="card">
        <div className={s.hlRow}>
          <span className={`${s.hlIcon} ${s.best}`}>
            <CheckCircle size={19} />
          </span>
          <span>
            <span className={s.hlLab}>Strongest answer</span>
            <span className={s.hlText}>{mk.best}</span>
          </span>
        </div>
        <div className={s.hlRow}>
          <span className={`${s.hlIcon} ${s.weak}`}>
            <AlertCircle size={19} />
          </span>
          <span>
            <span className={s.hlLab}>Needs work</span>
            <span className={s.hlText}>{mk.weakest}</span>
          </span>
        </div>
      </div>

      <p className="section-title" style={{ marginTop: 20 }}>
        Skill scores
      </p>
      <div className="card">
        {mk.skills.map((sk) => (
          <div className={s.skillRow} key={sk.name}>
            <div className={s.skillTop}>
              <span>{sk.name}</span>
              <span className="v">{sk.value}%</span>
            </div>
            <div className="meter">
              <i style={{ width: `${sk.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      {linkedInterview && (
        <Link
          href={`/interviews/${linkedInterview.id}`}
          className="action-row"
          style={{ marginTop: 18 }}
        >
          <span className="ar-icon" style={{ fontWeight: 700, fontSize: 17 }}>
            {linkedInterview.initials}
          </span>
          <span className="ar-body">
            <span className="ar-title">
              {linkedInterview.role} at {linkedInterview.company}
            </span>
            <span className="ar-sub">Open the interview prep plan</span>
          </span>
          <ChevronRight size={20} className="chev" />
        </Link>
      )}

      <Link
        href={mk.interviewId ? `/interview?for=${mk.interviewId}` : "/interview"}
        className="btn btn-primary"
        style={{ marginTop: 14 }}
      >
        <Mic size={18} /> Practise again
      </Link>
    </AppShell>
  );
}
