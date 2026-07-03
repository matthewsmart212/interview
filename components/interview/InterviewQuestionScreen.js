"use client";

import Waveform from "../Waveform";
import { Volume } from "../Icons";
import m from "../../app/interview/interview.module.css";

/** Question phase: white question card + "Tap to answer" CTA. */
export default function InterviewQuestionScreen({ question, onAnswer }) {
  return (
    <>
      <div className={m.bottomArea}>
        <div key={`q-${question.id}`} className={`${m.qcard} anim-fade-up`}>
          <span className={m.qcat}>{question.category}</span>
          <p className={m.qtext}>{question.text}</p>
          <div className={m.qfooter}>
            <Waveform bars={28} className={m.qwave} height={30} />
            <button className={m.qvolume} aria-label="Replay question audio">
              <Volume size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className={m.bottomBar}>
        <button onClick={onAnswer} className={m.answerBtn}>
          Tap to answer
        </button>
      </div>
    </>
  );
}
