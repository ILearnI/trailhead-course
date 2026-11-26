# End-to-end tests: Playwright

Decision: we use Playwright for end-to-end tests.

## Why

- Chromium, Firefox and WebKit from one install.
- Workers and shards are built in.
- Several tabs and users in one test.
- API tests and browser tests share the same runner.
- A trace for every failure.

## What we give up

- The time-travel runner of Cypress, while writing tests.
- A big community of plugins: Cypress has more.

Look again if the team moves to Cypress for components,
or if Playwright stops being maintained.
