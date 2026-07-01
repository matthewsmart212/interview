export function StatusBar({ dark }) {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span className="sb-icons" aria-hidden>
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </span>
    </div>
  );
}

export default function Phone({ dark = false, children }) {
  return (
    <div className={`phone${dark ? " dark" : ""}`}>
      <StatusBar dark={dark} />
      {children}
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="9" y="3" width="3" height="9" rx="1" />
      <rect x="13.5" y="0.5" width="3" height="11.5" rx="1" />
    </svg>
  );
}
function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 11.5l2.2-2.7a3.4 3.4 0 0 0-4.4 0L8 11.5z" />
      <path
        d="M3.2 6.3a7.4 7.4 0 0 1 9.6 0"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M1 3.6a10.8 10.8 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="12"
        rx="3"
        stroke="currentColor"
        opacity="0.5"
      />
      <rect x="2" y="2" width="17" height="9" rx="1.6" fill="currentColor" />
      <rect
        x="24"
        y="4"
        width="2"
        height="5"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
