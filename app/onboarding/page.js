"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, SheetBack, PrimaryButton } from "../../components/ui";
import {
  Calendar,
  Mic,
  FileText,
  Sparkle,
  Upload,
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
    sub: "I have a date booked — prepare me with mocks",
    Icon: Calendar,
  },
  {
    id: "practice",
    title: "Just practising",
    sub: "Build confidence with mock interviews anytime",
    Icon: Mic,
  },
  {
    id: "both",
    title: "Prep and practise",
    sub: "Upcoming interview plus ongoing mock practice",
    Icon: Target,
  },
];

const PARSED_ITEMS = [
  "Experience & job history",
  "Skills & strengths",
  "Education captured",
  "Ready to personalise your mocks",
];

/** Normalise legacy draft fields from older onboarding shapes. */
function normaliseDraft(saved) {
  if (!saved) return null;
  const next = { ...saved };
  if (next.goal === "apply") next.goal = "practice";
  if (next.cv?.source === "create") {
    next.cv = { ...next.cv, source: "skip" };
  }
  return next;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(defaultProfile);
  const [stepIndex, setStepIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const [cvStage, setCvStage] = useState("pick"); // pick | upload | parsing | uploaded
  const [jdChoice, setJdChoice] = useState(null); // paste | skip

  const steps = useMemo(
    () => getStepsForGoal(profile.goal),
    [profile.goal]
  );
  const currentStep = steps[stepIndex] ?? "welcome";

  useEffect(() => {
    const saved = normaliseDraft(loadProfile());
    if (saved) {
      setProfile(saved);
      saveProfile(saved);
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
    else if (profile.cv.source === "skip") goNext();
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

  const coachByStep = {
    welcome: {
      pose: "waving",
      title: "Hi — I'm your coach",
      speech: "What should I call you? I'll use it across your mocks and progress.",
    },
    goal: {
      pose: "presenting",
      title: `Nice to meet you, ${firstName}`,
      speech: "What brings you here? I'll set up your prep around it.",
    },
    cv: {
      pose: cvStage === "uploaded" ? "thumbsup" : "idle",
      title:
        cvStage === "parsing"
          ? "Reading your CV…"
          : cvStage === "uploaded"
            ? "CV ready"
            : "Your CV",
      speech:
        cvStage === "parsing"
          ? "Hang on — I'm picking out experience for your mocks."
          : cvStage === "uploaded"
            ? "I'll use this to personalise every practice session."
            : "One permanent CV powers every mock. Skip if you don't have it yet.",
    },
    interview: {
      pose: "presenting",
      title: "Upcoming interview",
      speech: "Tell me the role — I'll build your prep plan and countdown around it.",
    },
    jd: {
      pose: "idle",
      title: "Job description?",
      speech: "With the JD I can ask what this employer would ask. Skip if you don't have it.",
    },
    prefs: {
      pose: "welcoming",
      title: `Almost there, ${firstName}`,
      speech: "A couple of quick preferences so practice feels natural.",
    },
    done: {
      pose: "thumbsup",
      title: `You're all set, ${firstName}`,
      speech: "Here's your plan — pick a path and I'll guide you from here.",
    },
  };
  const coach = coachByStep[currentStep] || coachByStep.welcome;

  return (
    <AppShell
      noNav
      coachPose={coach.pose}
      coachTitle={coach.title}
      coachSpeech={coach.speech}
    >
      {currentStep !== "done" ? (
        <SheetBack onClick={goBack}>
          {stepIndex === 0 ? "Welcome" : "Back"}
        </SheetBack>
      ) : null}

      {currentStep !== "done" && (
        <div className={i.stepDots} aria-hidden>
          {steps.slice(0, -1).map((id, n) => (
            <i key={id} className={n <= stepIndex ? "on" : ""} />
          ))}
        </div>
      )}

      {/* ---- Step: Welcome ---- */}
      {currentStep === "welcome" && (
        <div className="anim-fade-up">
          <div className="field">
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
                    PDF or Word. One CV for all your mocks.
                  </span>
                </span>
              </button>

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
                Back
              </button>
            </>
          )}

          {cvStage === "parsing" && (
            <div className={s.parseWrap}>
              <div className={s.spinner} aria-hidden />
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
                <p className="page-sub" style={{ marginTop: 8 }}>
                  {profile.cv.fileName} · ready to personalise your mocks.
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
        </div>
      )}

      {/* ---- Step: Interview details ---- */}
      {currentStep === "interview" && (
        <div className="anim-fade-up">
          <div className="field">
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
                Personalised mock questions for this role
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

      {/* ---- Step: Preferences ---- */}
      {currentStep === "prefs" && (
        <div className="anim-fade-up">
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

          <PrimaryButton style={{ marginTop: 20 }} onClick={goNext}>
            Finish setup
          </PrimaryButton>
        </div>
      )}

      {/* ---- Step: Done ---- */}
      {currentStep === "done" && (
        <div className={`${s.doneHero} anim-fade-up`}>
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

            {profile.cv.source === "upload" && (
              <div className={s.summaryRow}>
                <span className={s.summaryIcon}>
                  <FileText size={16} />
                </span>
                <span>
                  <span className={s.summaryLabel}>CV</span>
                  <span className={s.summaryValue}>
                    {profile.cv.fileName ?? "Uploaded"}
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
