"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "../../components/Avatar";
import PageHeader from "../../components/PageHeader";
import { AppShell, PageSection } from "../../components/ui";
import {
  Mic,
  Calendar,
  FileText,
  Plus,
  ChevronRight,
  Clock,
  Lightbulb,
  Check,
  Play,
} from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import {
  saveMockSetup,
  buildInterviewHref,
  clearMockSetup,
} from "../../lib/mock-setup";
import { clearSession, clearResult } from "../../lib/interview-session";
import { MOCK_DURATION_LABEL } from "../../lib/config/product";
import s from "./mock.module.css";

const DURATION_LABEL = MOCK_DURATION_LABEL;

const PREP_CHECKLIST = [
  { label: "CV understood", speech: "Just reviewing your experience…" },
  { label: "Job analysed", speech: "Looking at what this role needs…" },
  { label: "Building follow-up questions", speech: "Preparing a few follow-ups…" },
  { label: "Calibrating difficulty", speech: "Tuning the challenge for you…" },
  { label: "Preparing voice…", speech: "Almost ready — warming up my voice…" },
];

const REVIEW_STEP_MS = 420;
const LAUNCH_BEATS = ["3", "2", "1", "Let's begin"];

function haptic(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* noop */
  }
}

function friendlyCvName(fileName) {
  if (!fileName) return "No CV yet";
  return fileName.replace(/\.[^.]+$/, "").replace(/-/g, " ");
}

function TimeBadge({ className = "" }) {
  return (
    <span className={`${s.timeBadge} ${className}`.trim()}>
      <Clock size={12} aria-hidden />
      {DURATION_LABEL}
    </span>
  );
}

function StepDots({ step, total = 2 }) {
  return (
    <div className={s.stepDots} aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < step ? s.stepDotOn : ""} />
      ))}
    </div>
  );
}

