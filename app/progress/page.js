"use client";

import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import { AppShell, PageSection, ProgressCard } from "../../components/ui";
import { Mic, Target, Trophy, Clock, ChevronRight } from "../../components/Icons";
import { useAppDb } from "../../lib/db/use-app-db";
import styles from "./progress.module.css";

const STATS = [
  { Icon: Mic, num: "12", lab: "Interviews Completed" },
  { Icon: Target, num: "79%", lab: "Avg. Score" },
  { Icon: Trophy, num: "92%", lab: "Best Score" },
  { Icon: Clock, num: "6.5", lab: "Hours Practiced" },
];

const SKILLS = [
  { name: "Communication", value: 85 },
  { name: "Confidence", value: 78 },
  { name: "Problem Solving", value: 72 },
  { name: "Clarity", value: 80 },
  { name: "Structure (STAR)", value: 75 },
];

const SERIES = [55, 63, 60, 72, 70, 79];
const XLABELS = ["1 May", "8 May", "15 May", "Today"];

function ScoreChart() {
  const W = 320;
  const H = 150;
  const padL = 8;
  const padR = 8;
  const padT = 12;
  const padB = 10;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const pts = SERIES.map((v, i) => {
    const x = padL + (i / (SERIES.length - 1)) * plotW;
    const y = padT + (1 - v / 100) * plotH;
    return [x, y];
  });

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${padL + plotW} ${padT + plotH} L ${padL} ${
    padT + plotH
  } Z`;
  const last = pts[pts.length - 1];
  const grid = [0, 25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg}>
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b3a0fb" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b3a0fb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g) => {
        const y = padT + (1 - g / 100) * plotH;
        return (
          <line
            key={g}
            x1={padL}
            y1={y}
            x2={padL + plotW}
            y2={y}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        );
      })}
      <path d={area} fill="url(#area)" />
      <path
        d={line}
        fill="none"
        stroke="#b3a0fb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#b3a0fb" />
      ))}
      <circle
        cx={last[0]}
        cy={last[1]}
        r="5.5"
        fill="#fff"
        stroke="#b3a0fb"
        strokeWidth="3"
      />
    </svg>
  );
}

export default function ProgressPage() {
  const { MOCK_HISTORY } = useAppDb();
  const recent = MOCK_HISTORY.slice(0, 3);

  return (
    <AppShell navActive="progress">
      <PageHeader
        icon="barChart"
        title="Your Progress"
        description="Stats, skills and mock history"
      />

      <PageSection title="Your stats">
        <div className="stats-grid">
          {STATS.map(({ Icon, num, lab }) => (
            <div className="stat" key={lab}>
              <span className="s-ico">
                <Icon size={18} />
              </span>
              <div className="s-num">{num}</div>
              <div className="s-lab">{lab}</div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <ProgressCard title="Score over time" badge="79%">
          <div className={styles.chartWrap}>
            <ScoreChart />
            <div className={styles.xlabels}>
              {XLABELS.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </ProgressCard>
      </PageSection>

      <PageSection title="Top skills">
        <div className="card">
          {SKILLS.map((sk) => (
            <div className={styles.skillRow} key={sk.name}>
              <div className={styles.skillTop}>
                <span>{sk.name}</span>
                <span className="v">{sk.value}%</span>
              </div>
              <div className="meter">
                <i style={{ width: `${sk.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="Recent mock interviews"
        action={
          <Link href="/history" className="link-btn">
            See all
          </Link>
        }
      >
        <div className="card">
          {recent.map((mk) => (
            <Link href={`/history/${mk.id}`} className={styles.histRow} key={mk.id}>
              <span
                className={`${styles.histScore}${
                  mk.score >= 80 ? " " + styles.good : mk.score < 65 ? " " + styles.low : ""
                }`}
              >
                {mk.score}
              </span>
              <span className={styles.histBody}>
                <span className={styles.histTitle}>
                  {mk.role} · {mk.company}
                </span>
                <span className={styles.histSub}>
                  {mk.date} · {mk.questions} questions
                </span>
              </span>
              <ChevronRight size={17} className="chev" />
            </Link>
          ))}
        </div>
      </PageSection>
    </AppShell>
  );
}
