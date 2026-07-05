import Link from "next/link";
import { ChevronRight } from "../Icons";

export default function ActionRow({
  href,
  icon: Icon,
  title,
  subtitle,
  onClick,
  iconSize = 22,
  className = "",
}) {
  const inner = (
    <>
      <span className="ar-icon" aria-hidden>
        <Icon size={iconSize} />
      </span>
      <span className="ar-body">
        <span className="ar-title">{title}</span>
        {subtitle ? <span className="ar-sub">{subtitle}</span> : null}
      </span>
      <ChevronRight size={20} className="chev" aria-hidden />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`action-row${className ? ` ${className}` : ""}`}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`action-row${className ? ` ${className}` : ""}`}
      onClick={onClick}
      style={{ border: "none", textAlign: "left", width: "100%" }}
    >
      {inner}
    </button>
  );
}
