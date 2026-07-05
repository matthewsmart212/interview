import Link from "next/link";
import { ChevronRight } from "../Icons";
import CircularProgress from "../CircularProgress";
import s from "./interview-card.module.css";

function cardDate(date) {
  return date.replace(/\s+\d{4}$/, "");
}

function topPill(iv) {
  if (iv.status === "past") {
    return { label: iv.outcome ?? "Completed", cls: "done" };
  }
  if (iv.daysAway <= 7) {
    return { label: `In ${iv.daysAway} days`, cls: "soon" };
  }
  if (iv.readiness >= 70) return { label: "Ready", cls: "ready" };
  if (iv.readiness < 50) return { label: "Needs prep", cls: "prep" };
  return { label: `In ${iv.daysAway} days`, cls: "upcoming" };
}

export default function InterviewCard({ interview: iv, featured = false }) {
  const pill = topPill(iv);
  const cardCls = [s.card, featured ? s.featured : ""].filter(Boolean).join(" ");

  return (
    <Link href={`/interviews/${iv.id}`} className={cardCls}>
      <span className={`status-pill ${s.topPill} ${s[pill.cls]}`}>
        {pill.label}
      </span>

      <span className={s.logo}>{iv.initials}</span>

      <span className={s.body}>
        <span className={s.role}>{iv.role}</span>
        <span className={s.meta}>
          {iv.company} · {iv.type} · {cardDate(iv.date)}
        </span>
      </span>

      <span className={s.side}>
        {iv.status === "upcoming" && (
          <CircularProgress
            value={iv.readiness}
            size={42}
            stroke={4}
            color={featured ? "#fff" : "var(--brand)"}
            track={featured ? "rgba(255,255,255,0.22)" : "rgba(124, 92, 255, 0.18)"}
          >
            <span className={s.ringPct}>{iv.readiness}%</span>
          </CircularProgress>
        )}
        <ChevronRight size={17} className={s.chev} />
      </span>
    </Link>
  );
}
