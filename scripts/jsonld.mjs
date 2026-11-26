// Reads the JSON-LD of a page, like a crawler
const url = process.argv[2] ?? "http://localhost:3000/trails/alpine-lake";
const html = await (await fetch(url)).text();
const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
if (!match) {
  console.log("no structured data");
  process.exit(1);
}
console.log(JSON.stringify(JSON.parse(match[1]), null, 2));
