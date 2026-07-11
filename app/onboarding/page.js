"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import Avatar from "../../components/Avatar";
import { AppShell, PrimaryButton } from "../../components/ui";
import {
  Calendar,
  Mic,
  FileText,
  Sparkle,
  Upload,
  Edit,
  Check,
  Volume,
  Target,
} from "../../components/Icons";
import {
  defaultProfile,
  loadProfile,
  saveProfile,
  completeOnboarding,
  skipOnboardingForDev,
  getStepsForGoal,
  getPostOnboardingCta,
  getFirstName,
} from "../../lib/onboarding-store";
import i from "../interviews/interviews.module.css";
import s from "./onboarding.module.css";

const SAMPLE_JD =
  "We're looking for a friendly and reliable Customer Service Advisor to join our team. You'll be talking to customers, solving problems and making sure every customer has a great experience...";

const GOALS = [
  {
    id: "interview",
    title: "Interview coming up",
    sub: "I have a date booked and want to nail it",
    Icon: Calendar,
  },
  {
    id: "apply",
    title: "Applying for jobs",
    sub: "Build & tailor my CV for roles I'm going for",
    Icon: FileText,
  },
  {
    id: "practice",
    title: "Just practising",
    sub: "Mock interviews to build confidence",
    Icon: Mic,
  },
  {
    id: "both",
    title: "All of the above",
    sub: "Interview prep plus CV & applications",
    Icon: Target,
  },
];

const SKILL_OPTIONS = [
  "Customer service",
  "Teamwork",
  "Communication",
  "Working under pressure",
  "Problem solving",
  "Time management",
  "Leadership",
  "Cash handling",
];

