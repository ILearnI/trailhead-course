import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { server } from "./src/test/server";

// Start the fake network, and refuse unknown requests
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

// Remove rendered components after each test
afterEach(() => {
  cleanup();
  // Forget the handlers added by one test
  server.resetHandlers();
});

afterAll(() => server.close());
