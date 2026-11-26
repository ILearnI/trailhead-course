import Link from "next/link";
import { trails } from "../../src/data/trails";

export default function Home() {
  return (
    <main>
      <h1>Trailhead handbook</h1>
      <ul>
        {trails.map((trail) => (
          <li key={trail.slug}>
            <Link href={`/trails/${trail.slug}`}>{trail.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
