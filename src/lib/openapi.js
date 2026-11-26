const query = (name, description, schema) => ({
  name,
  in: "query",
  description,
  schema,
});

// The description of the api, for tools
export const spec = {
  openapi: "3.1.0",
  info: {
    title: "Trailhead API",
    version: "1.0.0",
    description: "Trails for mobile apps.",
  },
  servers: [{ url: "/api/v1" }],
  components: {
    securitySchemes: { ApiKey: { type: "apiKey", in: "header", name: "x-api-key" } },
  },
  security: [{ ApiKey: [] }],
  paths: {
    "/trails": {
      get: {
        summary: "List the trails",
        parameters: [
          query("region", "Only this region", { enum: ["alps", "coast", "forest"] }),
          query("level", "Only this level", { enum: ["Easy", "Moderate", "Hard"] }),
          query("page", "The page, from 1", { type: "integer", minimum: 1 }),
          query("limit", "Trails per page", { type: "integer", maximum: 50 }),
        ],
        responses: {
          200: { description: "A page of trails, with meta" },
          400: { description: "An invalid parameter" },
          401: { description: "A missing or invalid key" },
        },
      },
    },
    "/trails/{slug}": {
      get: {
        summary: "One trail",
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "The trail" },
          401: { description: "A missing or invalid key" },
          404: { description: "No such trail" },
        },
      },
    },
  },
};
