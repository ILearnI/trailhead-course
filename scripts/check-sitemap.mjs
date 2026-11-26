// Every url of the sitemap must be a real page
const base = process.env.BASE_URL ?? "http://localhost:3000";
const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);

let hidden = 0;
for (const path of paths) {
  const html = await (await fetch(`${base}${path}`)).text();
  // Next.js adds noindex to a missing page
  const bad = html.includes('content="noindex"');
  console.log(bad ? "NOINDEX" : "ok     ", path);
  if (bad) hidden += 1;
}
process.exit(hidden ? 1 : 0);
