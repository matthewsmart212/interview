import StatPill from "./StatPill";
import s from "./stat-pill-row.module.css";

export default function StatPillRow({ children }) {
  return <div className={s.row}>{children}</div>;
}

export { StatPill };
