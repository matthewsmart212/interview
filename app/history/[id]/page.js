"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Phone from "../../../components/Phone";
import PageHeader from "../../../components/PageHeader";
import CircularProgress from "../../../components/CircularProgress";
import {
  CheckCircle,
  AlertCircle,
  Mic,
  ChevronRight,
} from "../../../components/Icons";
import { getMock, getInterview } from "../../../lib/app-data";
import s from "../history.module.css";
import iv from "../../interviews/interviews.module.css";

export default function MockDetailPage() {
  const { id } = useParams();
  const mk = getMock(id);

  if (!mk) {
    return (
      <Phone>
        <div className="screen screen-pad has-app-header">
          <PageHeader
            icon="mic"
            title="Mock Interview"
            description="Session details and feedback"
            back
            backHref="/history"
          />
          <div className={iv.empty}>
            <div className={iv.emptyTitle}>Session not found</div>
            <Link href="/history" className="btn btn-primary" style={{ marginTop: 16 }}>
              Back to history
            </Link>
          </div>
        </div>
      </Phone>
    );
  }

  const linkedInterview = getInterview(mk.interviewId);

  return (
    <Phone>
      <div className="screen screen-pad has-app-header">
        <PageHeader
          icon="mic"
          title="Mock Interview"
          description="Session details and feedback"
          back
          backHref="/history"
        />
        <div className={`${s.hero} anim-fade-up`}>
          <div className={s.heroBody}>
            <div className={s.heroHeadline}>{mk.headline}</div>
            <div className={s.heroSub}>
              {mk.role} at {mk.company}
              <br />
              {mk.date} · {mk.time}
            </div>
          </div>
          <CircularProgress
            value={mk.score}
            size={78}
            stroke={9}
            color="#fff"
            track="rgba(255,255,255,0.25)"
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

        <p className="section-title" style={{ marginTop: 24 }}>
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

        <p className="section-title" style={{ marginTop: 24 }}>
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
            style={{ marginTop: 20 }}
          >
            <span className="ar-icon" style={{ background: linkedInterview.accent, color: "#fff" }}>
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

        <Link href="/interview" className="btn btn-primary" style={{ marginTop: 14 }}>
          <Mic size={18} /> Practise again
        </Link>
      </div>
    </Phone>
  );
}
