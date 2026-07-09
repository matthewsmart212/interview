"use client";

import Waveform from "../Waveform";
import { Volume } from "../Icons";
import m from "../../app/interview/interview.module.css";

/**
 * Question phase: coach speaks the question, then the user taps to answer.
 * Waveform animates only while the coach is speaking.
 */
export default function InterviewQuestionScreen({
  question,
  coachPhase,
  onAnswer,
  onReplay,
}) {
  const speaking = coachPhase === "speaking";
  const ready = coachPhase === "ready";

  return (
    <>
      <div className={m.bottomArea}>
        <div key={`q-${question.id}-${coachPhase}`} className={`${m.qcard} anim-fade-up`}>
          <span className={m.qcat}>{question.category}</span>
          <p className={m.qtext}>{question.text}</p>
          <div className={m.qfooter}>
            <Waveform
              bars={28}
              className={m.qwave}
              height={30}
              animated={speaking}
            />
            <button
              type="button"
              className={m.qvolume}
              aria-label="Replay question"
              onClick={onReplay}
              disabled={speaking}
            >
              <Volume size={18} />
            </button>
          </div>
        </div>

        <p className={`${m.phaseHint} ${speaking ? m.phaseHintActive : ""}`}>
          {speaking ? "Listen to the question…" : "Ready when you are"}
        </p>
      </div>

      <div className={m.bottomBar}>
        <button
          type="button"
          onClick={onAnswer}
          className={`${m.answerBtn} ${ready ? "" : m.answerBtnWaiting}`}
          disabled={!ready}
        >
          {ready ? "Tap to answer" : "Listen to the question…"}
        </button>
      </div>
    </>
  );
}
