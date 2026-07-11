"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Upload,
  Check,
  Sparkle,
  Play,
} from "../../components/Icons";
import { INTERVIEWS, MASTER_CV, CV_HISTORY, USER } from "../../lib/app-data";
import {
  saveMockSetup,
  buildInterviewHref,
  clearMockSetup,
} from "../../lib/mock-setup";
import { clearSession, clearResult } from "../../lib/interview-session";
import s from "./mock.module.css";

const JD_MIN_CHARS = 80;
const DURATION_LABEL = "8–10 minutes";

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

function friendlyCvName(opt) {
  if (!opt || opt.id === "none") return "Quick practice";
  return opt.label.replace(/\.[^.]+$/, "").replace(/-/g, " ");
}

function cvSubtitle(opt) {
  if (!opt || opt.id === "none") return "Generic feedback only";
  if (opt.badge === "Default") return "Default Resume";
  return opt.badge || opt.meta;
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

function BigChoice({
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
        <p className={s.emptySub}>Add one and we&apos;ll tailor your mock to it.</p>
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

function MissionCard({
  title,
  subtitle,
  focusAreas,
  cv,
  onChangeCv,
}) {
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

      <button type="button" className={s.missionCv} onClick={onChangeCv}>
        <span className={s.missionCvThumb} aria-hidden>
          <FileText size={18} />
        </span>
        <span className={s.missionCvBody}>
          <span className={s.missionCvLabel}>CV</span>
          <span className={s.missionCvName}>{friendlyCvName(cv)}</span>
          <span className={s.missionCvSub}>
            {cvSubtitle(cv)}
            {cv.score != null ? ` · AI Match ${cv.score}%` : ""}
          </span>
        </span>
        <span className={s.missionCvChange}>Change</span>
      </button>
    </div>
  );
}

function CvBottomSheet({ open, onClose, options, selectedId, onSelect, onUpload }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className={s.sheetBackdrop}
            aria-label="Close CV picker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={s.sheetPanel}
            role="dialog"
            aria-modal="true"
            aria-label="Choose a CV"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 34, stiffness: 400 }}
          >
            <div className={s.sheetHandle} aria-hidden />
            <h3 className={s.sheetTitle}>Choose a CV</h3>
            <div className={s.sheetList} role="listbox">
              {options.map((opt) => {
                const selected = selectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`${s.sheetCvRow} ${selected ? s.sheetCvRowSelected : ""}`}
                    onClick={() => {
                      onSelect(opt.id);
                      onClose();
                    }}
                  >
                    <span className={s.sheetCvThumb} aria-hidden>
                      <FileText size={16} />
                    </span>
                    <span className={s.sheetCvBody}>
                      <span className={s.sheetCvName}>{friendlyCvName(opt)}</span>
                      <span className={s.sheetCvMeta}>{cvSubtitle(opt)}</span>
                      {opt.score != null ? (
                        <span className={s.sheetCvScore}>
                          <Sparkle size={9} /> AI Match {opt.score}%
                        </span>
                      ) : null}
                    </span>
                    {selected ? (
                      <span className={s.sheetCvCheck} aria-hidden>
                        <Check size={12} stroke={3} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <button type="button" className={s.sheetUploadBtn} onClick={onUpload}>
              <Upload size={16} />
              Upload another CV
            </button>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function ThinkingPrep({ lines, done }) {
  const progress = (done / lines.length) * 100;
  const allDone = done >= lines.length;
  const speech =
    allDone
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
  const fileRef = useRef(null);
  const cvUploadRef = useRef(null);

  // home | interview | jd | ready | checking
  const [screen, setScreen] = useState("home");
  const [contextMode, setContextMode] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdFileName, setJdFileName] = useState(null);
  const [jdTab, setJdTab] = useState("paste");
  const [jdProcessing, setJdProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState("master");
  const [cvSheetOpen, setCvSheetOpen] = useState(false);
  const [reviewDone, setReviewDone] = useState(0);
  const [phase, setPhase] = useState("wizard"); // wizard | launching
  const [launchBeat, setLaunchBeat] = useState(0);

  const upcoming = useMemo(
    () =>
      INTERVIEWS.filter((i) => i.status === "upcoming").sort(
        (a, b) => a.daysAway - b.daysAway
      ),
    []
  );

  const cvOptions = useMemo(() => {
    const recent = CV_HISTORY[0];
    return [
      {
        id: "master",
        type: "master",
        label: MASTER_CV.fileName,
        edited: MASTER_CV.updatedAt,
        score: MASTER_CV.score,
        meta: `Master CV · score ${MASTER_CV.score}`,
        badge: "Default",
        badgeCls: "ready",
      },
      ...CV_HISTORY.filter((c) => !c.current).map((c) => ({
        id: c.id,
        type: "upload",
        label: c.fileName,
        edited: c.uploadedAt,
        score: c.score,
        meta: `Uploaded ${c.uploadedAt}`,
        badge: recent?.id === c.id ? "Most recent" : null,
        badgeCls: "upcoming",
      })),
      ...INTERVIEWS.filter((iv) => iv.tailoredCv.exists).map((iv) => ({
        id: `tailored-${iv.id}`,
        type: "tailored",
        label: `${iv.company} — tailored`,
        edited: iv.tailoredCv.updatedAt,
        score: iv.tailoredCv.score,
        meta: iv.role,
        badge: "Tailored",
        badgeCls: "upcoming",
      })),
      {
        id: "none",
        type: "none",
        label: "Quick practice — no CV",
        edited: null,
        score: null,
        meta: "Generic feedback only",
        badge: null,
        badgeCls: "",
      },
    ];
  }, []);

  const selectedInterview = upcoming.find((i) => i.id === selectedInterviewId);
  const selectedCv = cvOptions.find((c) => c.id === selectedCvId) ?? cvOptions[0];

  const contextLabel = useCallback(() => {
    if (contextMode === "generic") return "Generic Practice";
    if (contextMode === "interview" && selectedInterview) {
      return selectedInterview.role;
    }
    if (contextMode === "jd") {
      return jdFileName ? jdFileName.replace(/\.[^.]+$/, "") : "Job Description Practice";
    }
    return "Mock Practice";
  }, [contextMode, selectedInterview, jdFileName]);

  const missionSubtitle = useMemo(() => {
    if (contextMode === "interview" && selectedInterview) {
      return selectedInterview.company;
    }
    if (contextMode === "jd") return "From your job description";
    return "AI Coach · behavioural practice";
  }, [contextMode, selectedInterview]);

  const focusAreas = useMemo(() => {
    if (contextMode === "interview" && selectedInterview) {
      return ["Role-specific", "Behavioural", "Communication", "Confidence"];
    }
    if (contextMode === "jd") {
      return ["Role fit", "Behavioural", "Communication", "Confidence"];
    }
    return ["Behavioural", "Communication", "Customer service", "Confidence"];
  }, [contextMode, selectedInterview]);

  const cvLabel = selectedCvId === "none" ? "No CV" : selectedCv?.label ?? MASTER_CV.fileName;

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

  function canContinueJd() {
    if (jdProcessing) return false;
    if (jdTab === "paste") return jdText.trim().length >= JD_MIN_CHARS;
    return Boolean(jdFileName && jdText.trim());
  }

  function selectGeneric() {
    haptic();
    setContextMode("generic");
    setScreen("ready");
  }

  function openInterview() {
    haptic();
    setContextMode("interview");
    if (!selectedInterviewId && upcoming[0]) setSelectedInterviewId(upcoming[0].id);
    setScreen("interview");
  }

  function openJd() {
    haptic();
    setContextMode("jd");
    setScreen("jd");
  }

  function handleInterviewSelect(id) {
    haptic();
    setSelectedInterviewId(id);
  }

  function continueFromInterview() {
    if (!selectedInterviewId) return;
    haptic();
    setScreen("ready");
  }

  function continueFromJd() {
    if (!canContinueJd()) return;
    haptic();
    setScreen("ready");
  }

  function handleCvSelect(id) {
    haptic();
    setSelectedCvId(id);
  }

  function handleJdFile(file) {
    if (!file) return;
    setJdProcessing(true);
    setJdFileName(null);
    setJdText("");
    window.setTimeout(() => {
      setJdFileName(file.name);
      setJdText(
        `Role requirements extracted from ${file.name}.\n\nWe're looking for a friendly, reliable team member who communicates clearly and stays calm under pressure.`
      );
      setJdProcessing(false);
    }, 1200);
  }

  function goBack() {
    haptic();
    if (screen === "checking") {
      setScreen("ready");
      return;
    }
    if (screen === "ready") {
      if (contextMode === "interview") setScreen("interview");
      else if (contextMode === "jd") setScreen("jd");
      else setScreen("home");
      return;
    }
    setScreen("home");
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

  function buildConfig() {
    return {
      contextMode,
      contextLabel: contextLabel(),
      interviewId: contextMode === "interview" ? selectedInterviewId : undefined,
      jdText: contextMode === "jd" ? jdText : undefined,
      jdFileName: contextMode === "jd" ? jdFileName ?? undefined : undefined,
      cvId: selectedCvId,
      cvType: selectedCv?.type ?? "master",
      cvLabel,
    };
  }

  function finishLaunch(nextBeat) {
    if (nextBeat < 0) {
      router.push(buildInterviewHref({ ...buildConfig(), version: 1 }));
      return;
    }
    setLaunchBeat(nextBeat);
  }

  const headerMeta = useMemo(() => {
    const showSteps = contextMode === "interview" || contextMode === "jd";

    if (screen === "home") {
      return {
        title: "Mock interview",
        description: "Practice with your AI coach",
        back: false,
        step: null,
      };
    }
    if (screen === "interview") {
      return {
        title: "Mock interview",
        description: "Choose an upcoming interview",
        back: true,
        step: 1,
      };
    }
    if (screen === "jd") {
      return {
        title: "Mock interview",
        description: "Add a job description",
        back: true,
        step: 1,
      };
    }
    if (screen === "ready") {
      return {
        title: "Mock interview",
        description: "Your interview is ready",
        back: true,
        step: showSteps ? 2 : null,
      };
    }
    return {
      title: "Mock interview",
      description: "Your coach is preparing",
      back: true,
      step: showSteps ? 2 : null,
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
          <BigChoice
            icon={Mic}
            title="Generic practice"
            sub="Great for any interview."
            meta={`⏱ ${DURATION_LABEL}`}
            onClick={selectGeneric}
            primary
            accent="mic"
          />
          <BigChoice
            icon={Calendar}
            title="Upcoming interview"
            sub="Tailored to a role you've already saved."
            meta={`⏱ ${DURATION_LABEL}`}
            onClick={openInterview}
            accent="calendar"
          />
          <BigChoice
            icon={FileText}
            title="Job description"
            sub="Paste a job description for tailored questions."
            meta={`⏱ ${DURATION_LABEL}`}
            onClick={openJd}
            accent="file"
          />
        </div>

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

  function renderInterview() {
    return (
      <div className="anim-fade-up">
        <StepDots step={1} />
        <CoachBubble pose="presenting" title="Which interview should we prep for?">
          <p>I&apos;ll tailor questions to this role and company.</p>
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
            onClick={continueFromInterview}
          >
            Continue <ChevronRight size={16} />
          </button>
        ) : null}
      </div>
    );
  }

  function renderJd() {
    const pasteHint =
      jdTab === "paste" &&
      jdText.trim().length > 0 &&
      jdText.trim().length < JD_MIN_CHARS;

    return (
      <div className="anim-fade-up">
        <StepDots step={1} />
        <CoachBubble pose="thinking" title="Share the job description">
          <p>Paste the posting or upload a file — I&apos;ll build questions from it.</p>
        </CoachBubble>

        <div className={s.jdTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={jdTab === "paste"}
            className={`${s.jdTab} ${jdTab === "paste" ? s.jdTabActive : ""}`}
            onClick={() => setJdTab("paste")}
          >
            Paste text
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={jdTab === "upload"}
            className={`${s.jdTab} ${jdTab === "upload" ? s.jdTabActive : ""}`}
            onClick={() => setJdTab("upload")}
          >
            Upload file
          </button>
        </div>

        {jdTab === "paste" ? (
          <div className={s.jdArea}>
            <textarea
              className="textarea"
              rows={5}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description…"
            />
            {pasteHint ? <p className={s.jdHint}>A little more detail needed</p> : null}
          </div>
        ) : (
          <div className={s.jdUploadWrap}>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className={s.fileInput}
              onChange={(e) => handleJdFile(e.target.files?.[0])}
            />
            <button
              type="button"
              className={`${s.dropzone} ${dragOver ? s.dropzoneOver : ""} ${jdFileName ? s.dropzoneDone : ""} ${jdProcessing ? s.dropzoneBusy : ""}`}
              onClick={() => !jdProcessing && fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleJdFile(e.dataTransfer?.files?.[0]);
              }}
              disabled={jdProcessing}
            >
              <span className={s.dropIcon} aria-hidden>
                {jdProcessing ? (
                  <span className={s.dropSpinner} />
                ) : jdFileName ? (
                  <Check size={22} />
                ) : (
                  <Upload size={22} />
                )}
              </span>
              <span className={s.dropTitle}>
                {jdProcessing
                  ? "Reading file…"
                  : jdFileName || "Choose a job description file"}
              </span>
              <span className={s.dropSub}>PDF, DOCX or TXT</span>
            </button>
          </div>
        )}

        <button
          type="button"
          className={`btn btn-primary ${s.primaryCta}`}
          disabled={!canContinueJd()}
          onClick={continueFromJd}
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  function renderReady() {
    const showSteps = contextMode === "interview" || contextMode === "jd";
    return (
      <div className="anim-fade-up">
        {showSteps ? <StepDots step={2} /> : null}

        <CoachBubble
          pose="thumbsup"
          title="Great choice."
          tips={["Speak naturally", "It's okay to pause", "We'll review everything afterwards"]}
        >
          <p>
            I&apos;ve reviewed your CV and I&apos;m going to challenge you just like
            a real interviewer would.
          </p>
        </CoachBubble>

        <MissionCard
          title={contextLabel()}
          subtitle={missionSubtitle}
          focusAreas={focusAreas}
          cv={selectedCv}
          onChangeCv={() => setCvSheetOpen(true)}
        />

        <button
          type="button"
          className={`btn btn-primary ${s.primaryCta}`}
          onClick={beginChecking}
        >
          <Play size={15} /> Begin Interview
        </button>
        <p className={s.reassurance}>You can leave at any time.</p>

        <input
          ref={cvUploadRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className={s.fileInput}
        />
        <CvBottomSheet
          open={cvSheetOpen}
          onClose={() => setCvSheetOpen(false)}
          options={cvOptions}
          selectedId={selectedCvId}
          onSelect={handleCvSelect}
          onUpload={() => {
            setCvSheetOpen(false);
            cvUploadRef.current?.click();
          }}
        />
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
          {screen === "interview" ? renderInterview() : null}
          {screen === "jd" ? renderJd() : null}
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
