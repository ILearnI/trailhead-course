import Link from "next/link";
import CurrentPath from "./CurrentPath";
import TimeOnSite from "./TimeOnSite";

export default function SiteFooter() {
  return (
    <footer className="flex gap-6 border-t px-8 py-4 text-sm text-zinc-500">
      <span className="font-hand text-xl">Trailhead</span>
      <Link href="/privacy" prefetch={false}>Privacy</Link>
      <Link href="/terms" prefetch={false}>Terms</Link>
      <TimeOnSite />
      <CurrentPath />
    </footer>
  );
}
