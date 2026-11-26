import { burn } from "@/lib/burn";

// Every row is expensive to render
export default function SlowList({ count }) {
  const rows = [];
  for (let i = 1; i <= count; i++) {
    burn(1);
    rows.push(<li key={i}>Trail marker {i}</li>);
  }
  return <ul className="mt-4 columns-2">{rows}</ul>;
}
