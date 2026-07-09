"use client";

import Waveform from "../Waveform";
import { Mic, Refresh } from "../Icons";
import m from "../../app/interview/interview.module.css";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Listening phase: live recording with timer, waveform and optional controls.
 */
export default function ListeningScreen({
  questionId,
  liveText,
  micError,
  recordSeconds,
  paused,
  onPause,
  onRestart,
  onFinish,
}) {
  return (
    <>
      <div className={m.bottomArea}>
        <div
          key={`listen-${questionId}`}
          className={`${m.qcard} ${m.darkCard} anim-fade-up`}
        >
          <div className={m.listeningRow}>
            <span className={`${m.micRing} ${paused ? m.micRingPaused : ""}`} aria-hidden>
              <Mic size={16} />
            </span>
            <div>
              <div className={m.listening}>
                {paused ? (
                  "Recording paused"
                ) : (
                  <>
                    <span className={m.recDot} aria-hidden />
                    Recording
                  </>
                )}
              </div>
              <div className={m.speak}>
                {paused ? "Tap resume to continue" : "Speak clearly — tap when finished"}
              </div>
            </div>
            <span className={m.recordTimer} aria-live="polite">
              {formatTime(recordSeconds)}
            </span>
          </div>

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
            <Waveform
              bars={28}
              className={m.qwave}
              height={30}
              animated={!paused && !micError}
            />
          </div>
        </div>
      </div>

      <div className={m.bottomBar}>
        <button type="button" onClick={onFinish} className={m.answerBtn} disabled={paused}>
          Tap when finished
        </button>
        <div className={m.secondaryRow}>
          <button type="button" className={m.ghostBtn} onClick={onPause}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button type="button" className={m.textBtn} onClick={onRestart}>
            <Refresh size={14} />
            Restart answer
          </button>
        </div>
      </div>
    </>
  );
}
