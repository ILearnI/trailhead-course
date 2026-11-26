import NavLink from "@/components/NavLink";
import Counter from "@/components/Counter";
import { trails } from "@/data/trails";

export default function TrailsLayout({ children, modal }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-8 pt-6">
      <nav aria-label="Trail lists" className="flex gap-4">
        <NavLink href="/trails" exact>All</NavLink>
        <NavLink href="/trails/popular">Popular</NavLink>
        <NavLink href="/trails/easy">Easy</NavLink>
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
