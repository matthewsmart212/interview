import Link from "next/link";
import { ChevronRight } from "../Icons";
import ReadinessRing from "../ReadinessRing";
import { calculateInterviewReadiness } from "../../lib/readiness";
import s from "./interview-card.module.css";

function cardDate(date) {
  return String(date || "").replace(/\s+\d{4}$/, "");
}

export default function InterviewCard({ interview: iv, featured = false }) {
  const readiness = calculateInterviewReadiness(iv);
  const countdown =
    iv.status === "past"
      ? iv.outcome ?? "Completed"
      : iv.daysAway === 0
        ? "Today"
        : iv.daysAway === 1
          ? "Tomorrow"
          : `${iv.daysAway} days`;

  const pillCls =
    iv.status === "past"
      ? s.pillDone
      : readiness >= 70
        ? s.pillReady
        : iv.daysAway <= 3
          ? s.pillSoon
          : s.pillUpcoming;

  return (
    <Link
      href={`/interviews/${iv.id}`}
      className={`${s.card}${featured ? ` ${s.featured}` : ""}`}
    >
      <span
        className={s.logo}
        style={{ background: `${iv.accent}33`, color: "#fff" }}
      >
        {iv.initials}
      </span>

      <span className={s.body}>
        <span className={s.role}>{iv.role}</span>
        <span className={s.meta}>
          {iv.company}
          {iv.type ? ` · ${iv.type}` : ""}
          {iv.date ? ` · ${cardDate(iv.date)}` : ""}
        </span>
        <span className={`${s.pill} ${pillCls}`}>{countdown}</span>
      </span>

      {iv.status !== "past" ? (
        <ReadinessRing value={readiness} size={42} stroke={5} />
      ) : null}

      <ChevronRight size={17} className={s.chev} aria-hidden />
    </Link>
  );
}
