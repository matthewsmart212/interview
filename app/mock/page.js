"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "../../components/PageHeader";
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
  MessageCircle,
  Lightbulb,
  Upload,
  Check,
  Target,
  Sparkle,
  User,
} from "../../components/Icons";
import {
  INTERVIEWS,
  MOCK_HISTORY,
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

const HOW_IT_WORKS = [
  "Your AI coach asks 5 realistic questions out loud",
  "You answer by voice — just like the real thing",
  "Review each transcript before moving on",
  "Get scored feedback and tips to improve",
];

function UtilityCard({ href, icon: Icon, title }) {
  return (
    <Link href={href} className={s.utilityCard}>
      <span className={s.utilityIcon} aria-hidden>
        <Icon size={14} />
      </span>
      <span className={s.utilityTitle}>{title}</span>
      <ChevronRight size={12} className={s.utilityChev} aria-hidden />
    </Link>
  );
}

function HowItWorksList() {
  return (
    <ul className={s.howList}>
      {HOW_IT_WORKS.map((line) => (
        <li key={line}>
          <span className={s.howCheck} aria-hidden>
            <Check size={11} stroke={3} />
          </span>
          {line}
        </li>
      ))}
    </ul>
  );
}

function OptionCard({ icon: Icon, title, sub, onClick, active }) {
  return (
    <button
      type="button"
      className={`${s.optionCard} ${active ? s.optionCardActive : ""}`}
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

function CvPicker({ options, selectedId, onSelect }) {
  return (
    <div className={s.pickerList} role="listbox" aria-label="CV options">
      {options.map((opt) => {
        const selected = selectedId === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`${s.pickerRow} ${selected ? s.pickerRowSelected : ""}`}
            onClick={() => onSelect(opt.id)}
          >
            <span className={`${s.pickerLogo} ${s.pickerLogoCv}`}>
              {opt.icon === "sparkle" ? <Sparkle size={14} /> : <FileText size={14} />}
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
  const [dragOver, setDragOver] = useState(false);
  const [selectedCvId, setSelectedCvId] = useState("master");

  const upcoming = useMemo(
    () =>
      INTERVIEWS.filter((i) => i.status === "upcoming").sort(
        (a, b) => a.daysAway - b.daysAway
      ),
    []
  );
  const latestMock = MOCK_HISTORY[0];

  const cvOptions = useMemo(() => {
    const opts = [
      {
        id: "master",
        type: "master",
        label: MASTER_CV.fileName,
        meta: `Master CV · score ${MASTER_CV.score}`,
        badge: "Default",
        badgeCls: "ready",
        icon: "file",
      },
      ...CV_HISTORY.filter((c) => !c.current).map((c) => ({
        id: c.id,
        type: "upload",
        label: c.fileName,
        meta: `Uploaded ${c.uploadedAt} · score ${c.score}`,
        badge: null,
        badgeCls: "",
        icon: "file",
      })),
      ...INTERVIEWS.filter((iv) => iv.tailoredCv.exists).map((iv) => ({
        id: `tailored-${iv.id}`,
        type: "tailored",
        label: `${iv.company} — tailored`,
        meta: `Score ${iv.tailoredCv.score} · ${iv.role}`,
        badge: "Tailored",
        badgeCls: "upcoming",
        icon: "sparkle",
      })),
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

  function canContinueStep1() {
    if (contextMode === "generic") return true;
    if (contextMode === "interview") return Boolean(selectedInterviewId);
    if (contextMode === "jd") return Boolean(jdText.trim() || jdFileName);
    return false;
  }

  function goToConfirm() {
    if (!canContinueStep1()) return;
    setView("confirm");
  }

  function handleJdFile(file) {
    if (!file) return;
    setJdFileName(file.name);
    setJdText(
      `Role requirements extracted from ${file.name}.\n\nWe're looking for a friendly, reliable team member who communicates clearly and stays calm under pressure. You'll work closely with customers, resolve issues thoughtfully, and support your team during busy periods.`
    );
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
        <h2 className={s.actionTitle}>Ready to start a mock interview?</h2>
        <p className={s.actionSub}>
          Pick what to practise with — we&apos;ll shape questions and feedback around it.
        </p>

        <div className={s.optionGrid}>
          <OptionCard
            icon={Mic}
            title="Generic practice"
            sub="Balanced questions for any role"
            onClick={() => openContext("generic")}
            active={false}
          />
          <OptionCard
            icon={Calendar}
            title="Upcoming interview"
            sub="Match a role you're preparing for"
            onClick={() => openContext("interview")}
            active={false}
          />
          <OptionCard
            icon={FileText}
            title="Job description"
            sub="Paste or upload a JD to tailor questions"
            onClick={() => openContext("jd")}
            active={false}
          />
        </div>

        <p className={s.homeHint}>
          <User size={12} aria-hidden />
          Next you&apos;ll choose which CV grounds your answers
        </p>
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
          A well-rounded set of behavioural and situational questions — great when
          you want quick reps without tying to one employer.
        </p>

        <div className={s.infoPanel}>
          <span className={s.infoIcon} aria-hidden>
            <Target size={14} />
          </span>
          <div>
            <p className={s.infoLead}>What to expect</p>
            <p className={s.infoCopy}>
              Questions cover teamwork, pressure, customer situations and motivation.
              Feedback focuses on structure, clarity and impact — the skills that
              transfer to any interview.
            </p>
          </div>
        </div>

        <HowItWorksList />

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
          Questions will mirror the role, company and job description you&apos;ve saved.
        </p>

        <InterviewPicker
          interviews={upcoming}
          selectedId={selectedInterviewId}
          onSelect={setSelectedInterviewId}
        />

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
    const hasJd = Boolean(jdText.trim() || jdFileName);

    return (
      <>
        <button type="button" className={s.backBtn} onClick={goHome}>
          <ChevronLeft size={14} /> All options
        </button>
        <h2 className={s.actionTitle}>Create from job description</h2>
        <p className={s.actionSub}>
          We&apos;ll read the role requirements and generate interview questions that
          match the language and priorities in the posting.
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
              onChange={(e) => {
                setJdText(e.target.value);
                if (!e.target.value.trim()) setJdFileName(null);
              }}
              placeholder="Paste the full job description here — responsibilities, requirements, and what they're looking for..."
            />
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
              className={`${s.dropzone} ${dragOver ? s.dropzoneOver : ""} ${jdFileName ? s.dropzoneDone : ""}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <span className={s.dropIcon} aria-hidden>
                {jdFileName ? <Check size={22} stroke={2.5} /> : <Upload size={22} />}
              </span>
              <span className={s.dropTitle}>
                {jdFileName ? jdFileName : "Drop your job description here"}
              </span>
              <span className={s.dropSub}>
                {jdFileName
                  ? "Tap to replace the file"
                  : "or tap to browse · PDF, DOCX, TXT"}
              </span>
            </button>
          </div>
        )}

        {hasJd ? (
          <div className={`${s.parseNote} anim-fade-up`}>
            <Sparkle size={13} aria-hidden />
            We&apos;ll pull out key skills and craft questions around them
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

  function renderConfirm() {
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
        <p className={s.actionSub}>
          Your coach uses this to judge relevance and suggest stronger examples from
          your real experience.
        </p>

        <CvPicker
          options={cvOptions}
          selectedId={selectedCvId}
          onSelect={setSelectedCvId}
        />

        <div className={s.summaryPanel}>
          <p className={s.summaryLabel}>Your mock session</p>
          <div className={s.summaryRows}>
            <div className={s.summaryRow}>
              <span className={s.summaryKey}>Focus</span>
              <span className={s.summaryVal}>{contextLabel()}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryKey}>CV</span>
              <span className={s.summaryVal}>{selectedCv?.label}</span>
            </div>
            <div className={s.summaryRow}>
              <span className={s.summaryKey}>Length</span>
              <span className={s.summaryVal}>~10 min · 5 questions</span>
            </div>
          </div>
        </div>

        <HowItWorksList />

        <button
          type="button"
          className={`btn btn-primary btn-pill ${s.startBtn}`}
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
        <span className={`status-pill upcoming ${s.stepPill}`}>
          Step {step} of 2
        </span>
        <div key={view} className={`${s.cardBody} anim-fade-up`}>
          {body}
        </div>
      </section>

      <div className={s.utilityRow}>
        <UtilityCard href="/history" icon={Clock} title="Previous mocks" />
        <UtilityCard
          href={latestMock ? `/history/${latestMock.id}` : "/history"}
          icon={MessageCircle}
          title="Recent feedback"
        />
        <UtilityCard href="/questions" icon={Lightbulb} title="Practice tips" />
      </div>
    </AppShell>
  );
}
