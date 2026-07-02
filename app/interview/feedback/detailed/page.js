"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Phone from "../../../../components/Phone";
import TopBar from "../../../../components/TopBar";
import { Play, CheckCircle, AlertCircle } from "../../../../components/Icons";
import { QUESTIONS, questionScore } from "../../../../lib/interview-data";
import s from "./detailed.module.css";

const TABS = ["Feedback", "Transcript", "Better Answer"];

const BAR_COLORS = {
  Relevance: "#22c55e",
  "Structure (STAR)": "#6c4ce6",
  Clarity: "#3b82f6",
  Confidence: "#f5a524",
  Impact: "#ef4444",
};

function DetailedFeedback() {
  const params = useSearchParams();
  const initial = Math.min(
    QUESTIONS.length - 1,
    Math.max(0, parseInt(params.get("q") || "0", 10) || 0)
  );
  const [qi, setQi] = useState(initial);
  const [tab, setTab] = useState("Feedback");
  const q = QUESTIONS[qi];

  return (
    <>
      <div className="chips" style={{ marginBottom: 14 }}>
        {QUESTIONS.map((question, i) => (
          <button
            key={question.id}
            className={`chip${qi === i ? " active" : ""}`}
            onClick={() => setQi(i)}
          >
            Q{i + 1}
          </button>
        ))}
      </div>

      <p className={`${s.qTitle} anim-fade-up`} key={`t-${qi}`}>
        {q.text}
      </p>

      <div className="tabs" style={{ margin: "14px 0 18px" }}>
        {TABS.map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div key={`${qi}-${tab}`} className="anim-fade-up">
        {tab === "Feedback" && (
          <>
            <div className="card mb-16">
              <div className={s.head}>Your Answer</div>
              <div className={s.playerRow}>
                <p className={s.answer}>{q.transcript}</p>
                <div className={s.playCol}>
                  <button className={s.playBtn} aria-label="Play answer">
                    <Play size={20} />
                  </button>
                  <span className={s.time}>{q.duration}</span>
                </div>
              </div>
            </div>

            <div className="card mb-16">
              <div className={s.head}>Feedback Breakdown</div>
              {Object.entries(q.scores).map(([label, value], i) => (
                <div className="meter-row" key={label}>
                  <span className="m-label">{label}</span>
                  <span className="m-val">{value}/20</span>
                  <span className="meter m-bar">
                    <i
                      className={s.animBar}
                      style={{
                        "--w": `${(value / 20) * 100}%`,
                        animationDelay: `${0.1 + i * 0.08}s`,
                        background: BAR_COLORS[label],
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>

            <div className="card mb-16">
              <div className={s.head}>Notes</div>
              {q.good.map((t) => (
                <div className="fb-item fb-good" key={t}>
                  <span className="fb-ico">
                    <CheckCircle size={18} />
                  </span>
                  <span>{t}</span>
                </div>
              ))}
              {q.improve.map((t) => (
                <div className="fb-item fb-bad" key={t}>
                  <span className="fb-ico">
                    <AlertCircle size={18} />
                  </span>
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <div className={s.scoreBox}>
              <span className={s.l}>Question Score</span>
              <span className={s.v}>
                {questionScore(q)}
                <small>/100</small>
              </span>
            </div>
          </>
        )}

        {tab === "Transcript" && (
          <>
            <div className={s.turn}>
              <div className={s.speaker}>AI Interviewer</div>
              <div className={`${s.bubble} ${s.ai}`}>{q.text}</div>
            </div>
            <div className={s.turn}>
              <div className={s.speaker}>You</div>
              <div className={s.bubble}>{q.transcript}</div>
            </div>
          </>
        )}

        {tab === "Better Answer" && (
          <>
            <p className={s.betterIntro}>
              Here&apos;s an example of a stronger answer:
            </p>
            {Object.entries(q.better).map(([label, text]) => (
              <div className={s.star} key={label}>
                <div className={s.starLabel}>{label.toUpperCase()}</div>
                <p className={s.starText}>{text}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default function DetailedFeedbackPage() {
  return (
    <Phone>
      <TopBar title="Detailed Feedback" backHref="/interview/feedback" />
      <div className="screen screen-pad">
        <Suspense fallback={null}>
          <DetailedFeedback />
        </Suspense>
      </div>
    </Phone>
  );
}
