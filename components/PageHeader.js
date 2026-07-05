"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Sparkle,
  Home,
  Calendar,
  FileText,
  User,
  BarChart,
  Mic,
  MessageCircle,
  Upload,
  Edit,
  Plus,
} from "./Icons";

const ICONS = {
  home: Home,
  calendar: Calendar,
  fileText: FileText,
  user: User,
  barChart: BarChart,
  mic: Mic,
  messageCircle: MessageCircle,
  sparkle: Sparkle,
  upload: Upload,
  edit: Edit,
  plus: Plus,
};

export default function PageHeader({
  icon,
  title,
  description,
  subtitle,
  back = false,
  backHref,
  onBack,
  left,
  right,
}) {
  const router = useRouter();
  const desc = description ?? subtitle;
  const Icon = icon ? ICONS[icon] : null;

  const handleBack = () => {
    if (onBack) onBack();
    else if (backHref) router.push(backHref);
    else router.back();
  };

  const showBack = back || backHref || onBack;

  if (!Icon && !title && !desc && !left && !right && !showBack) return null;

  return (
    <div className="page-header">
      <span className="page-header-sparkle" aria-hidden>
        <Sparkle size={52} />
      </span>

      {left ??
        (showBack && (
          <button
            type="button"
            className="icon-btn page-header-back"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        ))}

      <div className="page-header-content">
        {Icon ? (
          <div className="page-header-icon">
            <Icon size={22} />
          </div>
        ) : null}
        {(title || desc) && (
          <div className="page-header-text">
            {title ? <h1 className="page-header-title">{title}</h1> : null}
            {desc ? <p className="page-header-sub">{desc}</p> : null}
          </div>
        )}
      </div>

      {right ? <div className="page-header-right">{right}</div> : null}
    </div>
  );
}
