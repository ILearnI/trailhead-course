// Exit 0 when the app answers
const url = "http://localhost:3000/api/health";
const response = await fetch(url).catch(() => null);
process.exit(response?.ok ? 0 : 1);
