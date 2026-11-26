import { SignJWT, jwtVerify } from "jose";

// The key: bytes made from the secret
const key = new TextEncoder().encode(process.env.SESSION_SECRET);

// Sign a small payload, valid for 7 days
const token = await new SignJWT({ userId: 1, role: "user" })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("7d")
  .sign(key);
const [header, payload, signature] = token.split(".");
console.log("parts:", token.split(".").length);

// Anyone can read it: it is encoded
const decode = (part) => JSON.parse(Buffer.from(part, "base64url").toString());
console.log("header:", decode(header));
console.log("payload:", decode(payload).role, decode(payload).userId);

// The signature is what protects it
const ok = await jwtVerify(token, key);
console.log("verified:", ok.payload.userId);

// Change the payload, keep the signature
const admin = { ...decode(payload), role: "admin" };
const forged = Buffer.from(JSON.stringify(admin)).toString("base64url");
try {
  await jwtVerify(`${header}.${forged}.${signature}`, key);
} catch (error) {
  console.log("forged:", error.message);
}

// A token that has expired
const past = Math.floor(Date.now() / 1000) - 10;
const old = await new SignJWT({ userId: 1 })
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime(past)
  .sign(key);
try {
  await jwtVerify(old, key);
} catch (error) {
  console.log("expired:", error.message);
}