const PARSED_ITEMS = [
  "Experience & job history",
  "Skills & strengths",
  "Education captured",
  "Ready to tailor for roles",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(defaultProfile);
  const [stepIndex, setStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const [cvStage, setCvStage] = useState("pick"); // pick | upload | parsing | uploaded | create
  const [jdChoice, setJdChoice] = useState(null); // paste | skip
  const [applyJdChoice, setApplyJdChoice] = useState(null);

  const steps = useMemo(
    () => getStepsForGoal(profile.goal),
    [profile.goal]
  );
  const currentStep = steps[stepIndex] ?? "welcome";
  const totalSteps = steps.length - 1; // exclude done from count
  const displayStep = Math.min(stepIndex + 1, totalSteps);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setProfile(saved);
      if (saved.completedAt) {
        router.replace("/home");
        return;
      }
    }
    setHydrated(true);
  }, [router]);

  useEffect(() => {
    if (currentStep !== "cv") return;
    if (profile.cv.source === "upload") {
      setCvStage(profile.cv.fileName ? "uploaded" : "upload");
    } else if (profile.cv.source === "create") {
      setCvStage("create");
    } else {
      setCvStage("pick");
    }
  }, [currentStep, profile.cv.source, profile.cv.fileName]);

  useEffect(() => {
    if (cvStage !== "parsing") return undefined;
    const t = setTimeout(() => setCvStage("uploaded"), 2200);
    return () => clearTimeout(t);
  }, [cvStage]);

  const update = (patch) =>
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      saveProfile(next);
      return next;
    });

  const updateCv = (patch) =>
    setProfile((prev) => {
      const next = { ...prev, cv: { ...prev.cv, ...patch } };
      saveProfile(next);
      return next;
    });

  const updateInterview = (patch) =>
    setProfile((prev) => {
      const next = { ...prev, interview: { ...prev.interview, ...patch } };
      saveProfile(next);
      return next;
    });

  const updateApply = (patch) =>
    setProfile((prev) => {
      const next = { ...prev, apply: { ...prev.apply, ...patch } };
      saveProfile(next);
      return next;
    });

  const updatePrefs = (patch) =>
    setProfile((prev) => {
      const next = {
        ...prev,
        preferences: { ...prev.preferences, ...patch },
      };
      saveProfile(next);
      return next;
    });

  const goNext = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const goBack = () => {
    if (stepIndex === 0) router.push("/");
    else setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleCvContinue = () => {
    if (profile.cv.source === "upload" && cvStage === "uploaded") goNext();
    else if (profile.cv.source === "create") goNext();
    else if (profile.cv.source === "skip") goNext();
  };

  const canContinueCv = () => {
    if (profile.cv.source === "skip") return true;
    if (profile.cv.source === "upload") return cvStage === "uploaded";
    if (profile.cv.source === "create") {
      return (
        profile.cv.targetRole?.trim() &&
        profile.cv.jobs?.[0]?.role?.trim()
      );
    }
    return false;
  };

  const toggleSkill = (sk) => {
    const current = profile.cv.skills ?? [];
    const next = current.includes(sk)
      ? current.filter((x) => x !== sk)
      : [...current, sk];
    updateCv({ skills: next });
  };

  const finishOnboarding = () => {
    const done = completeOnboarding(profile);
    setProfile(done);
  };

  const handleSkipAll = () => {
    skipOnboardingForDev();
    router.replace("/home");
  };

  if (!hydrated) return null;

  const firstName = getFirstName(profile);
  const postCta = getPostOnboardingCta(profile);

  return (
    <AppShell noNav>
      <PageHeader
        icon="sparkle"
        title="Welcome"
        description={
          currentStep === "done"
            ? "You're all set"
            : "Let's personalise your coach"
        }
        back={currentStep !== "done"}
        onBack={goBack}
        right={
          currentStep !== "done" ? (
            <span className="step-count">
              {displayStep} of {totalSteps}
            </span>
          ) : null
        }
      />

      {currentStep !== "done" && (
        <>
          <p className={s.progressLabel}>
            {Math.round((displayStep / totalSteps) * 100)}% complete
          </p>
          <div className={i.stepDots} aria-hidden>
            {steps.slice(0, -1).map((id, n) => (
              <i key={id} className={n <= stepIndex ? "on" : ""} />
            ))}
          </div>
        </>
      )}

      {/* ---- Step: Welcome ---- */}
      {currentStep === "welcome" && (
        <div className="anim-fade-up">
          <div className={s.heroBlock}>
            <div className={s.heroCopy}>
              <span className={s.heroEyebrow}>
                <span className={s.heroDot} aria-hidden />
                Fresh start
              </span>
              <h1 className="page-h1">Hi there! I&apos;m your coach.</h1>
              <p className="page-sub">
                First, what should I call you? I&apos;ll use this across your CV,
                mocks and dashboard.
              </p>
            </div>
            <Avatar
              pose="waving"
              alt="AI coach waving hello"
              className={s.heroAvatar}
            />
          </div>

          <div className="field" style={{ marginTop: 8 }}>
            <label>Your first name</label>
            <input
              className="input"
              value={profile.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. Alex"
              autoFocus
            />
          </div>

          <PrimaryButton
            style={{ marginTop: 16 }}
            disabled={!profile.name.trim()}
            onClick={goNext}
          >
            Nice to meet you{profile.name.trim() ? `, ${firstName}` : ""}
          </PrimaryButton>

          <button
            type="button"
            className={s.seedDev}
            onClick={handleSkipAll}
          >
            Seed demo data &amp; skip to dashboard
          </button>
          <p className={s.seedHint}>
            Dev only — loads sample CV, interviews and mocks so you can browse the full app.
          </p>
        </div>
      )}

      {/* ---- Step: Goal ---- */}
      {currentStep === "goal" && (
        <div className="anim-fade-up">
          <h1 className="page-h1">
            What brings you here, {firstName}?
          </h1>
          <p className="page-sub">
            Pick what matters most right now — you can do everything else later.
          </p>

          <div className={s.goalGrid}>
            {GOALS.map(({ id, title, sub, Icon }) => (
              <button
                key={id}
                type="button"
                className={`${s.goalCard}${profile.goal === id ? ` ${s.active}` : ""}`}
                onClick={() => update({ goal: id })}
              >
                <span className={s.goalCheck} aria-hidden>
                  <Check size={13} stroke={3} />
                </span>
                <span className={s.goalIcon}>
                  <Icon size={20} />
                </span>
                <span className={s.goalTitle}>{title}</span>
                <span className={s.goalSub}>{sub}</span>
              </button>
            ))}
          </div>

          <PrimaryButton
            style={{ marginTop: 20 }}
            disabled={!profile.goal}
            onClick={goNext}
          >
            Continue
          </PrimaryButton>
        </div>
      )}

      {/* ---- Step: CV ---- */}
      {currentStep === "cv" && (
        <div className="anim-fade-up">
          {cvStage === "pick" && (
            <>
              <h1 className="page-h1">Do you have a CV?</h1>
              <p className="page-sub">
                Your CV powers tailored questions, match scores and role-specific
                tips — the more we know, the better your prep.
              </p>

              <div style={{ marginTop: 22 }}>
                <button
                  type="button"
                  className={`${i.choiceCard}${profile.cv.source === "upload" ? ` ${i.active}` : ""}`}
                  onClick={() => {
                    updateCv({ source: "upload" });
                    setCvStage("upload");
                  }}
                >
                  <span className={i.choiceIcon}>
                    <Upload size={20} />
                  </span>
                  <span>
                    <span className={i.choiceTitle}>Yes — upload it</span>
                    <span className={i.choiceSub}>
                      PDF or Word. We&apos;ll read and score it in seconds.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className={`${i.choiceCard}${profile.cv.source === "create" ? ` ${i.active}` : ""}`}
                  onClick={() => {
                    updateCv({
                      source: "create",
                      targetRole: profile.cv.targetRole ?? "",
                      about: profile.cv.about ?? "",
                      jobs: profile.cv.jobs ?? [
                        { role: "", company: "", period: "" },
                      ],
                      skills: profile.cv.skills ?? ["Customer service"],
                    });
                    setCvStage("create");
                  }}
                >
                  <span className={i.choiceIcon}>
                    <Edit size={20} />
                  </span>
                  <span>
                    <span className={i.choiceTitle}>No — build one now</span>
                    <span className={i.choiceSub}>
                      Quick questions and we&apos;ll draft your CV.
                    </span>
                  </span>
                </button>
              </div>

              <button
                type="button"
                className={s.skipCv}
                onClick={() => {
                  updateCv({ source: "skip" });
                  goNext();
                }}
              >
                Skip for now — I&apos;ll add it later
              </button>
            </>
          )}

          {cvStage === "upload" && (
            <>
              <h1 className="page-h1">Upload your CV</h1>
              <p className="page-sub">
                Tap below to choose a file. We&apos;ll extract your experience
                automatically.
              </p>
              <button
                type="button"
                className={s.dropzone}
                onClick={() => {
                  updateCv({
                    source: "upload",
                    fileName: `${profile.name.trim() || "My"}-CV.pdf`,
                  });
                  setCvStage("parsing");
                }}
              >
                <span className={s.dropIcon}>
                  <Upload size={26} />
                </span>
                <div className={s.dropTitle}>Tap to choose a file</div>
                <div className={s.dropSub}>or drag &amp; drop it here</div>
                <div className={s.formats}>
                  <span>PDF</span>
                  <span>DOCX</span>
                  <span>TXT</span>
                </div>
              </button>
              <button
                type="button"
                className="link-btn"
                style={{ display: "block", margin: "16px auto 0" }}
                onClick={() => {
                  setCvStage("pick");
                  updateCv({ source: null });
                }}
              >
                Choose a different option
              </button>
            </>
          )}

          {cvStage === "parsing" && (
            <div className={s.parseWrap}>
              <div className={s.spinner} aria-hidden />
              <h1 className="page-h1">Reading your CV...</h1>
              <p className="page-sub" style={{ marginTop: 10 }}>
                Picking out your experience, skills and achievements.
              </p>
            </div>
          )}

          {cvStage === "uploaded" && (
            <>
              <div className={s.uploadDone}>
                <span
                  className={s.dropIcon}
                  style={{
                    background: "var(--green-050)",
                    color: "var(--green)",
                    margin: "0 auto",
                  }}
                >
                  <FileText size={26} />
                </span>
                <h1 className="page-h1">CV ready!</h1>
                <p className="page-sub" style={{ marginTop: 8 }}>
                  {profile.cv.fileName} · scored and ready to tailor.
                </p>
              </div>
              <ul className={s.parsedList}>
                {PARSED_ITEMS.map((item) => (
                  <li key={item}>
                    <Check size={16} className={s.parsedCheck} stroke={3} />
                    {item}
                  </li>
                ))}
              </ul>
              <PrimaryButton style={{ marginTop: 20 }} onClick={handleCvContinue}>
                Continue
              </PrimaryButton>
            </>
          )}

          {cvStage === "create" && (
            <>
              <h1 className="page-h1">Quick CV builder</h1>
              <p className="page-sub">
                Just the essentials — you can refine everything in your CV hub.
              </p>

              <div className="field" style={{ marginTop: 22 }}>
                <label>What kind of work are you looking for?</label>
                <input
                  className="input"
                  value={profile.cv.targetRole ?? ""}
                  onChange={(e) => updateCv({ targetRole: e.target.value })}
                  placeholder="e.g. Customer service roles"
                />
              </div>

              <div className="field">
                <label>
                  A line about you{" "}
                  <span className="opt">(we&apos;ll polish it)</span>
                </label>
                <textarea
                  className="textarea"
                  value={profile.cv.about ?? ""}
                  onChange={(e) => updateCv({ about: e.target.value })}
                  placeholder="Friendly, reliable, great with people..."
                  rows={3}
                />
              </div>

              <div className="field">
                <label>Most recent job</label>
                <input
                  className="input"
                  value={profile.cv.jobs?.[0]?.role ?? ""}
                  onChange={(e) =>
                    updateCv({
                      jobs: [
                        {
                          ...(profile.cv.jobs?.[0] ?? {
                            role: "",
                            company: "",
                            period: "",
                          }),
                          role: e.target.value,
                        },
                      ],
                    })
                  }
                  placeholder="Job title"
                />
                <input
                  className="input"
                  style={{ marginTop: 8 }}
                  value={profile.cv.jobs?.[0]?.company ?? ""}
                  onChange={(e) =>
                    updateCv({
                      jobs: [
                        {
                          ...(profile.cv.jobs?.[0] ?? {
                            role: "",
                            company: "",
                            period: "",
                          }),
                          company: e.target.value,
                        },
                      ],
                    })
                  }
                  placeholder="Company"
                />
              </div>

              <div className="field">
                <label>Your strengths</label>
                <div className={s.skillRow}>
                  {SKILL_OPTIONS.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      className={`${s.skillChip}${
                        (profile.cv.skills ?? []).includes(sk) ? ` ${s.on}` : ""
                      }`}
                      onClick={() => toggleSkill(sk)}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </div>

              <PrimaryButton
                style={{ marginTop: 8 }}
                disabled={!canContinueCv()}
                onClick={handleCvContinue}
              >
                Save &amp; continue
              </PrimaryButton>
              <button
                type="button"
                className={s.skipCv}
                onClick={() => {
                  updateCv({ source: "skip" });
                  goNext();
                }}
              >
                Skip for now
              </button>
            </>
          )}
        </div>
      )}

      {/* ---- Step: Interview details ---- */}
      {currentStep === "interview" && (
        <div className="anim-fade-up">
          <h1 className="page-h1">Tell us about the interview</h1>
          <p className="page-sub">
            We&apos;ll build your prep plan, countdown and tailored mock
            questions around it.
          </p>

          <div className="field" style={{ marginTop: 22 }}>
            <label>Job role</label>
            <input
              className="input"
              value={profile.interview.role}
              onChange={(e) => updateInterview({ role: e.target.value })}
              placeholder="e.g. Customer Service Advisor"
            />
          </div>

          <div className="field">
            <label>
              Company <span className="opt">(optional)</span>
            </label>
            <input
              className="input"
              value={profile.interview.company}
              onChange={(e) => updateInterview({ company: e.target.value })}
              placeholder="e.g. Tesco"
            />
          </div>

          <div className="field">
            <label>Interview type</label>
            <div className="segmented">
              {["In-person", "Phone", "Video"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={
                    profile.interview.type === t ? "active" : ""
                  }
                  onClick={() => {
                    updateInterview({ type: t });
                    updatePrefs({ interviewFormat: t });
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>
              Interview date <span className="opt">(optional)</span>
            </label>
            <div className="input-icon">
              <input
                className="input"
                value={profile.interview.date}
                onChange={(e) => updateInterview({ date: e.target.value })}
                placeholder="e.g. 24 May 2026"
              />
              <span className="i">
                <Calendar size={20} />
              </span>
            </div>
          </div>

          <PrimaryButton
            style={{ marginTop: 8 }}
            disabled={!profile.interview.role.trim()}
            onClick={goNext}
          >
            Continue
          </PrimaryButton>
        </div>
      )}

      {/* ---- Step: Job description (interview path) ---- */}
      {currentStep === "jd" && (
        <div className="anim-fade-up">
          <h1 className="page-h1">Got the job description?</h1>
          <p className="page-sub">
            With it we can tailor your CV, mock questions and keyword tips to
            what this employer actually wants.
          </p>

          <div style={{ marginTop: 22 }}>
            <button
              type="button"
              className={`${i.choiceCard}${jdChoice === "paste" ? ` ${i.active}` : ""}`}
              onClick={() => {
                setJdChoice("paste");
                updateInterview({ hasJd: true });
              }}
            >
              <span className={i.choiceIcon}>
                <FileText size={20} />
              </span>
              <span>
                <span className={i.choiceTitle}>Yes, paste it in</span>
                <span className={i.choiceSub}>
                  Tailored questions, CV matching &amp; keyword tips
                </span>
              </span>
            </button>

            <button
              type="button"
              className={`${i.choiceCard}${jdChoice === "skip" ? ` ${i.active}` : ""}`}
              onClick={() => {
                setJdChoice("skip");
                updateInterview({ hasJd: false, jd: "" });
              }}
            >
              <span className={i.choiceIcon}>
                <Sparkle size={20} />
              </span>
              <span>
                <span className={i.choiceTitle}>Not right now</span>
                <span className={i.choiceSub}>
                  We&apos;ll use great generic questions for this role
                </span>
              </span>
            </button>
          </div>

          {jdChoice === "paste" && (
            <div className="field anim-fade-up" style={{ marginTop: 6 }}>
              <label>Paste the job description</label>
              <textarea
                className="textarea"
                value={profile.interview.jd}
                onChange={(e) => updateInterview({ jd: e.target.value })}
                placeholder="Paste the job description here..."
                rows={6}
              />
              <button
                type="button"
                className="link-btn"
                style={{ marginTop: 8 }}
                onClick={() => updateInterview({ jd: SAMPLE_JD })}
              >
                Use sample job description
              </button>
            </div>
          )}

          <PrimaryButton
            style={{ marginTop: 14 }}
            disabled={
              !(
                jdChoice === "skip" ||
                (jdChoice === "paste" && profile.interview.jd.trim())
              )
            }
            onClick={goNext}
          >
            Continue
          </PrimaryButton>
          {jdChoice === "skip" && (
            <p className={i.skipNote}>
              You can add the job description any time from your interview
              page.
            </p>
          )}
        </div>
      )}

      {/* ---- Step: Apply focus ---- */}
      {currentStep === "apply" && (
        <div className="anim-fade-up">
          <h1 className="page-h1">What are you applying for?</h1>
          <p className="page-sub">
            Tell us the kind of role so we can tailor your CV and suggestions.
          </p>

          <div className="field" style={{ marginTop: 22 }}>
            <label>Target role or industry</label>
            <input
              className="input"
              value={profile.apply.targetRole}
              onChange={(e) => updateApply({ targetRole: e.target.value })}
              placeholder="e.g. Retail customer service"
            />
          </div>

          <p className="form-h" style={{ marginTop: 20 }}>
            Have a job description to match against?
          </p>

          <button
            type="button"
            className={`${i.choiceCard}${applyJdChoice === "paste" ? ` ${i.active}` : ""}`}
            onClick={() => {
              setApplyJdChoice("paste");
              updateApply({ hasJd: true });
            }}
          >
            <span className={i.choiceIcon}>
              <FileText size={20} />
            </span>
            <span>
              <span className={i.choiceTitle}>Yes — paste a job ad</span>
              <span className={i.choiceSub}>
                Tailor your CV keywords &amp; match score to it
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`${i.choiceCard}${applyJdChoice === "skip" ? ` ${i.active}` : ""}`}
            onClick={() => {
              setApplyJdChoice("skip");
              updateApply({ hasJd: false, jd: "" });
            }}
          >
            <span className={i.choiceIcon}>
              <Sparkle size={20} />
            </span>
            <span>
              <span className={i.choiceTitle}>Not yet</span>
              <span className={i.choiceSub}>
                We&apos;ll optimise for your target role instead
              </span>
            </span>
          </button>

          {applyJdChoice === "paste" && (
            <div className="field anim-fade-up" style={{ marginTop: 6 }}>
              <label>Job description</label>
              <textarea
                className="textarea"
                value={profile.apply.jd}
                onChange={(e) => updateApply({ jd: e.target.value })}
                placeholder="Paste the job ad here..."
                rows={5}
              />
            </div>
          )}

          <PrimaryButton
            style={{ marginTop: 14 }}
            disabled={
              !profile.apply.targetRole.trim() ||
              !(
                applyJdChoice === "skip" ||
                (applyJdChoice === "paste" && profile.apply.jd.trim())
              )
            }
            onClick={goNext}
          >
            Continue
          </PrimaryButton>
        </div>
      )}

      {/* ---- Step: Preferences ---- */}
      {currentStep === "prefs" && (
        <div className="anim-fade-up">
          <h1 className="page-h1">Almost there, {firstName}!</h1>
          <p className="page-sub">
            A couple of quick preferences so your practice feels natural.
          </p>

          <div style={{ marginTop: 22 }}>
            <div className={s.prefCard}>
              <span className={s.prefIcon}>
                <Volume size={20} />
              </span>
              <span className={s.prefBody}>
                <span className={s.prefTitle}>Voice practice</span>
                <span className={s.prefSub}>
                  Answer out loud like the real thing — with live transcription
                </span>
              </span>
              <button
                type="button"
                className={`${s.toggle}${profile.preferences.voicePractice ? ` ${s.on}` : ""}`}
                onClick={() =>
                  updatePrefs({
                    voicePractice: !profile.preferences.voicePractice,
                  })
                }
                aria-pressed={profile.preferences.voicePractice}
                aria-label="Toggle voice practice"
              >
                <span className={s.toggleKnob} />
              </button>
            </div>

            <p className="form-h">Preferred interview format</p>
            <div className="segmented">
              {["In-person", "Phone", "Video"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={
                    profile.preferences.interviewFormat === t ? "active" : ""
                  }
                  onClick={() => updatePrefs({ interviewFormat: t })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <PrimaryButton style={{ marginTop: 20 }} onClick={goNext}>
            Finish setup
          </PrimaryButton>
        </div>
      )}

      {/* ---- Step: Done ---- */}
      {currentStep === "done" && (
        <div className={`${s.doneHero} anim-fade-up`}>
          <Avatar
            pose="thumbsup"
            alt="AI coach celebrating"
            className={s.doneAvatar}
          />
          <h1 className="page-h1">You&apos;re all set, {firstName}!</h1>
          <p className="page-sub" style={{ margin: "10px auto 0", maxWidth: 300 }}>
            Your coach is personalised and ready. Here&apos;s what we&apos;ve set
            up for you.
          </p>

          <div className={s.summaryCard}>
            <div className={s.summaryTitle}>Your plan</div>

            <div className={s.summaryRow}>
              <span className={s.summaryIcon}>
                <Sparkle size={16} />
              </span>
              <span>
                <span className={s.summaryLabel}>Focus</span>
                <span className={s.summaryValue}>
                  {GOALS.find((g) => g.id === profile.goal)?.title ?? "—"}
                </span>
              </span>
            </div>

            {profile.cv.source && profile.cv.source !== "skip" && (
              <div className={s.summaryRow}>
                <span className={s.summaryIcon}>
                  <FileText size={16} />
                </span>
                <span>
                  <span className={s.summaryLabel}>CV</span>
                  <span className={s.summaryValue}>
                    {profile.cv.source === "upload"
                      ? profile.cv.fileName ?? "Uploaded"
                      : profile.cv.targetRole ?? "Created"}
                  </span>
                </span>
              </div>
            )}

            {(profile.goal === "interview" || profile.goal === "both") &&
              profile.interview.role && (
                <div className={s.summaryRow}>
                  <span className={s.summaryIcon}>
                    <Calendar size={16} />
                  </span>
                  <span>
                    <span className={s.summaryLabel}>Interview</span>
                    <span className={s.summaryValue}>
                      {profile.interview.role}
                      {profile.interview.company
                        ? ` · ${profile.interview.company}`
                        : ""}
                      {profile.interview.date
                        ? ` · ${profile.interview.date}`
                        : ""}
                    </span>
                  </span>
                </div>
              )}

            {profile.goal === "apply" && profile.apply.targetRole && (
              <div className={s.summaryRow}>
                <span className={s.summaryIcon}>
                  <FileText size={16} />
                </span>
                <span>
                  <span className={s.summaryLabel}>Applying for</span>
                  <span className={s.summaryValue}>
                    {profile.apply.targetRole}
                  </span>
                </span>
              </div>
            )}

            {profile.preferences.voicePractice && (
              <div className={s.summaryRow}>
                <span className={s.summaryIcon}>
                  <Mic size={16} />
                </span>
                <span>
                  <span className={s.summaryLabel}>Practice mode</span>
                  <span className={s.summaryValue}>
                    Voice answers with AI feedback
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className={s.footerActions}>
            <PrimaryButton
              onClick={() => {
                finishOnboarding();
                router.push(postCta.href);
              }}
            >
              {postCta.label}
            </PrimaryButton>
            {postCta.secondary && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  finishOnboarding();
                  router.push(postCta.secondary.href);
                }}
              >
                {postCta.secondary.label}
              </button>
            )}
          </div>
        </div>
      )}
      {currentStep !== "done" && currentStep !== "welcome" && (
        <button
          type="button"
          className={s.devSkip}
          onClick={handleSkipAll}
        >
          Skip onboarding (dev)
        </button>
      )}
    </AppShell>
  );
}
