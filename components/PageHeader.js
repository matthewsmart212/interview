"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "./Icons";

export default function PageHeader({
  title,
  subtitle,
  back = false,
  backHref,
  onBack,
  left,
  right,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else if (backHref) router.push(backHref);
    else router.back();
  };

  const showBack = back || backHref || onBack;

  if (!title && !subtitle && !left && !right && !showBack) return null;

  return (
    <div className="page-header">
      <div className="page-header-left">
        {left ??
          (showBack && (
            <button
              type="button"
              className="icon-btn"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ChevronLeft size={24} />
            </button>
          ))}
        {(title || subtitle) && (
          <div className="page-header-text">
            {title ? <h1 className="page-header-title">{title}</h1> : null}
            {subtitle ? <p className="page-header-sub">{subtitle}</p> : null}
          </div>
        )}
      </div>
      {right ? <div className="page-header-right">{right}</div> : null}
    </div>
  );
}
