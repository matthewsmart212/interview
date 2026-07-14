import Link from "next/link";
import { ChevronRight } from "../Icons";
import s from "./interview-card.module.css";

function cardDate(date) {
  return date.replace(/\s+\d{4}$/, "");
}

export default function InterviewCard({ interview: iv }) {
  const meta =
    iv.status === "past"
      ? iv.outcome ?? "Completed"
      : `In ${iv.daysAway} day${iv.daysAway === 1 ? "" : "s"}`;

  return (
    <Link href={`/interviews/${iv.id}`} className={s.card}>
      <span className={s.logo} style={{ background: `${iv.accent}33`, color: "#fff" }}>
        {iv.initials}
      </span>

      <span className={s.body}>
        <span className={s.role}>{iv.role}</span>
        <span className={s.meta}>
          {iv.company} · {iv.type} · {cardDate(iv.date)}
        </span>
        <span className={s.statusLine}>{meta}</span>
      </span>

      <ChevronRight size={17} className={s.chev} />
    </Link>
  );
}
