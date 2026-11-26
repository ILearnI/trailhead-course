// Which variables are missing? No values
const required = [
  "SESSION_SECRET",
  "REVALIDATE_SECRET",
  "WEBHOOK_SECRET",
  "GOOGLE_GENERATIVE_AI_API_KEY",
];

const missing = required.filter((name) => !process.env[name]);
for (const name of required) {
  console.log(`${missing.includes(name) ? "missing" : "set    "}  ${name}`);
}
if (missing.length > 0) process.exit(1);
