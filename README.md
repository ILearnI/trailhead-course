# Trailhead

A trail guide and community, built with Next.js 16 in the course
"Next.js 16: from the first page to production".

## Run it

```bash
cp .env.example .env.local   # then set SESSION_SECRET
npm ci
npm run db:migrate && npm run db:seed
node mock-api/server.mjs &   # the small API on port 4002
npm run dev
```

## Tests

```bash
npm run lint
npm run test:coverage        # unit and component tests
npx playwright test          # end-to-end tests
```

The pipeline in `.github/workflows/ci.yml` runs all of this on every push.
