"use client";

import m from "../../app/interview/interview.module.css";

/** Brief bridge between finishing an answer and the transcript review screen. */
export default function ProcessingScreen() {
  return (
    <>
      <div className={m.bottomArea}>
        <div className={`${m.qcard} ${m.darkCard} ${m.processingCard} anim-fade-up`}>
          <div className={m.processSpinner} aria-hidden />
          <p className={m.processingTitle}>Reviewing your answer…</p>
          <p className={m.processingSub}>Checking what we heard</p>
        </div>
      </div>

      <div className={m.bottomBar}>
        <button type="button" className={`${m.answerBtn} ${m.answerBtnWaiting}`} disabled>
          Reviewing your answer…
        </button>
      </div>
    </>
  );
}
