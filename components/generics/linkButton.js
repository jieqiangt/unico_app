import Link from "next/link";
export default function LinkButton({ children, href, className }) {
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
