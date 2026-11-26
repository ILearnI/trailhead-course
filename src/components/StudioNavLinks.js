"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StudioNavLinks({ items }) {
  const pathname = usePathname();

  const isCurrent = (href) =>
    href === "/studio" ? pathname === href : pathname.startsWith(href);

  return (
    <nav aria-label="Studio" className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isCurrent(item.href) ? "page" : undefined}
          className="rounded px-2 py-1 aria-[current=page]:bg-zinc-200"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
