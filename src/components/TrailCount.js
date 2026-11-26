import { trails } from "@/data/trails";

export default function TrailCount() {
  return <span className="hidden text-sm text-zinc-500 sm:inline">{`${trails.length} trails`}</span>;
}
