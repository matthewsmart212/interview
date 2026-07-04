"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import BottomNav from "../../../components/BottomNav";
import CircularProgress from "../../../components/CircularProgress";
import {
  Calendar,
  Clock,
  FileText,
  Mic,
  MessageCircle,
  Check,
  ChevronRight,
  Plus,
} from "../../../components/Icons";
import { getInterview, mocksForInterview } from "../../../lib/app-data";
import s from "../interviews.module.css";

function scoreCls(score) {
  if (score >= 80) return "good";
  if (score < 65) return "low";
  return "";
}

export default function InterviewPrepPage() {
  const { id } = useParams();
  const iv = getInterview(id);

  if (!iv) {
    return (
      <Phone>
        <TopBar title="Interview" backHref="/interviews" />
        <div className="screen screen-pad has-nav">
          <div className={s.empty}>
            <div className={s.emptyTitle}>Interview not found</div>
            <p className={s.emptySub}>It may have been removed.</p>
            <Link href="/interviews" className="btn btn-primary">
              Back to my interviews
            </Link>
          </div>
        </div>
        <BottomNav active="interviews" />
      </Phone>
    );
  }

  const mocks = mocksForInterview(iv.id);
  const past = iv.status === "past";

  const checklist = [
    {
      done: iv.tailoredCv.exists,
      title: iv.tailoredCv.exists ? "CV tailored for this role" : "Tailor your CV",
      sub: iv.tailoredCv.exists
        ? `Match score ${iv.tailoredCv.score}% · your original is safe`
        : "Boost your match score for this exact job",
      href: `/interviews/${iv.id}/cv`,
      cta: iv.tailoredCv.exists ? "View" : "Tailor",
    },
    {
      done: iv.hasJD,
      title: iv.hasJD ? "Job description added" : "Add the job description",
      sub: iv.hasJD
        ? "Questions & CV tips are tailored to this employer"
        : "Without it we'll use generic role questions — still great practice",
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
          : "10 minutes with your AI interviewer",
      href: "/interview",
      cta: "Practise",
    },
  ];

  return (
    <Phone>
      <TopBar title="Interview Prep" backHref="/interviews" />
      <div className="screen screen-pad has-nav">
        <div className={`${s.hero} anim-fade-up`}>
          <div className={s.heroBody}>
            <div className={s.heroLabel}>
              {past ? "Past interview" : "Preparing for"}
            </div>
            <div className={s.heroTitle}>
              {iv.role} at {iv.company}
            </div>
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
          <div className={s.heroRing}>
            <CircularProgress
              value={iv.readiness}
              size={72}
              stroke={8}
              color="#fff"
              track="rgba(255,255,255,0.25)"
            >
              <span className={s.ringPct}>{iv.readiness}%</span>
            </CircularProgress>
            <span className={s.heroRingLab}>Ready</span>
          </div>
        </div>

        <p className="section-title" style={{ marginTop: 24 }}>
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

        <p className="section-title" style={{ marginTop: 24 }}>
          Practise
        </p>
        <div className="stack">
          <Link href="/interview" className="action-row">
            <span className="ar-icon">
              <Mic size={22} />
            </span>
            <span className="ar-body">
              <span className="ar-title">Start AI mock interview</span>
              <span className="ar-sub">
                {iv.hasJD
                  ? "Questions tailored to this job description"
                  : `Generic ${iv.role} questions`}
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
          <Link href={`/interviews/${iv.id}/cv`} className="action-row">
            <span className="ar-icon">
              <FileText size={22} />
            </span>
            <span className="ar-body">
              <span className="ar-title">
                {iv.tailoredCv.exists ? "View tailored CV" : "Tailor my CV"}
              </span>
              <span className="ar-sub">
                {iv.tailoredCv.exists
                  ? `${iv.tailoredCv.score}% match for this role`
                  : "Create a version aimed at this job"}
              </span>
            </span>
            <ChevronRight size={20} className="chev" />
          </Link>
        </div>

        {mocks.length > 0 && (
          <>
            <div className={s.headRow} style={{ marginTop: 24, marginBottom: 0 }}>
              <p className="section-title" style={{ marginBottom: 12 }}>
                Mock history for this interview
              </p>
              <Link href="/history" className="link-btn">
                See all
              </Link>
            </div>
            <div className="card">
              {mocks.map((mk) => (
                <Link href={`/history/${mk.id}`} className={s.mockRow} key={mk.id}>
                  <span className={`${s.mockScore} ${scoreCls(mk.score) ? s[scoreCls(mk.score)] : ""}`}>
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
            style={{ marginTop: 20 }}
          >
            <Plus size={17} /> Add job description
          </Link>
        )}
      </div>
      <BottomNav active="interviews" />
    </Phone>
  );
}
