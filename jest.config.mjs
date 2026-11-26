import nextJest from "next/jest.js";

// next/jest reads the Next config and .env files
const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  testEnvironment: "jest-environment-jsdom",
  // Only the files that end with .jest.test.js
  testMatch: ["**/*.jest.test.js"],
  // The @ alias, like in the app
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
});
