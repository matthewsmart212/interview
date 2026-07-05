"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "./Icons";

/** Immersive mock-interview top bar only (purple overlay). */
export default function TopBar({
  title,
  back = true,
  backHref,
  right,
  left,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <div className="topbar overlay-bar">
      <div className="tb-side">
        {left
          ? left
          : back && (
              <button
                className="icon-btn"
                onClick={handleBack}
                aria-label="Go back"
              >
                <ChevronLeft size={24} />
              </button>
            )}
      </div>
      <div className="tb-title">{title}</div>
      <div className="tb-side right">{right}</div>
    </div>
  );
}
