"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Phone from "../../../components/Phone";
import TopBar from "../../../components/TopBar";
import Avatar from "../../../components/Avatar";
import { Check } from "../../../components/Icons";
import { TOTAL_QUESTIONS } from "../../../lib/interview-data";
import m from "../interview.module.css";

const STEPS = [
  `Reviewing your ${TOTAL_QUESTIONS} answers`,
  "Scoring relevance & clarity",
  "Checking STAR structure",
  "Preparing your feedback",
];

const EXTRA_MS = 3000;
const STEP_MS = 1100 + EXTRA_MS / STEPS.length;
const REDIRECT_MS = 700;

export default function AnalyzingPage() {
  const router = useRouter();
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done < STEPS.length) {
      const t = setTimeout(() => setDone((d) => d + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => router.push("/interview/feedback"), REDIRECT_MS);
    return () => clearTimeout(t);
  }, [done, router]);

  return (
    <Phone dark immersive>
      <div className={`${m.immersive} ${m.questionScreen} ${m.analyzeScreen}`}>
        <div className={m.stageBg} />
        <Avatar pose="thinking" fill alt="AI interviewer thinking" />
        <div className={m.immersiveShade} />

        <TopBar title="Analyzing..." back={false} overlay />

        <div className={m.bottomArea}>
          <div className={`${m.qcard} ${m.darkCard} ${m.analyzeBox} anim-fade-up`}>
            <div className={m.analyzeTitle}>Analyzing your interview</div>
            <div className={m.analyzeBar} aria-hidden>
              <i
                style={{
                  width: `${(done / STEPS.length) * 100}%`,
                }}
              />
            </div>
            <div className={m.steps}>
              {STEPS.map((label, i) => {
                const state =
                  i < done ? "done" : i === done ? "active" : "pending";
                return (
                  <div
                    key={label}
                    className={`${m.stepRow} ${m["step_" + state]}`}
                  >
                    <span className={m.stepIcon} aria-hidden>
                      {state === "done" ? (
                        <span className={`${m.stepCheck} anim-scale-in`}>
                          <Check size={12} stroke={3.5} />
                        </span>
                      ) : state === "active" ? (
                        <span className={m.stepSpinner} />
                      ) : (
                        <span className={m.stepDot} />
                      )}
                    </span>
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}
