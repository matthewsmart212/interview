"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Target,
} from "../../components/Icons";
import {
  INTERVIEWS,
  MASTER_CV,
  CV_HISTORY,
} from "../../lib/app-data";
import {
  saveMockSetup,
  buildInterviewHref,
  clearMockSetup,
} from "../../lib/mock-setup";
import { clearSession, clearResult } from "../../lib/interview-session";
import s from "./mock.module.css";

const GENERIC_POINTS = [
  "5 voice questions with scored feedback",
  "Review each answer before moving on",
];

const JD_MIN_CHARS = 80;

function StepProgress({ step }) {
  return (
    <div
      className={s.stepProgress}
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={2}
      aria-label={`Setup step ${step} of 2`}
    >
      <span className={`${s.stepItem} ${step === 1 ? s.stepItemActive : s.stepItemDone}`}>
        <span className={s.stepNum}>1</span>
        Focus
      </span>
      <span className={s.stepLine} aria-hidden />
      <span className={`${s.stepItem} ${step === 2 ? s.stepItemActive : ""}`}>
        <span className={s.stepNum}>2</span>
        CV
      </span>
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

function OptionCard({ icon: Icon, title, sub, onClick, primary = false }) {
  return (
    <button
      type="button"
      className={`${s.optionCard} ${primary ? s.optionCardPrimary : ""}`}
      onClick={onClick}
    >
      <span className={s.optionIcon} aria-hidden>
        <Icon size={15} />
      </span>
      <span className={s.optionBody}>
        <span className={s.optionTitle}>{title}</span>
        <span className={s.optionSub}>{sub}</span>
      </span>
      <ChevronRight size={14} className={s.optionChev} aria-hidden />
    </button>
  );
}

function InterviewPicker({ interviews, selectedId, onSelect }) {
  if (interviews.length === 0) {
    return (
      <div className={s.emptyPicker}>
        <p>No upcoming interviews yet.</p>
        <Link href="/interviews/new" className={`btn btn-secondary btn-pill ${s.emptyBtn}`}>
          <Plus size={14} /> Add an interview
        </Link>
      </div>
    );
  }

  return (
    <div className={s.pickerList} role="listbox" aria-label="Upcoming interviews">
      {interviews.map((iv) => {
        const selected = selectedId === iv.id;
        return (
          <button
            key={iv.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`${s.pickerRow} ${selected ? s.pickerRowSelected : ""}`}
            onClick={() => onSelect(iv.id)}
          >
            <span className={s.pickerLogo} style={{ background: iv.accent }}>
              {iv.initials}
            </span>
            <span className={s.pickerBody}>
              <span className={s.pickerRole}>{iv.role}</span>
              <span className={s.pickerMeta}>
                {iv.company} · In {iv.daysAway} days
              </span>
            </span>
            <span className={`${s.pickerRadio} ${selected ? s.pickerRadioOn : ""}`}>
              {selected ? <Check size={12} stroke={3} /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CvPicker({ options, selectedId, onSelect, compact = false }) {
  return (
    <div
      className={`${s.pickerList} ${compact ? s.pickerListCompact : ""}`}
      role="listbox"
      aria-label="CV options"
    >
      {options.map((opt) => {
        const selected = selectedId === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`${s.pickerRow} ${compact ? s.pickerRowCompact : ""} ${selected ? s.pickerRowSelected : ""}`}
            onClick={() => onSelect(opt.id)}
          >
            <span className={`${s.pickerLogo} ${s.pickerLogoCv}`}>
              <FileText size={14} />
            </span>
            <span className={s.pickerBody}>
              <span className={s.pickerRole}>{opt.label}</span>
              <span className={s.pickerMeta}>{opt.meta}</span>
            </span>
            {opt.badge ? (
              <span className={`status-pill ${opt.badgeCls} ${s.pickerBadge}`}>
                {opt.badge}
              </span>
            ) : null}
            <span className={`${s.pickerRadio} ${selected ? s.pickerRadioOn : ""}`}>
              {selected ? <Check size={12} stroke={3} /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function MockHubPage() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [view, setView] = useState("home");
  const [contextMode, setContextMode] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdFileName, setJdFileName] = useState(null);
  const [jdTab, setJdTab] = useState("paste");
  const [jdProcessing, setJdProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState("master");

  const upcoming = useMemo(
    () =>
      INTERVIEWS.filter((i) => i.status === "upcoming").sort(
        (a, b) => a.daysAway - b.daysAway
      ),
    []
  );
  const cvOptions = useMemo(() => {
    const opts = [
      {
        id: "master",
        type: "master",
        label: MASTER_CV.fileName,
        meta: `Master CV · score ${MASTER_CV.score}`,
        badge: "Default",
        badgeCls: "ready",
      },
      ...CV_HISTORY.filter((c) => !c.current).map((c) => ({
        id: c.id,
        type: "upload",
        label: c.fileName,
        meta: `Uploaded ${c.uploadedAt} · score ${c.score}`,
        badge: null,
        badgeCls: "",
      })),
      ...INTERVIEWS.filter((iv) => iv.tailoredCv.exists).map((iv) => ({
        id: `tailored-${iv.id}`,
        type: "tailored",
        label: `${iv.company} — tailored`,
        meta: `Score ${iv.tailoredCv.score} · ${iv.role}`,
        badge: "Tailored",
        badgeCls: "upcoming",
      })),
      {
        id: "none",
        type: "none",
        label: "No CV — quick practice",
        meta: "Generic feedback without CV matching",
        badge: null,
        badgeCls: "",
      },
    ];
    return opts;
  }, []);

  const selectedInterview = upcoming.find((i) => i.id === selectedInterviewId);
  const selectedCv = cvOptions.find((c) => c.id === selectedCvId) ?? cvOptions[0];

  const step = view === "confirm" ? 2 : 1;

  function openContext(mode) {
    setContextMode(mode);
    setView(mode);
    if (mode === "interview" && !selectedInterviewId && upcoming[0]) {
      setSelectedInterviewId(upcoming[0].id);
    }
  }

  function goHome() {
    setView("home");
    setContextMode(null);
  }

  function contextLabel() {
    if (contextMode === "generic") return "Generic practice mock";
    if (contextMode === "interview" && selectedInterview) {
      return `${selectedInterview.role} at ${selectedInterview.company}`;
    }
    if (contextMode === "jd") {
      return jdFileName ? `Role from ${jdFileName}` : "Custom job description";
    }
    return "";
  }

  function jdPasteReady() {
    return jdText.trim().length >= JD_MIN_CHARS;
  }

  function jdUploadReady() {
    return Boolean(jdFileName && jdText.trim() && !jdProcessing);
  }

  function canContinueStep1() {
    if (contextMode === "generic") return true;
    if (contextMode === "interview") return Boolean(selectedInterviewId);
    if (contextMode === "jd") {
      if (jdProcessing) return false;
      return jdTab === "paste" ? jdPasteReady() : jdUploadReady();
    }
    return false;
  }

  function goToConfirm() {
    if (!canContinueStep1()) return;
    setView("confirm");
  }

  function handleJdFile(file) {
    if (!file) return;
    setJdProcessing(true);
    setJdFileName(null);
    setJdText("");
    window.setTimeout(() => {
      setJdFileName(file.name);
      setJdText(
        `Role requirements extracted from ${file.name}.\n\nWe're looking for a friendly, reliable team member who communicates clearly and stays calm under pressure. You'll work closely with customers, resolve issues thoughtfully, and support your team during busy periods.`
      );
      setJdProcessing(false);
    }, 1400);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    handleJdFile(file);
  }

  function startMock() {
    const cvType = selectedCv?.type ?? "master";
    const config = {
      contextMode,
      contextLabel: contextLabel(),
      interviewId: contextMode === "interview" ? selectedInterviewId : undefined,
      jdText: contextMode === "jd" ? jdText : undefined,
      jdFileName: contextMode === "jd" ? jdFileName ?? undefined : undefined,
      cvId: selectedCvId,
      cvType,
      cvLabel: selectedCv?.label ?? MASTER_CV.fileName,
    };

    clearMockSetup();
    clearSession();
    clearResult();
    saveMockSetup(config);
    router.push(buildInterviewHref({ ...config, version: 1 }));
  }

  function renderHome() {
    return (
      <>
        <h2 className={`${s.actionTitle} ${s.actionTitleHome}`}>Mock interview</h2>
        <p className={`${s.actionSub} ${s.actionSubTight}`}>
          Pick what to practise with — we&apos;ll shape questions and feedback around it.
        </p>

        <div className={`${s.optionGrid} ${s.optionGridHome}`}>
          <OptionCard
            icon={Mic}
            title="Generic practice"
            sub="Balanced questions for any role"
            onClick={() => openContext("generic")}
            primary
          />
          <OptionCard
            icon={Calendar}
            title="Upcoming interview"
            sub="Match a role you're preparing for"
            onClick={() => openContext("interview")}
          />
          <OptionCard
            icon={FileText}
            title="Job description"
            sub="Paste or upload a JD to tailor questions"
            onClick={() => openContext("jd")}
          />
        </div>
      </>
    );
  }

  function renderGeneric() {
    return (
      <>
        <button type="button" className={s.backBtn} onClick={goHome}>
          <ChevronLeft size={14} /> All options
        </button>
        <h2 className={s.actionTitle}>Generic practice mock</h2>
        <p className={s.actionSub}>
          Balanced behavioural and situational questions — great for quick reps.
        </p>

        <div className={s.infoPanel}>
          <span className={s.infoIcon} aria-hidden>
            <Target size={14} />
          </span>
          <div>
            <p className={s.infoLead}>What to expect</p>
            <p className={s.infoCopy}>
              Teamwork, pressure, customer situations and motivation. Feedback
              focuses on structure, clarity and impact.
            </p>
          </div>
        </div>

        <ul className={s.howList}>
          {GENERIC_POINTS.map((line) => (
            <li key={line}>
              <span className={s.howCheck} aria-hidden>
                <Check size={11} stroke={3} />
              </span>
              {line}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={`btn btn-primary btn-pill ${s.continueBtn}`}
          onClick={goToConfirm}
        >
          Continue to CV selection
          <ChevronRight size={15} />
        </button>
      </>
    );
  }

  function renderInterview() {
    return (
      <>
        <button type="button" className={s.backBtn} onClick={goHome}>
          <ChevronLeft size={14} /> All options
        </button>
        <h2 className={s.actionTitle}>Practise for a real interview</h2>
        <p className={s.actionSub}>
          Questions mirror the role, company and job description you&apos;ve saved.
        </p>

        <InterviewPicker
          interviews={upcoming}
          selectedId={selectedInterviewId}
          onSelect={setSelectedInterviewId}
        />

        {upcoming.length > 0 ? (
          <p className={s.flowLinks}>
            Can&apos;t see your interview?{" "}
            <Link href="/interviews/new" className={s.flowLink}>
              Add a new interview
            </Link>
          </p>
        ) : null}

        {selectedInterview?.hasJD ? (
          <div className={s.jdPreview}>
            <span className={s.jdPreviewLabel}>Job description on file</span>
            <p className={s.jdPreviewText}>
              {selectedInterview.jdHighlights?.[0] ??
                "We already have a JD saved for this role."}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          className={`btn btn-primary btn-pill ${s.continueBtn}`}
          onClick={goToConfirm}
          disabled={!canContinueStep1()}
        >
          Continue to CV selection
          <ChevronRight size={15} />
        </button>
      </>
    );
  }

  function renderJd() {
    const pasteHint =
      jdTab === "paste" && jdText.trim().length > 0 && !jdPasteReady();

    return (
      <>
        <button type="button" className={s.backBtn} onClick={goHome}>
          <ChevronLeft size={14} /> All options
        </button>
        <h2 className={s.actionTitle}>Create from job description</h2>
        <p className={s.actionSub}>
          We&apos;ll read the role and generate questions that match its priorities.
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
              rows={4}
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                if (!e.target.value.trim()) setJdFileName(null);
              }}
              placeholder="Paste the job description — responsibilities, requirements, and what they're looking for…"
            />
            {pasteHint ? (
              <p className={s.jdHint}>Add a little more detail to continue</p>
            ) : null}
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
              onDrop={onDrop}
              disabled={jdProcessing}
            >
              <span className={s.dropIcon} aria-hidden>
                {jdProcessing ? (
                  <span className={s.dropSpinner} />
                ) : jdFileName ? (
                  <Check size={22} stroke={2.5} />
                ) : (
                  <Upload size={22} />
                )}
              </span>
              <span className={s.dropTitle}>
                {jdProcessing
                  ? "Reading your file…"
                  : jdFileName
                    ? jdFileName
                    : "Choose a job description file"}
              </span>
              <span className={s.dropSub}>
                {jdProcessing
                  ? "Extracting role requirements"
                  : jdFileName
                    ? "Tap to choose a different file"
                    : "Upload from Files · PDF, DOCX or TXT"}
              </span>
            </button>
          </div>
        )}

        <button
          type="button"
          className={`btn btn-primary btn-pill ${s.continueBtn}`}
          onClick={goToConfirm}
          disabled={!canContinueStep1()}
        >
          Continue to CV selection
          <ChevronRight size={15} />
        </button>
      </>
    );
  }

  function renderConfirm() {
    const cvSummary =
      selectedCvId === "none" ? "No CV — quick practice" : selectedCv?.label;

    return (
      <>
        <button
          type="button"
          className={s.backBtn}
          onClick={() => setView(contextMode)}
        >
          <ChevronLeft size={14} /> Interview setup
        </button>
        <h2 className={s.actionTitle}>Choose your CV</h2>
        <p className={`${s.actionSub} ${s.actionSubTight}`}>
          Your coach uses this to judge relevance and suggest stronger examples.
        </p>

        <CvPicker
          options={cvOptions}
          selectedId={selectedCvId}
          onSelect={setSelectedCvId}
          compact
        />

        <p className={s.flowLinkInline}>
          <Link href="/cv/upload" className={s.flowLink}>
            Upload another CV
          </Link>
        </p>

        <div className={s.summaryCompact}>
          <span className={s.summaryChip}>{contextLabel()}</span>
          <span className={s.summaryChip}>{cvSummary}</span>
          <span className={`${s.summaryChip} ${s.summaryChipMuted}`}>5 questions · ~10 min</span>
        </div>

        <button
          type="button"
          className={`btn btn-primary btn-pill ${s.startBtn} ${s.startBtnTight}`}
          onClick={startMock}
        >
          <Mic size={16} />
          Start mock interview
        </button>
      </>
    );
  }

  const body =
    view === "home"
      ? renderHome()
      : view === "generic"
        ? renderGeneric()
        : view === "interview"
          ? renderInterview()
          : view === "jd"
            ? renderJd()
            : renderConfirm();

  return (
    <AppShell navActive="mock" className={s.shell}>
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
        <StepProgress step={step} />
        <div key={view} className={`${s.cardBody} anim-fade-up`}>
          {body}
        </div>
      </section>

      <div className={s.utilityRow}>
        <UtilityCard href="/history" icon={Clock} title="Previous mocks" />
        <UtilityCard href="/questions" icon={Lightbulb} title="Practice tips" />
      </div>
    </AppShell>
  );
}
