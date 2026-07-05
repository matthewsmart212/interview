import Link from "next/link";

export default function PrimaryButton({
  children,
  className = "",
  href,
  ...props
}) {
  const cls = `btn btn-primary btn-pill${className ? ` ${className}` : ""}`;

  if (href) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}
