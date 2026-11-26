import { readFile } from "node:fs/promises";
import path from "node:path";

// The file to send, and its type
const [file, type] = process.argv.slice(2);
const base = "http://localhost:3000";

// 1. Get the page, find the action id
const html = await (await fetch(`${base}/suggest`)).text();
const id = html.match(/\$ACTION_ID_[0-9a-f]+/)[0];

// 2. Build the multipart body
const form = new FormData();
form.append(id, "");
form.append("name", "Tarn Loop");
const bytes = await readFile(file);
form.append("photo", new Blob([bytes], { type }), path.basename(file));

// 3. Send it, and do not follow the redirect
const response = await fetch(`${base}/suggest`, {
  method: "POST",
  body: form,
  redirect: "manual",
});
console.log(response.status, response.headers.get("location"));
