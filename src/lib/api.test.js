import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/server";
import { fetchReviews, fetchSuggestion } from "./api";

describe("fetchSuggestion", () => {
  it("returns the suggestion that the API found", async () => {
    server.use(
      http.get("http://localhost:4002/suggestions", ({ request }) => {
        const id = new URL(request.url).searchParams.get("id");
        return HttpResponse.json({ id: Number(id), name: "Tarn Loop" });
      }),
    );
    expect(await fetchSuggestion(3)).toEqual({ id: 3, name: "Tarn Loop" });
  });

  it("returns null when the API answers not found", async () => {
    server.use(
      http.get("http://localhost:4002/suggestions", () =>
        HttpResponse.json({ error: "Not found" }, { status: 404 }),
      ),
    );
    expect(await fetchSuggestion(99)).toBeNull();
  });
});

describe("fetchReviews", () => {
  it("asks for the reviews of the trail", async () => {
    const reviews = await fetchReviews("alpine-lake");
    expect(reviews).toHaveLength(1);
    expect(reviews[0].trail).toBe("alpine-lake");
  });
});
