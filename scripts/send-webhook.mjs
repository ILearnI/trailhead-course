import { signBody } from "../src/lib/webhook.js";

// The event, a delivery id, and --bad
const [body, delivery = "", flag] = process.argv.slice(2);
const secret = process.env.WEBHOOK_SECRET;
const signature = flag === "--bad" ? signBody("wrong-secret", body) : signBody(secret, body);

const headers = { "content-type": "application/json", "x-signature": signature };
if (delivery) headers["x-delivery-id"] = delivery;
const response = await fetch("http://localhost:3000/api/webhooks/content", {
  method: "POST",
  headers,
  body,
});
console.log(response.status, await response.text());
