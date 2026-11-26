import { Suspense } from "react";
import Link from "next/link";
import NavLink from "@/components/NavLink";
import Counter from "@/components/Counter";
import { trails } from "@/data/trails";

// The lists of trails
const tabs = [
  { href: "/trails", label: "All", exact: true },
  { href: "/trails/popular", label: "Popular" },
  { href: "/trails/easy", label: "Easy" },
];

export default function TrailsLayout({ children, modal }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-8 pt-6">
      <nav aria-label="Trail lists" className="flex gap-4">
        {/* The active link needs the path */}
        <Suspense
          fallback={tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className="text-zinc-500">
              {tab.label}
            </Link>
          ))}
        >
          {tabs.map((tab) => (
            <NavLink key={tab.href} href={tab.href} exact={tab.exact}>
              {tab.label}
            </NavLink>
          ))}
        </Suspense>
      </nav>
      <aside aria-label="Trail summary">
        <p className="mt-2 text-sm text-zinc-500">{trails.length} trails</p>
        <Counter label="Layout" />
      </aside>
      {children}
      {modal}
    </section>
  );
}
