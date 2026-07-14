import Link from "next/link";
import { ChevronRight } from "../Icons";
import ReadinessRing from "../ReadinessRing";
import { calculateInterviewReadiness } from "../../lib/readiness";
import s from "./interview-card.module.css";

function cardDate(date) {
  return String(date || "").replace(/\s+\d{4}$/, "");
}

export default function InterviewCard({
  interview: iv,
  featured = false,
  quiet = false,
}) {
  const readiness = calculateInterviewReadiness(iv);
  const isPast = iv.status === "past" || quiet;

  const countdown =
    iv.daysAway === 0
      ? "Today"
      : iv.daysAway === 1
        ? "Tomorrow"
        : `${iv.daysAway} days`;

  const pillCls =
    readiness >= 70
      ? s.pillReady
      : iv.daysAway <= 3
        ? s.pillSoon
        : s.pillUpcoming;

  return (
    <Link
      href={`/interviews/${iv.id}`}
      className={[
        s.card,
        featured ? s.featured : "",
        isPast ? s.past : "",
      ]
        .filter(Boolean)
        .join(" ")}
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
        {isPast ? (
          <span className={s.statusLabel}>{iv.outcome || "Completed"}</span>
        ) : (
          <span className={`${s.pill} ${pillCls}`}>{countdown}</span>
        )}
      </span>

      {!isPast ? (
        <ReadinessRing value={readiness} size={40} stroke={5} />
      ) : null}

      <ChevronRight size={16} className={s.chev} aria-hidden />
    </Link>
  );
}
