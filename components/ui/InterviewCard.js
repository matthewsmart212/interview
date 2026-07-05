import Link from "next/link";
import { ChevronRight } from "../Icons";
import CircularProgress from "../CircularProgress";
import s from "./interview-card.module.css";

function cardDate(date) {
  return date.replace(/\s+\d{4}$/, "");
}

function topPills(iv) {
  if (iv.status === "past") {
    const label = iv.outcome ?? "Completed";
    const isOffer = /offer/i.test(label);
    return [{ label, cls: isOffer ? "ready" : "done" }];
  }

  const pills = [
    {
      label: `In ${iv.daysAway} days`,
      cls: iv.daysAway <= 7 ? "soon" : "upcoming",
    },
  ];

  if (iv.readiness >= 70) {
    pills.push({ label: "Ready", cls: "ready" });
  } else if (iv.readiness < 50) {
    pills.push({ label: "Needs prep", cls: "prep" });
  }

  return pills;
}

export default function InterviewCard({ interview: iv, featured = false }) {
  const pills = topPills(iv);
  const cardCls = [s.card, featured ? s.featured : ""].filter(Boolean).join(" ");

  return (
    <Link href={`/interviews/${iv.id}`} className={cardCls}>
      <div className={s.topPills} aria-label="Interview status">
        {pills.map((pill) => (
          <span key={pill.label} className={`status-pill ${pill.cls}`}>
            {pill.label}
          </span>
        ))}
      </div>

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
            color="var(--brand)"
            track="rgba(124, 92, 255, 0.22)"
          >
            <span className={s.ringPct}>{iv.readiness}%</span>
          </CircularProgress>
        )}
        <ChevronRight size={17} className={s.chev} />
      </span>
    </Link>
  );
}
