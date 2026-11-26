const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
// Names that must never reach a log
const SECRET_NAME = /password|token|secret|authorization|cookie|key/i;

// Hide the values of secret fields
export function redact(fields) {
  return Object.fromEntries(
    Object.entries(fields).map(([name, value]) => [
      name,
      SECRET_NAME.test(name) ? "[hidden]" : value,
    ]),
  );
}

// One line of JSON for each event
function write(level, message, fields = {}) {
  const wanted = LEVELS[process.env.LOG_LEVEL ?? "info"] ?? LEVELS.info;
  if (LEVELS[level] < wanted) return;
  const line = { time: new Date().toISOString(), level, message, ...redact(fields) };
  const out = level === "error" ? console.error : console.log;
  out(JSON.stringify(line));
}

export const log = {
  debug: (message, fields) => write("debug", message, fields),
  info: (message, fields) => write("info", message, fields),
  warn: (message, fields) => write("warn", message, fields),
  error: (message, fields) => write("error", message, fields),
};
