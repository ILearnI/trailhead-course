import { createServer } from "node:http";
import { trails } from "../src/data/trails.js";
import { reviews as seed } from "../src/data/reviews.js";

// The weather of each region
const summaries = { alps: "Snow showers", coast: "Sea fog", forest: "Light rain" };

// Messages sent from the contact form
const messages = [];

// Likes of each trail
const likes = {};

// Trail suggestions, with an id
const suggestions = [];

// Closed trails, by slug
const closures = [];

// Reviews, starting with the data file
const reviews = seed.map((r) => ({ ...r, name: "A hiker" }));

// Requests received, by key
const hits = {};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  // Optional delay, to feel a slow API
  const delay = Number(url.searchParams.get("delay") ?? 0);
  await new Promise((resolve) => setTimeout(resolve, delay));
  res.setHeader("Content-Type", "application/json");
  // Let any page read this API
  // (a real API lists its sites)
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (url.searchParams.get("fail")) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: "Server error" }));
  }
  if (url.pathname === "/count") {
    const key = url.searchParams.get("key") ?? "default";
    hits[key] = (hits[key] ?? 0) + 1;
    return res.end(JSON.stringify({ key, count: hits[key] }));
  }
  if (url.pathname === "/weather") {
    const region = url.searchParams.get("region") ?? "alps";
    if (region === "broken") {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Weather service down" }));
    }
    return res.end(JSON.stringify({ region, summary: summaries[region] ?? "Clear skies", temp: 12 }));
  }
  if (url.pathname === "/messages") {
    if (req.method === "POST") {
      let body = "";
      for await (const chunk of req) body += chunk;
      messages.push(JSON.parse(body));
      return res.end(JSON.stringify({ count: messages.length }));
    }
    return res.end(JSON.stringify(messages));
  }
  if (url.pathname === "/likes") {
    const slug = url.searchParams.get("slug");
    if (req.method === "POST") {
      // One trail always fails, to see a rollback
      if (slug === "granite-peak") {
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: "Like failed" }));
      }
      likes[slug] = (likes[slug] ?? 0) + 1;
    }
    return res.end(JSON.stringify(likes));
  }
  if (url.pathname === "/suggestions") {
    if (req.method === "POST") {
      let body = "";
      for await (const chunk of req) body += chunk;
      const suggestion = { id: suggestions.length + 1, ...JSON.parse(body) };
      suggestions.push(suggestion);
      return res.end(JSON.stringify(suggestion));
    }
    const id = Number(url.searchParams.get("id"));
    const found = suggestions.find((item) => item.id === id);
    if (!found) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "Not found" }));
    }
    return res.end(JSON.stringify(found));
  }
  if (url.pathname === "/closures") {
    if (req.method === "POST") {
      let body = "";
      for await (const chunk of req) body += chunk;
      closures.push(JSON.parse(body).slug);
    }
    return res.end(JSON.stringify(closures));
  }
  if (url.pathname === "/reviews") {
    if (req.method === "POST") {
      let body = "";
      for await (const chunk of req) body += chunk;
      const review = JSON.parse(body);
      // The word boom makes the server fail
      if (review.text.includes("boom")) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: "Could not save" }));
      }
      reviews.push(review);
      return res.end(JSON.stringify(review));
    }
    const trail = url.searchParams.get("trail");
    return res.end(JSON.stringify(reviews.filter((r) => r.trail === trail)));
  }
  if (url.pathname === "/spots") {
    const hikers = url.searchParams.get("hikers");
    if (hikers === "boom") {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Database down" }));
    }
    if (Number(hikers) > 4) {
      res.statusCode = 409;
      return res.end(JSON.stringify({ error: "Only 4 spots left" }));
    }
    return res.end(JSON.stringify({ reserved: Number(hikers) }));
  }
  if (url.pathname === "/flaky") {
    // Fails on odd calls, works on even calls
    hits.flaky = (hits.flaky ?? 0) + 1;
    if (hits.flaky % 2 === 1) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: "Flaky service" }));
    }
    return res.end(JSON.stringify(trails));
  }
  if (url.pathname === "/trails") return res.end(JSON.stringify(trails));
  const trail = trails.find((t) => `/trails/${t.slug}` === url.pathname);
  if (!trail) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: "Not found" }));
  }
  res.end(JSON.stringify(trail));
});

server.listen(4002);
