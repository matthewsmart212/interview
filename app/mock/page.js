"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Avatar from "../../components/Avatar";
import { AppShell } from "../../components/ui";
import {
  Mic,
  Calendar,
  FileText,
  Plus,
  ChevronRight,
  ChevronLeft,
  Clock,
  Lightbulb,
  Upload,
  Check,
  Sparkle,
} from "../../components/Icons";
import { INTERVIEWS, MASTER_CV, CV_HISTORY } from "../../lib/app-data";
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

const slideTransition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.85,
};

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    scale: 0.98,
  }),
};

function haptic() {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* noop */
  }
}

function WizardStepper({ step }) {
  const items = [
    { n: 1, label: "Choose interview" },
    { n: 2, label: "Choose CV" },
  ];

  return (
    <div className={s.stepper} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={2}>
      <div className={s.stepperTrack}>
        {items.map((item, i) => {
          const done = step > item.n;
          const active = step === item.n;
          return (
            <div key={item.n} className={s.stepperNodeWrap}>
              <motion.div
                className={`${s.stepperNode} ${done ? s.stepperNodeDone : ""} ${active ? s.stepperNodeActive : ""}`}
                animate={{ scale: active ? 1.08 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {done ? <Check size={10} stroke={3} /> : <span className={s.stepperDot} />}
              </motion.div>
              {i < items.length - 1 ? (
                <motion.div
                  className={s.stepperLine}
                  animate={{ scaleX: done ? 1 : 0.35 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ originX: 0 }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={s.stepperLabels}>
        {items.map((item) => (
          <span
            key={item.n}
            className={`${s.stepperLabel} ${step === item.n ? s.stepperLabelActive : ""} ${step > item.n ? s.stepperLabelDone : ""}`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function UtilityCard({ href, icon: Icon, title }) {
  return (
    <Link href={href} className={s.utilityCard}>
      <span className={s.utilityIcon} aria-hidden>
        <Icon size={13} />
      </span>
      <span className={s.utilityTitle}>{title}</span>
      <ChevronRight size={11} className={s.utilityChev} aria-hidden />
    </Link>
  );
}

function OptionCard({ icon: Icon, title, sub, onClick, primary = false, secondary = false }) {
  return (
    <motion.button
      type="button"
      className={`${s.optionCard} ${primary ? s.optionCardPrimary : ""} ${secondary ? s.optionCardSecondary : ""}`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      <span className={s.optionIcon} aria-hidden>
        <Icon size={15} />
      </span>
      <span className={s.optionBody}>
        <span className={s.optionTitle}>{title}</span>
        <span className={s.optionSub}>{sub}</span>
      </span>
      <ChevronRight size={14} className={s.optionChev} aria-hidden />
    </motion.button>
  );
}

function InterviewPicker({ interviews, selectedId, onSelect }) {
  if (interviews.length === 0) {
    return (
      <div className={s.emptyState}>
        <div className={s.emptyAvatar} aria-hidden>
          <Avatar pose="thinking" alt="" className={s.emptyAvatarImg} />
        </div>
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
          <motion.button
            key={iv.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`${s.interviewCard} ${selected ? s.interviewCardSelected : ""}`}
            onClick={() => onSelect(iv.id)}
            animate={{ scale: selected ? 1.02 : 1 }}
            transition={slideTransition}
            whileTap={{ scale: 0.99 }}
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
              <span className={`status-pill ${diffCls} ${s.interviewBadge}`}>{difficulty}</span>
              <motion.span
                className={`${s.pickerCheck} ${selected ? s.pickerCheckOn : ""}`}
                initial={false}
                animate={{ opacity: selected ? 1 : 0, scale: selected ? 1 : 0.6 }}
                transition={{ duration: 0.2 }}
              >
                <Check size={12} stroke={3} />
              </motion.span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

function CvPicker({ options, selectedId, onSelect }) {
  return (
    <div className={s.pickerList} role="listbox" aria-label="CV options">
      {options.map((opt) => {
        const selected = selectedId === opt.id;
        return (
          <motion.button
            key={opt.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`${s.cvCard} ${selected ? s.cvCardSelected : ""}`}
            onClick={() => onSelect(opt.id)}
            animate={{ scale: selected ? 1.02 : 1 }}
            transition={slideTransition}
            whileTap={{ scale: 0.99 }}
          >
            <span className={s.cvIcon} aria-hidden>
              <FileText size={16} />
            </span>
            <span className={s.cvBody}>
              <span className={s.cvName}>{opt.label}</span>
              <span className={s.cvMeta}>
                {opt.edited ? `Edited ${opt.edited}` : opt.meta}
              </span>
              {opt.score != null ? (
                <span className={s.cvScore}>
                  <Sparkle size={10} /> AI match {opt.score}
                </span>
              ) : null}
            </span>
            {opt.badge ? (
              <span className={`status-pill ${opt.badgeCls} ${s.cvBadge}`}>{opt.badge}</span>
            ) : null}
            <motion.span
              className={`${s.pickerCheck} ${selected ? s.pickerCheckOn : ""}`}
              initial={false}
              animate={{ opacity: selected ? 1 : 0, scale: selected ? 1 : 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={12} stroke={3} />
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}

function SummaryTable({ rows }) {
  return (
    <div className={s.summaryTable}>
      {rows.map((row) => (
        <div className={s.summaryTableRow} key={row.label}>
          <span className={s.summaryTableKey}>{row.label}</span>
          <span className={s.summaryTableVal}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function ReadyReview({ lines, done }) {
  return (
    <motion.div
      className={s.reviewPanel}
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
    >
      <div className={s.reviewTitle}>Ready to begin</div>
      <div className={s.reviewBar} aria-hidden>
        <i style={{ width: `${(done / lines.length) * 100}%` }} />
      </div>
      <div className={s.reviewSteps}>
        {lines.map((label, i) => {
          const state = i < done ? "done" : i === done ? "active" : "pending";
          return (
            <div
              key={label}
              className={`${s.reviewStepRow} ${s[`reviewStep_${state}`]}`}
            >
              <span className={s.reviewStepIcon} aria-hidden>
                {state === "done" ? (
                  <span className={`${s.reviewStepCheck} anim-scale-in`}>
                    <Check size={12} stroke={3.5} />
                  </span>
                ) : state === "active" ? (
                  <span className={s.reviewStepSpinner} />
                ) : (
                  <span className={s.reviewStepDot} />
                )}
              </span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
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
            <motion.li
              key={label}
              className={`${s.prepItem} ${done ? s.prepItemDone : ""} ${active ? s.prepItemActive : ""}`}
              animate={{ opacity: done || active ? 1 : 0.45 }}
            >
              <span className={s.prepIcon}>
                {done ? <Check size={12} stroke={3} /> : active ? <span className={s.prepSpinner} /> : null}
              </span>
              {label}
              {done ? " ✓" : ""}
            </motion.li>
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

  const [wizardStep, setWizardStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [focusPane, setFocusPane] = useState("home");
  const [contextMode, setContextMode] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdFileName, setJdFileName] = useState(null);
  const [jdTab, setJdTab] = useState("paste");
  const [jdProcessing, setJdProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState("master");
  const [showReview, setShowReview] = useState(false);
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

  function canContinueStep1() {
    if (contextMode === "generic") return true;
    if (contextMode === "interview") return Boolean(selectedInterviewId);
    if (contextMode === "jd") {
      if (jdProcessing) return false;
      if (jdTab === "paste") return jdText.trim().length >= JD_MIN_CHARS;
      return Boolean(jdFileName && jdText.trim());
    }
    return false;
  }

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

  const reviewLines = useMemo(
    () => [
      `Interview — ${contextLabel()}`,
      `CV — ${cvLabel}`,
      `Duration — 10 mins`,
      `Questions — 5`,
      `AI feedback afterwards`,
    ],
    [contextLabel, cvLabel]
  );

  const reviewComplete = reviewDone >= reviewLines.length;

  useEffect(() => {
    if (!showReview) {
      setReviewDone(0);
      return undefined;
    }
    if (reviewComplete) return undefined;
    const t = window.setTimeout(() => setReviewDone((d) => d + 1), 850);
    return () => window.clearTimeout(t);
  }, [showReview, reviewDone, reviewComplete]);

  const goToStep = useCallback((step, pane) => {
    setDirection(step >= wizardStep ? 1 : -1);
    setWizardStep(step);
    if (pane) setFocusPane(pane);
    setShowReview(false);
  }, [wizardStep]);

  const ctaLabel = useMemo(() => {
    if (wizardStep === 1) {
      if (focusPane === "interview" && selectedInterviewId) return "Continue";
      if (focusPane === "jd" && canContinueStep1()) return "Continue";
      return null;
    }
    if (showReview) return "Start Interview";
    if (contextMode === "generic") return "Start Generic Mock";
    if (contextMode === "interview" && selectedInterview) {
      return `Start ${selectedInterview.company} Mock`;
    }
    if (contextMode === "jd") return "Start Tailored Mock";
    return "Start Mock Interview";
  }, [
    wizardStep,
    focusPane,
    contextMode,
    selectedInterview,
    selectedInterviewId,
    showReview,
    jdText,
    jdFileName,
    jdProcessing,
    jdTab,
  ]);

  function selectGeneric() {
    haptic();
    setContextMode("generic");
    goToStep(2, "home");
  }

  function openInterviewPane() {
    haptic();
    setContextMode("interview");
    setFocusPane("interview");
    setWizardStep(1);
    if (!selectedInterviewId && upcoming[0]) setSelectedInterviewId(upcoming[0].id);
  }

  function openJdPane() {
    haptic();
    setContextMode("jd");
    setFocusPane("jd");
    setWizardStep(1);
  }

  function handleInterviewSelect(id) {
    haptic();
    setSelectedInterviewId(id);
    setContextMode("interview");
    window.setTimeout(() => goToStep(2, "interview"), 280);
  }

  function handleCvSelect(id) {
    haptic();
    setSelectedCvId(id);
    setShowReview(false);
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

  function handleCta() {
    haptic();
    if (wizardStep === 1) {
      if (canContinueStep1()) goToStep(2);
      return;
    }
    if (!showReview) {
      setDirection(1);
      setReviewDone(0);
      setShowReview(true);
      return;
    }
    beginPreparing();
  }

  function beginPreparing() {
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

  const stepSubtitle = useMemo(() => {
    if (wizardStep === 2) return "Pick the CV your coach will reference.";
    if (focusPane === "interview") return "Questions tailored to your saved interview.";
    if (focusPane === "jd") return "Paste or upload a job description.";
    return "Practice exactly how you'd like today.";
  }, [wizardStep, focusPane]);

  const avatarPose = useMemo(() => {
    if (phase === "preparing") return "welcoming";
    if (wizardStep === 2) return "thinking";
    if (showReview) return "thumbsup";
    if (focusPane === "interview" || focusPane === "jd") return "presenting";
    return "welcoming";
  }, [phase, wizardStep, showReview, focusPane]);

  const slideKey = showReview
    ? "review"
    : wizardStep === 2
      ? "step-2"
      : `step-1-${focusPane}`;

  function renderReview() {
    return (
      <>
        <button
          type="button"
          className={s.backBtn}
          onClick={() => {
            setShowReview(false);
            setReviewDone(0);
          }}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <ReadyReview lines={reviewLines} done={reviewDone} />
      </>
    );
  }

  const summaryRows = [
    { label: "Interview", value: contextLabel() },
    { label: "CV", value: cvLabel },
    { label: "Duration", value: "10 mins" },
    { label: "Questions", value: "5" },
  ];

  const showPinnedCta =
    phase === "wizard" &&
    (showReview ||
      wizardStep === 2 ||
      (wizardStep === 1 && focusPane !== "home" && ctaLabel));

  function renderStep1() {
    if (focusPane === "interview") {
      return (
        <>
          <button type="button" className={s.backBtn} onClick={() => setFocusPane("home")}>
            <ChevronLeft size={14} /> Back
          </button>
          <InterviewPicker
            interviews={upcoming}
            selectedId={selectedInterviewId}
            onSelect={handleInterviewSelect}
          />
          {upcoming.length > 0 ? (
            <p className={s.flowLinks}>
              <Link href="/interviews/new" className={s.flowLink}>
                Add a new interview
              </Link>
            </p>
          ) : null}
        </>
      );
    }

    if (focusPane === "jd") {
      const pasteHint = jdTab === "paste" && jdText.trim().length > 0 && jdText.trim().length < JD_MIN_CHARS;
      return (
        <>
          <button type="button" className={s.backBtn} onClick={() => setFocusPane("home")}>
            <ChevronLeft size={14} /> Back
          </button>
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
                rows={4}
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
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleJdFile(e.dataTransfer?.files?.[0]);
                }}
                disabled={jdProcessing}
              >
                <span className={s.dropIcon} aria-hidden>
                  {jdProcessing ? <span className={s.dropSpinner} /> : jdFileName ? <Check size={20} /> : <Upload size={20} />}
                </span>
                <span className={s.dropTitle}>
                  {jdProcessing ? "Reading file…" : jdFileName || "Choose a job description file"}
                </span>
                <span className={s.dropSub}>PDF, DOCX or TXT</span>
              </button>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <p className={s.setupTime}>
          <Sparkle size={12} aria-hidden />
          Takes about 30 seconds to set up
        </p>
        <div className={`${s.optionGrid} ${s.optionGridHome}`}>
          <OptionCard
            icon={Mic}
            title="Generic practice"
            sub="Great for any interview."
            onClick={selectGeneric}
            primary
          />
          <OptionCard
            icon={Calendar}
            title="Upcoming interview"
            sub="Tailored to a saved role."
            onClick={openInterviewPane}
            secondary
          />
          <OptionCard
            icon={FileText}
            title="Job description"
            sub="Questions from the posting."
            onClick={openJdPane}
            secondary
          />
        </div>
      </>
    );
  }

  function renderStep2() {
    return (
      <>
        <button
          type="button"
          className={s.backBtn}
          onClick={() => {
            setDirection(-1);
            setWizardStep(1);
            setFocusPane(contextMode === "interview" ? "interview" : contextMode === "jd" ? "jd" : "home");
          }}
        >
          <ChevronLeft size={14} /> Back
        </button>
        <CvPicker options={cvOptions} selectedId={selectedCvId} onSelect={handleCvSelect} />
        <input
          ref={cvUploadRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className={s.fileInput}
        />
        <motion.button
          type="button"
          className={s.uploadCvCard}
          onClick={() => cvUploadRef.current?.click()}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={18} />
          <span className={s.uploadCvTitle}>Upload another CV</span>
          <span className={s.uploadCvSub}>PDF, DOCX</span>
        </motion.button>
        <SummaryTable rows={summaryRows} />
      </>
    );
  }

  return (
    <AppShell navActive="mock" className={s.shell}>
      <section className={s.hero}>
        <div className={s.heroBg} />
        <div className={s.heroGlow} />
        <motion.div
          className={s.heroAvatarWrap}
          key={avatarPose}
          initial={{ opacity: 0.92, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <Avatar pose={avatarPose} alt="AI interview coach" className={s.heroAvatar} />
        </motion.div>
      </section>

      <section className={s.actionCard}>
        {phase === "wizard" ? (
          <>
            {showReview ? (
              <div className={s.slideViewport}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key="review"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                    className={s.slidePane}
                  >
                    {renderReview()}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <>
                <WizardStepper step={wizardStep} />
                <div className={s.wizardHeading}>
                  <h2 className={s.wizardTitle}>Mock interview</h2>
                  <p className={s.wizardSub}>{stepSubtitle}</p>
                </div>
                <div className={s.slideViewport}>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={slideKey}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={slideTransition}
                      className={s.slidePane}
                    >
                      {wizardStep === 1 ? renderStep1() : renderStep2()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
            {showPinnedCta ? (
              <motion.div
                className={s.pinnedCta}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  type="button"
                  className={`btn btn-primary btn-pill ${s.pinnedCtaBtn}`}
                  onClick={handleCta}
                  disabled={
                    (wizardStep === 1 && !canContinueStep1()) ||
                    (showReview && !reviewComplete)
                  }
                  whileTap={{ scale: 0.98 }}
                >
                  {showReview ? <Mic size={16} /> : null}
                  {showReview && !reviewComplete ? "Checking your setup…" : ctaLabel}
                  {!showReview ? <ChevronRight size={15} /> : null}
                </motion.button>
              </motion.div>
            ) : null}
          </>
        ) : null}
      </section>

      {phase === "wizard" ? (
        <div className={s.utilityRow}>
          <UtilityCard href="/history" icon={Clock} title="Previous mocks" />
          <UtilityCard href="/questions" icon={Lightbulb} title="Practice tips" />
        </div>
      ) : null}

      <AnimatePresence>
        {phase === "preparing" ? (
          <PreparingOverlay step={prepStep} onDone={finishPreparing} />
        ) : null}
      </AnimatePresence>
    </AppShell>
  );
}
