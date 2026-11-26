import Link from "next/link";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex flex-1 flex-col">
      <aside aria-label="Site notice" className="bg-emerald-700 px-8 py-2 text-white">
        Trailhead: plan your next trail
      </aside>
      <nav aria-label="Company" className="flex gap-4 border-b px-8 py-2 text-sm">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/faq">FAQ</Link>
      </nav>
      {children}
    </div>
  );
}
