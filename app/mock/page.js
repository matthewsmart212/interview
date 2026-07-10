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
  Target,
  Star,
  MessageCircle,
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
const PREP_STEPS = [
  "CV analysed",
  "Questions generated",
  "Interview room ready",
];
const PREP_CHECKLIST = [
  "Loading CV…",
  "Analysing role…",
  "Preparing interviewer…",
  "Warming voice engine…",
  "Ready.",
];
const REVIEW_STEP_MS = 380;

function haptic() {
  try {
    navigator.vibrate?.(8);
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

function StepDots({ step, total = 2 }) {
  return (
    <div className={s.stepDots} aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < step ? s.stepDotOn : ""} />
      ))}
    </div>
  );
}

function BigChoice({ icon: Icon, title, sub, onClick, primary = false }) {
  return (
    <button
      type="button"
      className={`${s.bigChoice} ${primary ? s.bigChoicePrimary : ""}`}
      onClick={onClick}
    >
      <span className={s.bigChoiceIcon} aria-hidden>
        <Icon size={24} />
      </span>
      <span className={s.bigChoiceBody}>
        <span className={s.bigChoiceTitle}>{title}</span>
        <span className={s.bigChoiceSub}>{sub}</span>
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
                <span>~10 min mock</span>
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

function SelectedCvCard({ cv, onOpenSheet }) {
  return (
    <button type="button" className={s.selectedCvCard} onClick={onOpenSheet}>
      <span className={s.selectedCvThumb} aria-hidden>
        <FileText size={22} />
      </span>
      <span className={s.selectedCvBody}>
        <span className={s.selectedCvEyebrow}>CV</span>
        <span className={s.selectedCvName}>{friendlyCvName(cv)}</span>
        <span className={s.selectedCvSub}>{cvSubtitle(cv)}</span>
        {cv.score != null ? (
          <span className={s.selectedCvScore}>
            <Sparkle size={11} /> AI Match {cv.score}%
          </span>
        ) : null}
      </span>
      <ChevronRight size={16} className={s.selectedCvChev} aria-hidden />
    </button>
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

function SummaryCard({ items }) {
  return (
    <div className={s.summaryCard}>
      {items.map((item) => (
        <div key={item.text} className={s.summaryRow}>
          <span className={s.summaryIcon} aria-hidden>
            <item.icon size={15} />
          </span>
          <span className={s.summaryText}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function ReadyChecklist({ lines, done, coachMessage }) {
  const progress = (done / lines.length) * 100;
  const allDone = done >= lines.length;

  return (
    <div className={s.readyPanel}>
      <p className={s.coachSpeech}>{coachMessage}</p>
      <div className={s.reviewBar} aria-hidden>
        <motion.div
          className={s.reviewBarFill}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.3, 0.6, 0.2, 1] }}
        />
      </div>
      <div className={s.reviewSteps}>
        {lines.map((label, i) => {
          if (i > done) return null;
          const state =
            i < done || (allDone && i === lines.length - 1)
              ? "done"
              : i === done
                ? "active"
                : "pending";
          return (
            <motion.div
              key={label}
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
              <span>{label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PreparingOverlay({ step, onDone }) {
  useEffect(() => {
    if (step < PREP_STEPS.length) {
      const t = setTimeout(() => onDone(step + 1), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => onDone(-1), 700);
    return () => clearTimeout(t);
  }, [step, onDone]);

  return (
    <motion.div
      className={s.preparingOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={s.preparingHero}>
        <Avatar pose="welcoming" alt="AI coach preparing your mock" className={s.preparingAvatar} />
      </div>
      <motion.p
        className={s.preparingQuote}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        Perfect. I&apos;ve got everything I need. Let&apos;s begin.
      </motion.p>
      <ul className={s.prepList}>
        {PREP_STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={label}
              className={`${s.prepItem} ${done ? s.prepItemDone : ""} ${active ? s.prepItemActive : ""}`}
            >
              <span className={s.prepIcon}>
                {done ? <Check size={12} stroke={3} /> : active ? <span className={s.prepSpinner} /> : null}
              </span>
              {label}
              {done ? " ✓" : ""}
            </li>
          );
        })}
      </ul>
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
  const [phase, setPhase] = useState("wizard");
  const [prepStep, setPrepStep] = useState(0);

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
      return `${selectedInterview.company} — ${selectedInterview.role}`;
    }
    if (contextMode === "jd") {
      return jdFileName ? jdFileName.replace(/\.[^.]+$/, "") : "Job Description";
    }
    return "Mock Practice";
  }, [contextMode, selectedInterview, jdFileName]);

  const cvLabel = selectedCvId === "none" ? "No CV" : selectedCv?.label ?? MASTER_CV.fileName;

  const coachMessage = useMemo(
    () =>
      `Hi ${USER.name}, I've reviewed your CV and I'm almost ready. I'll ask five tailored questions, just like a real interviewer. When you're ready, press Start Interview.`,
    []
  );

  const summaryItems = useMemo(
    () => [
      { icon: Target, text: contextLabel() },
      { icon: FileText, text: friendlyCvName(selectedCv) },
      { icon: Clock, text: "10 minute interview" },
      { icon: MessageCircle, text: "5 AI questions" },
      { icon: Star, text: "Instant AI feedback" },
    ],
    [contextLabel, selectedCv]
  );

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

  function beginPreparing() {
    haptic();
    const config = buildConfig();
    clearMockSetup();
    clearSession();
    clearResult();
    saveMockSetup(config);
    setPrepStep(0);
    setPhase("preparing");
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

  function finishPreparing(nextStep) {
    if (nextStep < 0) {
      router.push(buildInterviewHref({ ...buildConfig(), version: 1 }));
      return;
    }
    setPrepStep(nextStep);
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
        description: "Confirm your setup",
        back: true,
        step: showSteps ? 2 : null,
      };
    }
    return {
      title: "Mock interview",
      description: "Your coach is getting ready",
      back: true,
      step: showSteps ? 2 : null,
    };
  }, [screen, contextMode]);

  function renderHome() {
    return (
      <div className="anim-fade-up">
        <div className={s.coachIntro}>
          <div className={s.coachIntroAvatar} aria-hidden>
            <Avatar pose="welcoming" alt="" className={s.coachIntroImg} />
          </div>
          <div>
            <p className={s.coachIntroTitle}>Ready when you are</p>
            <p className={s.coachIntroSub}>
              A 10-minute practice with tailored questions and instant feedback.
            </p>
          </div>
        </div>

        <h1 className="page-h1">How do you want to practice?</h1>
        <p className="page-sub">
          Pick a focus and we&apos;ll set up your AI interviewer.
        </p>

        <div className={s.choiceStack}>
          <BigChoice
            icon={Mic}
            title="Generic practice"
            sub="Great for any interview — start in seconds."
            onClick={selectGeneric}
            primary
          />
          <BigChoice
            icon={Calendar}
            title="Upcoming interview"
            sub="Tailored to a role you've already saved."
            onClick={openInterview}
          />
          <BigChoice
            icon={FileText}
            title="Job description"
            sub="Paste a posting and get role-specific questions."
            onClick={openJd}
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
        <h1 className="page-h1">Which interview?</h1>
        <p className="page-sub">
          We&apos;ll tailor questions to this role and company.
        </p>
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
        <h1 className="page-h1">Add the job description</h1>
        <p className="page-sub">
          Paste the posting or upload a file — we&apos;ll build questions from it.
        </p>

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
        <h1 className="page-h1">You&apos;re almost in</h1>
        <p className="page-sub">
          Your AI interviewer will use this CV to tailor questions and give personalised feedback.
        </p>

        <SelectedCvCard cv={selectedCv} onOpenSheet={() => setCvSheetOpen(true)} />
        <button
          type="button"
          className={s.changeCvBtn}
          onClick={() => setCvSheetOpen(true)}
        >
          Change CV
        </button>

        <SummaryCard items={summaryItems} />

        <button
          type="button"
          className={`btn btn-primary ${s.primaryCta}`}
          onClick={beginChecking}
        >
          <Play size={15} /> Begin Mock Interview
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
    const showSteps = contextMode === "interview" || contextMode === "jd";
    return (
      <div className="anim-fade-up">
        {showSteps ? <StepDots step={2} /> : null}
        <h1 className="page-h1">Preparing your interview</h1>
        <p className="page-sub">Your coach is getting everything ready.</p>

        <ReadyChecklist
          lines={PREP_CHECKLIST}
          done={reviewDone}
          coachMessage={coachMessage}
        />

        <button
          type="button"
          className={`btn btn-primary ${s.primaryCta} ${reviewComplete ? s.ctaReady : ""}`}
          disabled={!reviewComplete}
          onClick={beginPreparing}
        >
          {reviewComplete ? (
            <>
              <Play size={15} /> Start Interview
            </>
          ) : (
            "Checking setup…"
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
        {phase === "preparing" ? (
          <PreparingOverlay step={prepStep} onDone={finishPreparing} />
        ) : null}
      </AnimatePresence>
    </AppShell>
  );
}
