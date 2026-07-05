import Image from "next/image";

const HEIGHT = {
  sm: 22,
  md: 28,
  lg: 36,
  hero: 52,
};

const ASPECT = 2008 / 523;
/* Icon bubble ends ~x605; wordmark (Getthejob) begins immediately after */
const ICON_FRAC = 605 / 2008;
const TEXT_SCALE = 1.3;

export default function Logo({ size = "md", className = "", priority = false }) {
  const h = HEIGHT[size] ?? HEIGHT.md;
  const fullW = ASPECT * h;
  const iconW = fullW * ICON_FRAC;
  const textW = fullW * (1 - ICON_FRAC) * TEXT_SCALE;
  const wrapW = iconW + textW;

  const style = {
    "--logo-h": `${h}px`,
    "--logo-full-w": `${fullW}px`,
    "--logo-icon-w": `${iconW}px`,
    "--logo-text-scale": `${TEXT_SCALE}`,
    height: `${h}px`,
    width: `${wrapW}px`,
  };

  const imgW = Math.round(fullW);
  const imgH = h;

  return (
    <span
      className={`app-logo app-logo--${size}${className ? ` ${className}` : ""}`}
      style={style}
      role="img"
      aria-label="Interview Coach AI"
    >
      <span className="app-logo-scaled" aria-hidden>
        <Image
          src="/logo.png"
          alt=""
          width={imgW}
          height={imgH}
          className="app-logo-img app-logo-img--scaled"
        />
      </span>
      <span className="app-logo-icon" aria-hidden>
        <Image
          src="/logo.png"
          alt=""
          width={imgW}
          height={imgH}
          priority={priority}
          className="app-logo-img"
        />
      </span>
    </span>
  );
}
