"use client";

import { useState } from "react";
import Phone from "../../../../components/Phone";
import TopBar from "../../../../components/TopBar";
import { Play } from "../../../../components/Icons";
import s from "./detailed.module.css";

const TABS = ["Feedback", "Transcript", "Better Answer"];

const BREAKDOWN = [
  { label: "Relevance", value: 20, color: "#22c55e" },
  { label: "Structure (STAR)", value: 18, color: "#6c4ce6" },
  { label: "Clarity", value: 18, color: "#3b82f6" },
  { label: "Confidence", value: 14, color: "#f5a524" },
  { label: "Impact", value: 14, color: "#ef4444" },
];

const ANSWER =
  "So I was working at a shop and this customer was really angry about a refund. I listened to what they said and then I apologised and offered to sort it out. In the end they were happy.";

const STAR = [
  {
    label: "SITUATION",
    text: "I was working in a busy store when a customer came in unhappy about a refund for a faulty product.",
  },
  {
    label: "TASK",
    text: "My task was to understand the issue, calm the situation and find a solution that was fair for both the customer and the store.",
  },
  {
    label: "ACTION",
    text: "I listened carefully to the customer, apologised for the inconvenience and checked the policy. I offered a full refund and explained the next steps.",
  },
  {
    label: "RESULT",
    text: "The customer was happy with the outcome and even thanked me for being helpful. They came back the following week and left positive feedback.",
  },
];

export default function DetailedFeedbackPage() {
  const [tab, setTab] = useState("Feedback");

  return (
    <Phone>
      <TopBar title="Detailed Feedback" backHref="/interview/feedback" />
      <div className="screen screen-pad">
        <div className="tabs" style={{ marginBottom: 18 }}>
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

        {tab === "Feedback" && (
          <>
            <div className="card mb-16">
              <div className={s.head}>Your Answer</div>
              <div className={s.playerRow}>
                <p className={s.answer}>{ANSWER}</p>
                <div className={s.playCol}>
                  <button className={s.playBtn} aria-label="Play answer">
                    <Play size={20} />
                  </button>
                  <span className={s.time}>0:45</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className={s.head}>Feedback Breakdown</div>
              {BREAKDOWN.map((b) => (
                <div className="meter-row" key={b.label}>
                  <span className="m-label">{b.label}</span>
                  <span className="m-val">{b.value}/20</span>
                  <span className="meter m-bar">
                    <i
                      style={{
                        width: `${(b.value / 20) * 100}%`,
                        background: b.color,
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>

            <div className={s.scoreBox}>
              <span className={s.l}>Overall Score</span>
              <span className={s.v}>
                82<small>/100</small>
              </span>
            </div>
          </>
        )}

        {tab === "Transcript" && (
          <>
            <div className={s.turn}>
              <div className={s.speaker}>AI Interviewer</div>
              <div className={`${s.bubble} ${s.ai}`}>
                Can you tell me about a time you had to deal with a difficult
                customer? How did you handle it?
              </div>
            </div>
            <div className={s.turn}>
              <div className={s.speaker}>You</div>
              <div className={s.bubble}>{ANSWER}</div>
            </div>
          </>
        )}

        {tab === "Better Answer" && (
          <>
            <p className={s.betterIntro}>
              Here&apos;s an example of a stronger answer:
            </p>
            {STAR.map((p) => (
              <div className={s.star} key={p.label}>
                <div className={s.starLabel}>{p.label}</div>
                <p className={s.starText}>{p.text}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </Phone>
  );
}
