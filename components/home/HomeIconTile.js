import shared from "./home-shared.module.css";

export default function HomeIconTile({ icon: Icon, size = 18, className = "" }) {
  return (
    <span
      className={`${shared.iconTile}${className ? ` ${className}` : ""}`}
      aria-hidden
    >
      <Icon size={size} />
    </span>
  );
}

export { shared as homeSharedStyles };
