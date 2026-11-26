import { http, HttpResponse } from "msw";

// The default answers of the fake weather API
export const handlers = [
  http.get("http://localhost:4002/weather", ({ request }) => {
    const region = new URL(request.url).searchParams.get("region");
    return HttpResponse.json({ region, summary: "Snow showers", temp: 2 });
  }),
  http.get("http://localhost:4002/reviews", ({ request }) => {
    const trail = new URL(request.url).searchParams.get("trail");
    return HttpResponse.json([{ trail, name: "Ada", rating: 5, text: "Clear water." }]);
  }),
];
