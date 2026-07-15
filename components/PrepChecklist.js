"use client";

import Link from "next/link";
import {
  Check,
  ChevronRight,
  FileText,
  MessageCircle,
  Star,
  Target,
  Mic,
  BarChart,
} from "./Icons";
import styles from "./prep-checklist.module.css";

const ICONS = {
  file: FileText,
  message: MessageCircle,
  star: Star,
  target: Target,
  mic: Mic,
  chart: BarChart,
};

function PrepChecklistItem({ item, onAction }) {
  const Icon = ICONS[item.icon] || FileText;

  const handleClick = (e) => {
    if (item.toggle || item.markComplete) {
      e.preventDefault();
      onAction?.(item);
    }
  };

  const cta = item.href && !item.toggle ? (
    <Link
      href={item.href}
      className={styles.cta}
      onClick={() => {
        if (item.markComplete) onAction?.(item);
      }}
    >
      {item.cta}
    </Link>
  ) : (
    <button type="button" className={styles.cta} onClick={handleClick}>
      {item.cta}
    </button>
  );

  return (
    <div className={`${styles.row}${item.done ? ` ${styles.done}` : ""}`}>
      <span className={`${styles.check}${item.done ? "" : ` ${styles.todo}`}`} aria-hidden>
        {item.done ? <Check size={14} stroke={3} /> : <Icon size={14} />}
      </span>
      <span className={styles.body}>
        <span className={styles.title}>{item.title}</span>
        <span className={styles.sub}>{item.sub}</span>
      </span>
      {cta}
    </div>
  );
}

export default function PrepChecklist({ items, onAction, title = "Your preparation plan" }) {
  const doneCount = items.filter((i) => i.done).length;

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={styles.heading}>{title}</p>
        <span className={styles.count}>
          {doneCount}/{items.length}
        </span>
      </div>
      <div className={styles.card}>
        {items.map((item) => (
          <PrepChecklistItem key={item.id} item={item} onAction={onAction} />
        ))}
      </div>
    </section>
  );
}

export { PrepChecklistItem };
