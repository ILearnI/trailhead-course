// Needs a running server: the cache must work
const base = process.env.BASE_URL ?? "http://localhost:3000";

// How often the price function really ran
async function runs() {
  const body = await (await fetch(`${base}/cache-lab/calls`)).json();
  return body.price ?? 0;
}

const before = await runs();
for (let i = 0; i < 5; i += 1) await fetch(`${base}/cache-lab/price`);
const ran = (await runs()) - before;

console.log(`price ran ${ran} time(s) for 5 requests`);
// One run at most: the rest came from the cache
if (ran > 1) process.exit(1);
