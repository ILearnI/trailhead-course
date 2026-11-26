import Link from "next/link";

export default function Breadcrumbs({ slug }) {
  const crumbs = slug.map((part, i) => ({
    label: part,
    href: "/guides/" + slug.slice(0, i + 1).join("/"),
  }));

  return (
    <nav className="text-sm text-zinc-500">
      <Link href="/guides/getting-started">Guides</Link>
      {crumbs.map((c) => (
        <span key={c.href}>
          {" / "}
          <Link href={c.href} className="underline">
            {c.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
