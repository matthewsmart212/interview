import Image from "next/image";

const HEIGHT = {
  sm: 22,
  md: 28,
  lg: 36,
  hero: 52,
};

export default function Logo({ size = "md", className = "", priority = false }) {
  const h = HEIGHT[size] ?? HEIGHT.md;
  const w = Math.round((1020 / 276) * h);

  return (
    <Image
      src="/logo.png"
      alt="Interview Coach AI"
      width={w}
      height={h}
      className={`app-logo app-logo--${size}${className ? ` ${className}` : ""}`}
      priority={priority}
    />
  );
}
