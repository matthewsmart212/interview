"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import Avatar from "../../components/Avatar";
import { AppShell } from "../../components/ui";
import {
  Mic,
  Calendar,
  FileText,
  Plus,
  ChevronRight,
  Clock,
  MessageCircle,
  Lightbulb,
} from "../../components/Icons";
import { INTERVIEWS, MOCK_HISTORY } from "../../lib/app-data";
import s from "./mock.module.css";

function UtilityCard({ href, icon: Icon, title, subtitle }) {
  return (
    <Link href={href} className={s.utilityCard}>
      <span className={s.utilityIcon} aria-hidden>
        <Icon size={16} />
      </span>
      <span className={s.utilityBody}>
        <span className={s.utilityTitle}>{title}</span>
        {subtitle ? <span className={s.utilitySub}>{subtitle}</span> : null}
      </span>
      <ChevronRight size={14} className={s.utilityChev} aria-hidden />
    </Link>
  );
}

export default function MockHubPage() {
  const [showJd, setShowJd] = useState(false);
  const [jd, setJd] = useState("");

  const upcoming = INTERVIEWS.filter((i) => i.status === "upcoming").sort(
    (a, b) => a.daysAway - b.daysAway
  );
  const nextInterview = upcoming[0];
  const latestMock = MOCK_HISTORY[0];

  const upcomingHref = nextInterview
    ? `/interview?for=${nextInterview.id}`
    : "/interviews";

  return (
    <AppShell navActive="mock" className={s.shell}>
      <PageHeader
        icon="mic"
        title="Mock Interview"
        description="Practise with your AI interviewer"
      />

      <section className={s.hero} aria-hidden>
        <div className={s.heroBg} />
        <div className={s.heroGlow} />
        <Avatar
          pose="welcoming"
          alt="AI interview coach"
          className={s.heroAvatar}
        />
      </section>

      <section className={s.actionCard}>
        <span className={`status-pill upcoming ${s.stepPill}`}>Step 1 of 2</span>

        <h2 className={s.actionTitle}>Ready to start a mock interview?</h2>
        <p className={s.actionSub}>
          Choose a quick practice mock or a tailored mock for a real interview.
        </p>

        <div className={s.actionButtons}>
          <Link
            href={jd.trim() ? "/interview?jd=pasted" : "/interview"}
            className={`btn btn-primary btn-pill ${s.btnPrimary}`}
          >
            <Mic size={17} />
            {jd.trim() ? "Start tailored mock" : "Start generic mock"}
          </Link>

          <Link
            href={upcomingHref}
            className={`btn btn-secondary btn-pill ${s.btnSecondary}`}
          >
            <Calendar size={17} />
            Use an upcoming interview
          </Link>
        </div>

        <div className={s.actionDivider} role="separator" />

        <button
          type="button"
          className={s.jdLink}
          onClick={() => setShowJd((open) => !open)}
        >
          <span className={s.jdLinkIcon} aria-hidden>
            <FileText size={14} />
            <Plus size={8} stroke={2.8} className={s.jdPlus} />
          </span>
          <span className={s.jdLinkText}>Create from job description</span>
          <ChevronRight size={15} className={s.jdChev} aria-hidden />
        </button>

        {showJd ? (
          <div className={`${s.jdArea} anim-fade-up`}>
            <textarea
              className="textarea"
              rows={4}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here and your mock questions will match it..."
            />
          </div>
        ) : null}
      </section>

      <div className={s.utilityRow}>
        <UtilityCard
          href="/history"
          icon={Clock}
          title="Previous mocks"
          subtitle={
            MOCK_HISTORY.length > 0
              ? `${MOCK_HISTORY.length} completed`
              : "None yet"
          }
        />
        <UtilityCard
          href={latestMock ? `/history/${latestMock.id}` : "/history"}
          icon={MessageCircle}
          title="Recent feedback"
          subtitle={
            latestMock ? `Score ${latestMock.score}` : "View history"
          }
        />
        <UtilityCard
          href="/questions"
          icon={Lightbulb}
          title="Practice tips"
          subtitle="Role questions"
        />
      </div>
    </AppShell>
  );
}
