// Walking speed, in km per hour, for each level
const SPEEDS = { Easy: 4, Moderate: 3, Hard: 2.5 };
// Times are rounded up to this many minutes
const STEP = 5;

export function estimateMinutes({ km, level }) {
  const minutes = (km / SPEEDS[level]) * 60;
  return Math.ceil(minutes / STEP) * STEP;
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}
