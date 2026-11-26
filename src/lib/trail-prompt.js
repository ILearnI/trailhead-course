// What the model is told about a trail: facts only
export function trailPrompt(trail) {
  return [
    "Describe this trail in three sentences.",
    `Name: ${trail.name}`,
    `Region: ${trail.region}`,
    `Level: ${trail.level}`,
    `Length: ${trail.km} km`,
    trail.description ? `Notes: ${trail.description}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
