import Link from "next/link";
import { ChevronRight } from "../Icons";
import CircularProgress from "../CircularProgress";
import s from "./tailored-cv-card.module.css";

export default function TailoredCVCard({ interview: iv }) {
  const improved = iv.tailoredCv.score > 0;

  return (
    <Link href={`/interviews/${iv.id}/cv`} className={s.card}>
      <span className={s.logo}>{iv.initials}</span>

      <span className={s.body}>
        <span className={s.role}>{iv.role}</span>
        <span className={s.meta}>
          {iv.company} · Updated {iv.tailoredCv.updatedAt}
        </span>
        <span className={s.pills}>
          <span className="status-pill upcoming">Tailored</span>
          {improved ? (
            <span className="status-pill ready">{iv.tailoredCv.score}% match</span>
          ) : null}
        </span>
      </span>

      <span className={s.side}>
        <CircularProgress
          value={iv.tailoredCv.score}
          size={42}
          stroke={4}
          color="var(--brand)"
          track="rgba(124, 92, 255, 0.22)"
        >
          <span className={s.ringPct}>{iv.tailoredCv.score}%</span>
        </CircularProgress>
        <ChevronRight size={17} className={s.chev} />
      </span>
    </Link>
  );
}
