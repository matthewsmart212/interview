function Svg({ size = 24, children, stroke = 2, fill = "none", ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ChevronLeft = (p) => (
  <Svg {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);
export const ChevronRight = (p) => (
  <Svg {...p}>
    <path d="M9 18l6-6-6-6" />
  </Svg>
);
export const ChevronDown = (p) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
export const Menu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const Check = (p) => (
  <Svg {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);
export const Calendar = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
);
export const Sparkle = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12 2l1.6 4.6L18 8.2l-4.4 1.6L12 14l-1.6-4.2L6 8.2l4.4-1.6L12 2z" />
    <path d="M19 13l.8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13z" />
  </Svg>
);
export const FileText = (p) => (
  <Svg {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </Svg>
);
export const Mic = (p) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </Svg>
);
export const MessageCircle = (p) => (
  <Svg {...p}>
    <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" />
  </Svg>
);
export const BarChart = (p) => (
  <Svg {...p}>
    <path d="M7 20V10M12 20V4M17 20v-6" />
  </Svg>
);
export const User = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </Svg>
);
export const Home = (p) => (
  <Svg {...p}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </Svg>
);
export const Bookmark = ({ filled, ...p }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
  </Svg>
);
export const Volume = (p) => (
  <Svg {...p}>
    <path d="M4 9v6h4l5 4V5L8 9H4z" />
    <path d="M16 8.5a4 4 0 0 1 0 7M18.5 6a7 7 0 0 1 0 12" />
  </Svg>
);
export const Play = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M8 5v14l11-7z" />
  </Svg>
);
export const Download = (p) => (
  <Svg {...p}>
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
  </Svg>
);
export const Upload = (p) => (
  <Svg {...p}>
    <path d="M12 15V3m0 0L8 7m4-4l4 4M4 21h16" />
  </Svg>
);
export const AlertCircle = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M12 7v6" stroke="#fff" strokeWidth="2" />
    <circle cx="12" cy="16.5" r="1.1" fill="#fff" stroke="none" />
  </Svg>
);
export const CheckCircle = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" fill="none" />
  </Svg>
);
export const Clock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
export const Lightbulb = (p) => (
  <Svg {...p}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a6 6 0 0 0-3 11v1h6v-1a6 6 0 0 0-3-11z" />
  </Svg>
);
export const Target = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" />
  </Svg>
);
export const Trophy = (p) => (
  <Svg {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
    <path d="M7 6H4v1a4 4 0 0 0 4 4M17 6h3v1a4 4 0 0 1-4 4M9 20h6M10 20v-3M14 20v-3" />
  </Svg>
);
export const Star = ({ filled, ...p }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 17.8 6.6 19.6l1.2-6L3.3 9.4l6.1-.8L12 3z" />
  </Svg>
);
export const Settings = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-1.7-1L15 3H9l-.4 2.6a7.6 7.6 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11a7.9 7.9 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 1.7 1L9 21h6l.4-2.6a7.6 7.6 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5z" />
  </Svg>
);
export const Bell = (p) => (
  <Svg {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
  </Svg>
);
export const LogOut = (p) => (
  <Svg {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </Svg>
);
export const HelpCircle = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </Svg>
);
export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const Edit = (p) => (
  <Svg {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </Svg>
);
export const Refresh = (p) => (
  <Svg {...p}>
    <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v5h-5" />
  </Svg>
);
export const CreditCard = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M3 10h18" />
  </Svg>
);
export const Shield = (p) => (
  <Svg {...p}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
  </Svg>
);
