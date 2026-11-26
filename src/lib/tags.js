// One place for the names of the cache tags
export const tags = {
  // The list of the trails, and the searches
  trails: "trails",
  // One trail
  trail: (slug) => `trail:${slug}`,
  // The reviews of one trail
  reviews: (slug) => `reviews:${slug}`,
  // The best trails: depends on all the reviews
  ranking: "ranking",
};
