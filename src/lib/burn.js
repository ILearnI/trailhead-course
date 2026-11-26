// Pretends that some work takes a given time
export function burn(ms) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // Keep the processor busy
  }
}
