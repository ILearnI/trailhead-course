// A short description, with the facts
export function trailDescription(trail) {
  const level = trail.level.toLowerCase();
  const facts = `${trail.km} km, ${level}, in the ${trail.region}.`;
  return `${trail.description} ${facts}`.slice(0, 160);
}

// What the head of a trail page says
export function trailMetadata(trail) {
  const description = trailDescription(trail);
  return {
    title: trail.name,
    description,
    alternates: { canonical: `/trails/${trail.slug}` },
    openGraph: { title: trail.name, description, type: "article" },
  };
}
