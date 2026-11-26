// Print when each word first appears in the page
const [url, ...words] = process.argv.slice(2);
const started = performance.now();
const response = await fetch(url);
const decoder = new TextDecoder();
const seen = new Set();
let text = "";

for await (const chunk of response.body) {
  text += decoder.decode(chunk, { stream: true });
  for (const word of words) {
    if (seen.has(word) || !text.includes(word)) continue;
    seen.add(word);
    const seconds = ((performance.now() - started) / 1000).toFixed(1);
    console.log(`${seconds}s  ${word}`);
  }
}
