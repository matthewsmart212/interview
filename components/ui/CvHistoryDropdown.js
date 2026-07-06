import { ChevronDown, FileText } from "../Icons";
import s from "./cv-history-dropdown.module.css";

export default function CvHistoryDropdown({ items }) {
  return (
    <details className={s.drop}>
      <summary className={s.summary}>
        <span className={s.summaryLeft}>
          <FileText size={16} />
          <span>Previous CVs</span>
        </span>
        <span className={s.summaryRight}>
          <span className={s.count}>{items.length}</span>
          <ChevronDown size={18} className={s.chevron} aria-hidden />
        </span>
      </summary>

      <ul className={s.list}>
        {items.map((cv) => (
          <li key={cv.id} className={s.item}>
            <span className={s.itemBody}>
              <span className={s.fileName}>{cv.fileName}</span>
              <span className={s.meta}>
                Uploaded {cv.uploadedAt}
                {cv.current ? " · Current" : ""}
              </span>
            </span>
            <span className={s.score}>{cv.score}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
