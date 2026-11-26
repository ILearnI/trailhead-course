import { createHmac, timingSafeEqual } from "node:crypto";

// The signature of a body: sha256=<hex>
export function signBody(secret, body) {
  const hex = createHmac("sha256", secret).update(body).digest("hex");
  return `sha256=${hex}`;
}

// Is this the signature that we expect?
export function verifySignature(secret, body, signature) {
  if (!secret || !signature) return false;
  const expected = Buffer.from(signBody(secret, body));
  const received = Buffer.from(signature);
  // Same length, to be compared
  return received.length === expected.length && timingSafeEqual(received, expected);
}
