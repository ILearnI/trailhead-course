import Link from "next/link";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-1 flex-col">
      <aside aria-label="Site notice" className="bg-zinc-900 px-8 py-2 text-white">
        Trailhead app
      </aside>
      <nav aria-label="App sections" className="flex gap-4 border-b px-8 py-2 text-sm">
        <Link href="/trails">Trails</Link>
        <Link href="/guides/getting-started">Guides</Link>
        <Link href="/docs">Docs</Link>
      </nav>
      {children}
    </div>
  );
}