function CoachBubble({ pose = "welcoming", title, children, tips }) {
  return (
    <div className={s.coachScene}>
      <div className={s.coachSceneAvatar} aria-hidden>
        <Avatar pose={pose} alt="" className={s.coachSceneImg} />
      </div>
      <div className={s.coachBubble}>
        {title ? <p className={s.coachBubbleTitle}>{title}</p> : null}
        <div className={s.coachBubbleText}>{children}</div>
        {tips?.length ? (
          <ul className={s.coachTips}>
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function ChoiceCard({
  icon: Icon,
  title,
  sub,
  onClick,
  primary = false,
  accent = "mic",
  meta,
}) {
  return (
    <button
      type="button"
      className={`${s.bigChoice} ${primary ? s.bigChoicePrimary : ""} ${s[`accent_${accent}`] || ""}`}
      onClick={onClick}
    >
      <span className={s.bigChoiceIcon} aria-hidden>
        <Icon size={primary ? 26 : 22} />
      </span>
      <span className={s.bigChoiceBody}>
        <span className={s.bigChoiceTitle}>{title}</span>
        <span className={s.bigChoiceSub}>{sub}</span>
        {meta ? <span className={s.bigChoiceMeta}>{meta}</span> : null}
      </span>
      <ChevronRight size={18} className={s.bigChoiceChev} aria-hidden />
    </button>
  );
}

function InterviewPicker({ interviews, selectedId, onSelect }) {
  if (interviews.length === 0) {
    return (
      <div className={s.emptyState}>
        <p className={s.emptyTitle}>No interviews yet</p>
        <p className={s.emptySub}>
          Add one and we&apos;ll practice against that role and job description.
        </p>
        <Link href="/interviews/new" className={`btn btn-primary btn-pill ${s.emptyCta}`}>
          <Plus size={14} /> Add your first interview
        </Link>
      </div>
    );
  }

  return (
    <div className={s.pickerList} role="listbox" aria-label="Upcoming interviews">
      {interviews.map((iv) => {
        const selected = selectedId === iv.id;
        const difficulty =
          iv.readiness >= 70 ? "Ready" : iv.readiness < 50 ? "Needs prep" : "On track";
        const diffCls =
          iv.readiness >= 70 ? "ready" : iv.readiness < 50 ? "prep" : "upcoming";

        return (
          <button
            key={iv.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`${s.interviewCard} ${selected ? s.interviewCardSelected : ""}`}
            onClick={() => onSelect(iv.id)}
          >
            <span className={s.interviewLogo} style={{ background: iv.accent }}>
              {iv.initials}
            </span>
            <span className={s.interviewBody}>
              <span className={s.interviewRole}>{iv.role}</span>
              <span className={s.interviewCompany}>{iv.company}</span>
              <span className={s.interviewMeta}>
                <span>{iv.date}</span>
                <span className={s.interviewMetaDot}>·</span>
                <span>{DURATION_LABEL}</span>
              </span>
            </span>
            <span className={s.interviewSide}>
              <span className={`status-pill ${diffCls}`}>{difficulty}</span>
              <span className={`${s.pickerCheck} ${selected ? s.pickerCheckOn : ""}`}>
                {selected ? <Check size={12} stroke={3} /> : null}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MissionCard({ title, subtitle, focusAreas, cvLabel, hasCv }) {
  return (
    <div className={s.missionCard}>
      <div className={s.missionHead}>
        <span className={s.missionEyebrow}>Your interview</span>
        <TimeBadge />
      </div>
      <h2 className={s.missionTitle}>{title}</h2>
      {subtitle ? <p className={s.missionSub}>{subtitle}</p> : null}

      <div className={s.missionMeta}>
        <span>5 AI questions</span>
        <span className={s.missionMetaDot}>·</span>
        <span>Instant feedback</span>
      </div>

      {focusAreas?.length ? (
        <div className={s.focusChips}>
          {focusAreas.map((area) => (
            <span key={area} className={s.focusChip}>
              {area}
            </span>
          ))}
        </div>
      ) : null}

      <div className={s.missionCv}>
        <span className={s.missionCvThumb} aria-hidden>
          <FileText size={18} />
        </span>
        <span className={s.missionCvBody}>
          <span className={s.missionCvLabel}>CV</span>
          <span className={s.missionCvName}>{friendlyCvName(hasCv ? cvLabel : null)}</span>
          <span className={s.missionCvSub}>
            {hasCv ? "Your permanent CV" : "Optional — upload for richer feedback"}
          </span>
        </span>
        {!hasCv ? (
          <Link href="/cv/upload" className={s.missionCvChange}>
            Upload
          </Link>
        ) : (
          <Link href="/cv/upload" className={s.missionCvChange}>
            View
          </Link>
        )}
      </div>
    </div>
  );
}

function CvNudge() {
  return (
    <p className={s.flowLinks}>
      No CV yet —{" "}
      <Link href="/cv/upload" className="link-btn">
        upload one
      </Link>{" "}
      for richer, experience-aware feedback. You can still practice without it.
    </p>
  );
}

function ThinkingPrep({ lines, done }) {
  const progress = (done / lines.length) * 100;
  const allDone = done >= lines.length;
  const speech = allDone
    ? "Perfect — I'm ready when you are."
    : lines[Math.min(done, lines.length - 1)]?.speech;

  return (
    <div className={s.thinkingPrep}>
      <div className={s.thinkingAvatarWrap}>
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Avatar
            pose={allDone ? "thumbsup" : "thinking"}
            alt="AI coach preparing"
            className={s.thinkingAvatar}
          />
        </motion.div>
      </div>

      <motion.p
        key={speech}
        className={s.thinkingSpeech}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        {speech}
      </motion.p>

      <div className={s.reviewBar} aria-hidden>
        <motion.div
          className={s.reviewBarFill}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.3, 0.6, 0.2, 1] }}
        />
      </div>

      <div className={s.reviewSteps}>
        {lines.map((item, i) => {
          if (i > done) return null;
          const state =
            i < done || (allDone && i === lines.length - 1)
              ? "done"
              : i === done
                ? "active"
                : "pending";
          return (
            <motion.div
              key={item.label}
              className={`${s.reviewStepRow} ${s[`reviewStep_${state}`]}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
            >
              <span className={s.reviewStepIcon} aria-hidden>
                {state === "done" ? (
                  <span className={s.reviewStepCheck}>
                    <Check size={12} stroke={3.5} />
                  </span>
                ) : state === "active" ? (
                  <span className={s.reviewStepSpinner} />
                ) : (
                  <span className={s.reviewStepDot} />
                )}
              </span>
              <span>{item.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function LaunchOverlay({ beat, onDone }) {
  useEffect(() => {
    if (beat < LAUNCH_BEATS.length - 1) {
      const t = setTimeout(() => onDone(beat + 1), beat < 3 ? 520 : 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => onDone(-1), 700);
    return () => clearTimeout(t);
  }, [beat, onDone]);

  const label = LAUNCH_BEATS[beat] ?? "Let's begin";
  const isFinal = beat >= LAUNCH_BEATS.length - 1;

  return (
    <motion.div
      className={s.launchOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={s.launchAvatarWrap}
        animate={{ scale: isFinal ? 1.04 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <Avatar pose="welcoming" alt="" className={s.launchAvatar} />
      </motion.div>
      <motion.div
        key={label}
        className={`${s.launchBeat} ${isFinal ? s.launchBeatFinal : ""}`}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        {isFinal ? (
          <>
            <span className={s.launchMic} aria-hidden>
              <Mic size={22} />
            </span>
            {label}
          </>
        ) : (
          label
        )}
      </motion.div>
    </motion.div>
  );
}

export default function MockHubPage() {
  const router = useRouter();
  const { INTERVIEWS, MASTER_CV, USER } = useAppDb();

  // home | context | ready | checking
  const [screen, setScreen] = useState("home");
  const [contextMode, setContextMode] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [reviewDone, setReviewDone] = useState(0);
  const [phase, setPhase] = useState("wizard"); // wizard | launching
  const [launchBeat, setLaunchBeat] = useState(0);

  const upcoming = useMemo(
    () =>
      INTERVIEWS.filter((i) => i.status === "upcoming").sort(
        (a, b) => a.daysAway - b.daysAway
      ),
    [INTERVIEWS]
  );

  const selectedInterview = upcoming.find((i) => i.id === selectedInterviewId);
  const hasCv = Boolean(MASTER_CV?.exists);
  const cvLabel = MASTER_CV?.fileName || "No CV yet";

  const contextLabel = useCallback(() => {
    if (contextMode === "interview" && selectedInterview) {
      return selectedInterview.role;
    }
    if (contextMode === "generic") return "Generic Practice";
    return "Mock Practice";
  }, [contextMode, selectedInterview]);

  const missionSubtitle = useMemo(() => {
    if (contextMode === "interview" && selectedInterview) {
      return selectedInterview.company;
    }
    return "AI Coach · behavioural practice";
  }, [contextMode, selectedInterview]);

  const focusAreas = useMemo(() => {
    if (contextMode === "interview" && selectedInterview) {
      return ["Role-specific", "Behavioural", "Communication", "Confidence"];
    }
    return ["Behavioural", "Communication", "Customer service", "Confidence"];
  }, [contextMode, selectedInterview]);

  const reviewComplete = reviewDone >= PREP_CHECKLIST.length;

  useEffect(() => {
    if (screen !== "checking") {
      setReviewDone(0);
      return undefined;
    }
    if (reviewComplete) return undefined;
    const t = window.setTimeout(() => setReviewDone((d) => d + 1), REVIEW_STEP_MS);
    return () => window.clearTimeout(t);
  }, [screen, reviewDone, reviewComplete]);

  function selectGeneric() {
    haptic();
    setContextMode("generic");
    setScreen("ready");
  }

  function openInterview() {
    haptic();
    setContextMode("interview");
    if (!selectedInterviewId && upcoming[0]) setSelectedInterviewId(upcoming[0].id);
    setScreen("context");
  }

  function handleInterviewSelect(id) {
    haptic();
    setSelectedInterviewId(id);
  }

  function continueFromContext() {
    if (!selectedInterviewId) return;
    haptic();
    setScreen("ready");
  }

  function goBack() {
    haptic();
    if (screen === "checking") {
      setScreen("ready");
      return;
    }
    if (screen === "ready") {
      if (contextMode === "interview") setScreen("context");
      else setScreen("home");
      return;
    }
    setScreen("home");
  }

  function buildConfig() {
    return {
      contextMode,
      contextLabel: contextLabel(),
      interviewId: contextMode === "interview" ? selectedInterviewId : undefined,
      hasCv,
      cvLabel,
    };
  }

  function beginChecking() {
    haptic();
    setReviewDone(0);
    setScreen("checking");
  }

  function beginLaunch() {
    haptic(12);
    const config = buildConfig();
    clearMockSetup();
    clearSession();
    clearResult();
    saveMockSetup(config);
    setLaunchBeat(0);
    setPhase("launching");
  }

  function finishLaunch(nextBeat) {
    if (nextBeat < 0) {
      router.push(buildInterviewHref({ ...buildConfig(), version: 2 }));
      return;
    }
    setLaunchBeat(nextBeat);
  }

  const headerMeta = useMemo(() => {
    if (screen === "home") {
      return {
        title: "Mock interview",
        description: "Practice with your AI coach",
        back: false,
        step: null,
      };
    }
    if (screen === "context") {
      return {
        title: "Mock interview",
        description: "Choose an upcoming interview",
        back: true,
        step: 1,
      };
    }
    if (screen === "ready") {
      return {
        title: "Mock interview",
        description: "Your interview is ready",
        back: true,
        step: contextMode === "interview" ? 2 : null,
      };
    }
    return {
      title: "Mock interview",
      description: "Your coach is preparing",
      back: true,
      step: contextMode === "interview" ? 2 : null,
    };
  }, [screen, contextMode]);

  function renderHome() {
    return (
      <div className="anim-fade-up">
        <CoachBubble pose="welcoming" title={`Ready for an interview, ${USER.name}?`}>
          <p>
            I&apos;ll ask realistic questions and give you clear feedback after
            every session — just like a real interviewer.
          </p>
          <TimeBadge className={s.timeBadgeInBubble} />
        </CoachBubble>

        <h1 className="page-h1">How do you want to practice?</h1>
        <p className="page-sub">Pick a focus and I&apos;ll set up your session.</p>

        <div className={s.choiceStack}>
          <ChoiceCard
            icon={Mic}
            title="Generic practice"
            sub="Great for any interview."
            meta={`⏱ ${DURATION_LABEL}`}
            onClick={selectGeneric}
            primary
            accent="mic"
          />
          <ChoiceCard
            icon={Calendar}
            title="Upcoming interview"
            sub="Practice for a role you've already saved."
            meta={`⏱ ${DURATION_LABEL}`}
            onClick={openInterview}
            accent="calendar"
          />
        </div>

        {!hasCv ? <CvNudge /> : null}

        <PageSection title="More" className={s.moreSection}>
          <div className="stack">
            <Link href="/history" className="action-row">
              <span className="ar-icon">
                <Clock size={20} />
              </span>
              <span className="ar-body">
                <span className="ar-title">Previous mocks</span>
                <span className="ar-sub">Review scores and feedback</span>
              </span>
              <ChevronRight size={18} className="chev" />
            </Link>
            <Link href="/questions" className="action-row">
              <span className="ar-icon">
                <Lightbulb size={20} />
              </span>
              <span className="ar-body">
                <span className="ar-title">Practice tips</span>
                <span className="ar-sub">Common questions and advice</span>
              </span>
              <ChevronRight size={18} className="chev" />
            </Link>
          </div>
        </PageSection>
      </div>
    );
  }

  function renderContext() {
    return (
      <div className="anim-fade-up">
        <StepDots step={1} />
        <CoachBubble pose="presenting" title="Which interview should we prep for?">
          <p>I&apos;ll use that role and job description to shape the questions.</p>
        </CoachBubble>
        <InterviewPicker
          interviews={upcoming}
          selectedId={selectedInterviewId}
          onSelect={handleInterviewSelect}
        />
        {upcoming.length > 0 ? (
          <p className={s.flowLinks}>
            <Link href="/interviews/new" className="link-btn">
              Add a new interview
            </Link>
          </p>
        ) : null}
        {upcoming.length > 0 ? (
          <button
            type="button"
            className={`btn btn-primary ${s.primaryCta}`}
            disabled={!selectedInterviewId}
            onClick={continueFromContext}
          >
            Continue <ChevronRight size={16} />
          </button>
        ) : null}
      </div>
    );
  }

  function renderReady() {
    const showSteps = contextMode === "interview";
    return (
      <div className="anim-fade-up">
        {showSteps ? <StepDots step={2} /> : null}

        <CoachBubble
          pose="thumbsup"
          title="Great choice."
          tips={["Speak naturally", "It's okay to pause", "We'll review everything afterwards"]}
        >
          <p>
            {hasCv
              ? "I've reviewed your CV and I'm going to challenge you just like a real interviewer would."
              : "I'm ready to practice with you. Upload a CV anytime for richer, experience-aware feedback."}
          </p>
        </CoachBubble>

        <MissionCard
          title={contextLabel()}
          subtitle={missionSubtitle}
          focusAreas={focusAreas}
          cvLabel={cvLabel}
          hasCv={hasCv}
        />

        {!hasCv ? <CvNudge /> : null}

        <button
          type="button"
          className={`btn btn-primary ${s.primaryCta}`}
          onClick={beginChecking}
        >
          <Play size={15} /> Begin Interview
        </button>
        <p className={s.reassurance}>You can leave at any time.</p>
      </div>
    );
  }

  function renderChecking() {
    return (
      <div className="anim-fade-up">
        <ThinkingPrep lines={PREP_CHECKLIST} done={reviewDone} />

        <button
          type="button"
          className={`btn btn-primary ${s.primaryCta} ${reviewComplete ? s.ctaReady : ""}`}
          disabled={!reviewComplete}
          onClick={beginLaunch}
        >
          {reviewComplete ? (
            <>
              <Play size={15} /> Start Interview
            </>
          ) : (
            "Preparing…"
          )}
        </button>
        <p className={s.reassurance}>You can leave at any time.</p>
      </div>
    );
  }

  return (
    <AppShell navActive="mock" className={s.shell}>
      {phase === "wizard" ? (
        <>
          <PageHeader
            icon="mic"
            title={headerMeta.title}
            description={headerMeta.description}
            back={headerMeta.back}
            onBack={headerMeta.back ? goBack : undefined}
            right={
              headerMeta.step ? (
                <span className="step-count">Step {headerMeta.step} of 2</span>
              ) : null
            }
          />

          {screen === "home" ? renderHome() : null}
          {screen === "context" ? renderContext() : null}
          {screen === "ready" ? renderReady() : null}
          {screen === "checking" ? renderChecking() : null}
        </>
      ) : null}

      <AnimatePresence>
        {phase === "launching" ? (
          <LaunchOverlay beat={launchBeat} onDone={finishLaunch} />
        ) : null}
      </AnimatePresence>
    </AppShell>
  );
}
