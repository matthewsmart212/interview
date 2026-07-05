import Link from "next/link";
import {
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Trophy,
} from "../Icons";
import CircularProgress from "../CircularProgress";
import s from "./interview-card.module.css";

function cardDate(date) {
  return date.replace(/\s+\d{4}$/, "");
}

function topPills(iv) {
  if (iv.status === "past") {
    const label = iv.outcome ?? "Completed";
    const isOffer = /offer/i.test(label);
    return [
      {
        label,
        tone: isOffer ? "celebrate" : "success",
        icon: isOffer ? Trophy : CheckCircle,
      },
    ];
  }

  const pills = [
    {
      label: `In ${iv.daysAway} days`,
      tone: iv.daysAway <= 7 ? "urgent" : "timeline",
      icon: Clock,
    },
  ];

  if (iv.readiness >= 70) {
    pills.push({ label: "Ready", tone: "success", icon: CheckCircle });
  } else if (iv.readiness < 50) {
    pills.push({ label: "Needs prep", tone: "warn", icon: AlertCircle });
  }

  return pills;
}

export default function InterviewCard({ interview: iv, featured = false }) {
  const pills = topPills(iv);
  const cardCls = [s.card, featured ? s.featured : ""].filter(Boolean).join(" ");

  return (
    <Link href={`/interviews/${iv.id}`} className={cardCls}>
      <div className={s.pillRail} aria-label="Interview status">
        {pills.map((pill) => {
          const Icon = pill.icon;
          return (
            <span
              key={pill.label}
              className={`${s.pill} ${s[pill.tone]}`}
            >
              <Icon size={11} stroke={2.2} className={s.pillIcon} />
              {pill.label}
            </span>
          );
        })}
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
