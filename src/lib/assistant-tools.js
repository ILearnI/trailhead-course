import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { listReviews } from "@/dal/reviews";
import { getTrail, listTrails } from "@/dal/trails";
import { filterTrails } from "@/lib/filter-trails";
import { summarize } from "@/lib/ratings";

// A trail with its ratings, or a readable error
async function details(slug) {
  const trail = await getTrail(slug);
  if (!trail) return { error: "No such trail" };
  const { count, average } = summarize(await listReviews(slug));
  return { ...trail, reviews: count, average };
}

// What the assistant may look up: read only
export const assistantTools = {
  findTrails: tool({
    description: "List the trails, filtered by region, level, or length.",
    inputSchema: z.object({
      region: z.enum(["alps", "coast", "forest"]).optional(),
      level: z.enum(["Easy", "Moderate", "Hard"]).optional(),
      maxKm: z.number().positive().optional().describe("The longest distance, in km"),
    }),
    execute: async (filters) => filterTrails(await listTrails(), filters),
  }),

  getTrailDetails: tool({
    description: "Get the description and the ratings of one trail, by its slug.",
    inputSchema: z.object({ slug: z.string().describe("For example: cedar-falls") }),
    execute: async ({ slug }) => details(slug),
  }),

  compareTrails: tool({
    description: "Compare two or three trails side by side, by their slugs.",
    inputSchema: z.object({
      slugs: z.array(z.string()).min(2).max(3).describe("For example: cedar-falls"),
    }),
    execute: async ({ slugs }) => Promise.all(slugs.map(details)),
  }),
};
