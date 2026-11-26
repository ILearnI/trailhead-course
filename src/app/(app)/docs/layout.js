import Link from "next/link";

export default function DocsLayout({ children }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl">
      <aside className="w-48 border-r p-6">
        <ul className="space-y-2 text-sm">
          <li><Link href="/docs">Docs home</Link></li>
          <li><Link href="/docs/install">Install</Link></li>
          <li><Link href="/docs/config/env">Environment</Link></li>
        </ul>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
