// The page, and the fields: name=value
const [page, ...pairs] = process.argv.slice(2);
const base = "http://localhost:3000";
const cookie = process.env.COOKIE ?? "";

// 1. Get the page, find the action id
const pageCookie = process.env.PAGE_COOKIE ?? cookie;
const first = await fetch(`${base}${page}`, { headers: { cookie: pageCookie } });
const html = await first.text();
const hidden = /<input type="hidden" name="(\$ACTION[^"]*)"(?: value="([^"]*)")?/g;
const actionFields = [...html.matchAll(hidden)];

// 2. Build the body from the pairs
const form = new FormData();
for (const [, name, value = ""] of actionFields) {
  form.append(name, value.replaceAll("&quot;", '"'));
}
for (const pair of pairs) {
  const [name, ...value] = pair.split("=");
  form.append(name, value.join("="));
}

// 3. Send it, with the cookie
const headers = { cookie };
if (process.env.ORIGIN) headers.origin = process.env.ORIGIN;
const response = await fetch(`${base}${page}`, { method: "POST", body: form, headers });
console.log(response.status);

// A line of the answer, when SHOW is a pattern
const body = await response.text();
const shown = process.env.SHOW && body.match(new RegExp(process.env.SHOW));
if (shown) console.log(shown[0]);

// The cookies that the server sets, no values
for (const cookie of response.headers.getSetCookie()) {
  console.log("set-cookie:", cookie.replace(/=[^;]*/, "=..."));
}
