/**
 * Seed / demo fixtures for the front-end.
 * Runtime reads should go through `lib/db` (useAppDb) so user changes persist.
 * These exports remain as the initial seed source and SSR fallback.
 */

export const USER = { name: "Alex", streak: 7 };

/* ---------------- master CV ---------------- */

export const MASTER_CV = {
  exists: true,
  fileName: "Alex-Morgan-CV.pdf",
  updatedAt: "12 May 2026",
  score: 78,
  summary:
    "Friendly and reliable customer service professional with 3+ years of retail experience, skilled at resolving problems calmly and keeping customers happy.",
  sections: {
    experience: [
      {
        role: "Sales Assistant",
        company: "H&M",
        period: "2023 — Present",
        points: [
          "Serve 100+ customers per shift on tills and the shop floor",
          "Resolved refund and exchange issues, keeping complaints below 1%",
        ],
      },
      {
        role: "Team Member",
        company: "Greggs",
        period: "2021 — 2023",
        points: [
          "Prepared food and served customers during busy lunch rushes",
          "Trained 4 new starters on tills and food safety",
        ],
      },
    ],
    education: [
      {
        title: "GCSEs — 7 subjects incl. English & Maths",
        place: "Park View School",
        period: "2015 — 2021",
      },
    ],
    skills: [
      "Customer service",
      "Working under pressure",
      "Communication",
      "Teamwork",
      "Cash handling",
      "Problem solving",
    ],
  },
};

/* ---------------- CV upload history ---------------- */

export const CV_HISTORY = [
  {
    id: "cv-current",
    fileName: "Alex-Morgan-CV.pdf",
    uploadedAt: "12 May 2026",
    score: 78,
    current: true,
  },
  {
    id: "cv-may",
    fileName: "Alex-Morgan-CV-May.pdf",
    uploadedAt: "3 May 2026",
    score: 71,
  },
  {
    id: "cv-april",
    fileName: "Alex-Morgan-CV-April.pdf",
    uploadedAt: "18 Apr 2026",
    score: 68,
  },
  {
    id: "cv-retail",
    fileName: "Alex-CV-Retail.pdf",
    uploadedAt: "2 Mar 2026",
    score: 62,
  },
];

/* ---------------- interviews ---------------- */

export const INTERVIEWS = [
  {
    id: "tesco-csa",
    role: "Customer Service Advisor",
    company: "Tesco",
    initials: "T",
    accent: "#2e6ce6",
    type: "In-person",
    date: "24 May 2026",
    dateChip: { d: "24", m: "MAY" },
    daysAway: 6,
    status: "upcoming",
    readiness: 72,
    hasJD: true,
    jd: "We're looking for a friendly and reliable Customer Service Advisor to join our Tesco Extra team. You'll be the first point of contact for customers — answering questions, resolving problems and making every shopping trip a great experience.\n\nWhat you'll do:\n• Help customers with queries, refunds and product questions\n• Keep service areas tidy and queues moving\n• Work closely with your team during busy periods\n• Follow safety and legal policies at all times\n\nWhat we're looking for:\n• A warm, helpful attitude\n• Calm under pressure\n• Great communication skills\n• Flexibility to work evenings and weekends",
    jdHighlights: [
      "Customer-facing role — answering questions & resolving problems",
      "Calm under pressure is called out directly",
      "Teamwork during busy periods",
      "Evenings & weekend flexibility",
    ],
    tailoredCv: {
      exists: true,
      score: 86,
      updatedAt: "18 May 2026",
      changes: [
        "Summary rewritten to mirror Tesco's 'friendly and reliable' wording",
        "H&M refunds experience moved to the top bullet",
        "Added 'calm under pressure' to skills with a till-rush example",
        "Removed food-prep details not relevant to this role",
      ],
    },
    mockIds: ["mock-3", "mock-2"],
  },
  {
    id: "costa-barista",
    role: "Barista",
    company: "Costa Coffee",
    initials: "C",
    accent: "#8c2f3f",
    type: "In-person",
    date: "2 Jun 2026",
    dateChip: { d: "02", m: "JUN" },
    daysAway: 15,
    status: "upcoming",
    readiness: 34,
    hasJD: false,
    jd: null,
    jdHighlights: [],
    tailoredCv: { exists: false },
    mockIds: ["mock-4"],
  },
  {
    id: "zara-retail",
    role: "Retail Assistant",
    company: "Zara",
    initials: "Z",
    accent: "#1f1f24",
    type: "Video",
    date: "28 Apr 2026",
    dateChip: { d: "28", m: "APR" },
    daysAway: -20,
    status: "past",
    outcome: "Offer received 🎉",
    readiness: 90,
    hasJD: true,
    jd: "Zara is looking for a Retail Assistant to deliver outstanding service on the shop floor...",
    jdHighlights: [
      "Fast-paced shop floor service",
      "Visual merchandising standards",
    ],
    tailoredCv: {
      exists: true,
      score: 84,
      updatedAt: "20 Apr 2026",
      changes: [
        "Fashion retail experience emphasised",
        "Added visual merchandising to skills",
      ],
    },
    mockIds: ["mock-1"],
  },
];

export function getInterview(id) {
  return INTERVIEWS.find((i) => i.id === id) ?? null;
}

/* ---------------- mock interview history ---------------- */

export const MOCK_HISTORY = [
  {
    id: "mock-4",
    interviewId: "costa-barista",
    role: "Barista",
    company: "Costa Coffee",
    date: "19 May 2026",
    time: "18:40",
    score: 61,
    headline: "Solid effort!",
    questions: 5,
    durationMin: 9,
    best: "Teamwork example",
    weakest: "Why Costa?",
    skills: [
      { name: "Relevance", value: 64 },
      { name: "STAR structure", value: 52 },
      { name: "Clarity", value: 70 },
    ],
  },
  {
    id: "mock-3",
    interviewId: "tesco-csa",
    role: "Customer Service Advisor",
    company: "Tesco",
    date: "18 May 2026",
    time: "20:15",
    score: 83,
    headline: "Great job!",
    questions: 5,
    durationMin: 11,
    best: "Difficult customer story",
    weakest: "Prioritising tasks",
    skills: [
      { name: "Relevance", value: 86 },
      { name: "STAR structure", value: 78 },
      { name: "Clarity", value: 88 },
    ],
  },
  {
    id: "mock-2",
    interviewId: "tesco-csa",
    role: "Customer Service Advisor",
    company: "Tesco",
    date: "15 May 2026",
    time: "19:02",
    score: 71,
    headline: "Nice work!",
    questions: 5,
    durationMin: 12,
    best: "Working under pressure",
    weakest: "Show measurable impact",
    skills: [
      { name: "Relevance", value: 74 },
      { name: "STAR structure", value: 63 },
      { name: "Clarity", value: 79 },
    ],
  },
  {
    id: "mock-1",
    interviewId: "zara-retail",
    role: "Retail Assistant",
    company: "Zara",
    date: "25 Apr 2026",
    time: "17:30",
    score: 88,
    headline: "Outstanding!",
    questions: 5,
    durationMin: 10,
    best: "Team delivery story",
    weakest: "Salary expectations",
    skills: [
      { name: "Relevance", value: 90 },
      { name: "STAR structure", value: 85 },
      { name: "Clarity", value: 89 },
    ],
  },
];

export function getMock(id) {
  return MOCK_HISTORY.find((h) => h.id === id) ?? null;
}

export function mocksForInterview(interviewId) {
  return MOCK_HISTORY.filter((h) => h.interviewId === interviewId);
}
