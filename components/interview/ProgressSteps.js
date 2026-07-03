import m from "../../app/interview/interview.module.css";

/** Question counter badge + segmented progress track shown at the top of the stage. */
export default function ProgressSteps({ index, total, fillCurrent = false }) {
  return (
    <div className={m.progressWrap}>
      <span className={m.qbadge}>
        Question {index + 1} of {total}
      </span>
      <div className={m.progressTrack} aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <i
            key={i}
            className={`${m.progressSeg}${
              i < index || (i === index && fillCurrent) ? " " + m.segDone : ""
            }${i === index ? " " + m.segActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
