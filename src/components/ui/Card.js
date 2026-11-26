import { cn } from "@/lib/cn";

// A box with a border, for any content
export default function Card({ title, className, children }) {
  return (
    <section className={cn("rounded-xl border bg-surface p-4", className)}>
      {title && <h3 className="mb-2 font-semibold">{title}</h3>}
      {children}
    </section>
  );
}
