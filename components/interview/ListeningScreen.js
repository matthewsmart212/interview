"use client";

import Waveform from "../Waveform";
import m from "../../app/interview/interview.module.css";

/**
 * Listening phase: dark glass card with live dot, waveform, and (when
 * available) a live transcript preview. `micError` explains fallback modes.
 */
export default function ListeningScreen({
  questionId,
  liveText,
  micError,
  onFinish,
}) {
  return (
    <>
      <div className={m.bottomArea}>
        <div
          key={`listen-${questionId}`}
          className={`${m.qcard} ${m.darkCard} anim-fade-up`}
        >
          <div className={m.listening}>
            <span className={m.recDot} aria-hidden />
            Listening...
          </div>
          <div className={m.speak}>Speak clearly</div>

          {liveText ? (
            <p className={m.liveLine} aria-live="polite">
              “{liveText}”
            </p>
          ) : null}

          {micError ? (
            <p className={m.micNote}>
              {micError === "permission"
                ? "Microphone access was blocked — you can type your answer on the next screen."
                : micError === "unsupported"
                ? "Voice input isn't supported in this browser — you can type your answer on the next screen."
                : "We're having trouble hearing you — you can type your answer on the next screen."}
            </p>
          ) : null}

          <div className={m.qfooter}>
            <Waveform bars={28} className={m.qwave} height={30} animated={!micError} />
          </div>
        </div>
      </div>

      <div className={m.bottomBar}>
        <button onClick={onFinish} className={m.answerBtn}>
          Finish Answer
        </button>
      </div>
    </>
  );
}
