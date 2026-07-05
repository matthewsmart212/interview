"use client";

import { useState } from "react";
import Link from "next/link";
import Phone from "../../components/Phone";
import PageHeader from "../../components/PageHeader";
import BottomNav from "../../components/BottomNav";
import {
  Mic,
  Sparkle,
  FileText,
  Plus,
  Calendar,
  ChevronRight,
  Check,
} from "../../components/Icons";
import { INTERVIEWS, MOCK_HISTORY, mocksForInterview } from "../../lib/app-data";
import s from "./mock.module.css";

function scoreCls(score) {
  if (score >= 80) return "good";
  if (score < 65) return "low";
  return "";
}

function JobPracticeCard({ iv }) {
  const mocks = mocksForInterview(iv.id);
  const latest = mocks[0];

  return (
    <div className={s.jobCard}>
      <div className={s.jobTop}>
        <span className={s.jobLogo}>{iv.initials}</span>
        <span className={s.jobBody}>
          <span className={s.jobRole}>
            {iv.role} · {iv.company}
          </span>
          <span className={s.jobMeta}>
            {iv.daysAway > 0 ? `Interview in ${iv.daysAway} days` : "Date TBC"}
          </span>
          <span className={`${s.jdBadge}${iv.hasJD ? "" : ` ${s.missing}`}`}>
            {iv.hasJD ? (
              <>
                <Check size={11} stroke={3} /> Tailored to their job description
              </>
            ) : (
              "Generic role questions — add the JD for tailored ones"
            )}
          </span>
        </span>
        {iv.daysAway > 0 && iv.daysAway <= 7 && (
          <span className={s.jobSoon}>Soon</span>
        )}
      </div>

      <div className={s.jobFoot}>
        <span className={s.jobHistory}>
          {mocks.length > 0 ? (
            <>
              {mocks.length} mock{mocks.length > 1 ? "s" : ""} · last score{" "}
              <b>{latest.score}</b>
            </>
          ) : (
            <span className="none">No mocks yet — 10 min to start</span>
          )}
        </span>
        <Link href={`/interview?for=${iv.id}`} className={s.startBtn}>
          <Mic size={15} /> Start mock
        </Link>
      </div>
    </div>
  );
}

export default function MockHubPage() {
  const [showJd, setShowJd] = useState(false);
  const [jd, setJd] = useState("");

  const upcoming = INTERVIEWS.filter((i) => i.status === "upcoming");
  const totalMocks = MOCK_HISTORY.length;
  const avgScore =
    totalMocks > 0
      ? Math.round(
          MOCK_HISTORY.reduce((sum, m) => sum + m.score, 0) / totalMocks
        )
      : null;
  const bestScore =
    totalMocks > 0 ? Math.max(...MOCK_HISTORY.map((m) => m.score)) : null;
  const recent = MOCK_HISTORY.slice(0, 3);

  return (
    <Phone>
      <div className="screen screen-pad has-nav has-app-header">
        <PageHeader
          icon="mic"
          title="Mock Interview"
          description="Practise with your AI interviewer"
        />

        <div className={`${s.heroCard} anim-fade-up`}>
          <div className={s.heroKicker}>AI mock interview</div>
          <div className={s.heroTitle}>
            {totalMocks > 0
              ? "Every practice run makes the real one easier."
              : "Your first mock takes about 10 minutes."}
          </div>
          <p className={s.heroSub}>
            Answer out loud, get instant feedback on structure, relevance and
            clarity — just like the real thing.
          </p>
          {totalMocks > 0 && (
            <div className={s.heroStats}>
              <div className={s.heroStat}>
                <b>{totalMocks}</b>
                <span>mocks done</span>
              </div>
              <div className={s.heroStat}>
                <b>{avgScore}</b>
                <span>avg score</span>
              </div>
              <div className={s.heroStat}>
                <b>{bestScore}</b>
                <span>best score</span>
              </div>
            </div>
          )}
        </div>

        <p className={s.sectionLabel}>Practise for an interview</p>
        {upcoming.length > 0 ? (
          <div className="stack">
            {upcoming.map((iv) => (
              <JobPracticeCard iv={iv} key={iv.id} />
            ))}
          </div>
        ) : (
          <Link href="/interviews/new" className={s.emptyJobs}>
            <span className={s.emptyJobsIcon}>
              <Calendar size={22} />
            </span>
            <span style={{ flex: 1 }}>
              <span className={s.emptyJobsTitle}>No upcoming interviews</span>
              <span className={s.emptyJobsSub}>
                Add one and we&apos;ll tailor mock questions to the exact role.
              </span>
            </span>
            <Plus size={18} className="chev" />
          </Link>
        )}

        <p className={s.sectionLabel}>Just practising?</p>
        <div className={s.genericCard}>
          <div className={s.genericHead}>
            <span className={s.genericIcon}>
              <Sparkle size={22} />
            </span>
            <div style={{ flex: 1 }}>
              <div className={s.genericTitle}>Quick generic mock</div>
              <div className={s.genericSub}>
                Not tied to a specific job — great all-round interview
                questions to warm up with.
              </div>
            </div>
          </div>

          {!showJd ? (
            <button className={s.jdToggle} onClick={() => setShowJd(true)}>
              <FileText size={15} /> Have a job description? Paste it for a
              tailored mock
            </button>
          ) : (
            <div className={`${s.jdArea} anim-fade-up`}>
              <textarea
                className="textarea"
                rows={4}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here and your mock questions will match it..."
              />
            </div>
          )}

          <div className={s.genericActions}>
            <Link
              href={jd.trim() ? "/interview?jd=pasted" : "/interview"}
              className={s.startPrimary}
            >
              <Mic size={17} />
              {jd.trim() ? "Start tailored mock" : "Start generic mock"}
            </Link>
          </div>
        </div>

        <div className={s.sectionRow}>
          <p className={s.sectionLabel}>Recent mocks</p>
          {totalMocks > 0 && (
            <Link href="/history" className={s.seeAll}>
              See all
            </Link>
          )}
        </div>
        {recent.length > 0 ? (
          <div className="stack">
            {recent.map((mk) => (
              <Link href={`/history/${mk.id}`} className={s.recentRow} key={mk.id}>
                <span
                  className={`${s.recentScore}${
                    scoreCls(mk.score) ? ` ${s[scoreCls(mk.score)]}` : ""
                  }`}
                >
                  {mk.score}
                </span>
                <span className={s.recentBody}>
                  <span className={s.recentTitle}>
                    {mk.role} · {mk.company}
                  </span>
                  <span className={s.recentSub}>
                    {mk.date} · {mk.questions} questions
                  </span>
                </span>
                <ChevronRight size={18} className="chev" />
              </Link>
            ))}
          </div>
        ) : (
          <p className={s.emptyHint}>
            Your completed mocks will appear here with scores and feedback.
          </p>
        )}
      </div>

      <BottomNav active="mock" />
    </Phone>
  );
}
