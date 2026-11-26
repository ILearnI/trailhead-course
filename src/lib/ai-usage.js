// Example prices, per million tokens:
// check yours
const PRICE = { input: 0.1, output: 0.4 };

export function estimateCost({ inputTokens = 0, outputTokens = 0 }) {
  return (inputTokens * PRICE.input + outputTokens * PRICE.output) / 1_000_000;
}

// One line in the log for each call of the model
export function logUsage(name, usage) {
  const cost = estimateCost(usage).toFixed(6);
  console.log(`[ai] ${name}: ${usage.inputTokens} in, ${usage.outputTokens} out, $${cost}`);
}
