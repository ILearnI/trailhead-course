"use client";

import Link from "next/link";
import LinkPending from "./LinkPending";
import { usePathname } from "next/navigation";

export default function NavLink({ href, exact, children }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && !exact && pathname.startsWith(href));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={active ? "text-emerald-700 underline" : "text-zinc-500"}
    >
      {children}
      <LinkPending />
    </Link>
  );
}
