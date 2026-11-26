# Launch report

Measured on the production build: `scripts/launch-check.mjs`,
`scripts/lighthouse.mjs` (median of three), `scripts/audit-media.mjs`,
`scripts/vitals.mjs --mobile` and `scripts/page-weight.mjs`.

| Check | Before | After |
| --- | --- | --- |
| Pages that pass the checker | 1 of 8 | 8 of 8 |
| Pages with their own title and description | 3 of 8 | 8 of 8 |
| Fields without a label | 5 | 0 |
| URLs in the sitemap | 10 | 19 |
| Structured data | trails | trails, faq, home |
| Main image of /trails | 135 KB, 4.1x wider | 47 KB, 1.3x wider |
| LCP of /trails, phone | 3.5 s | 3.1 s |
| JavaScript per page | 535 to 546 KB | 536 to 546 KB |
| Lighthouse of /trails | 89 | 88 (noise) |

## Launch checklist

Run `node --env-file=.env.local scripts/preflight.mjs`:
variables, secrets in the bundle, the shell of the pages,
search engine checks, health, login, errors, headers.

By a person, before the first visitor:

- [ ] The domain points to the server, with a real certificate
- [ ] The database and uploads are backed up, and restored once
- [ ] Someone is alerted when /api/health fails
- [ ] The previous image is kept, and the way back is written
- [ ] Production secrets are new, and only on the server

## Left to do

- One share image for the whole site: pages could have their own.
- Only the home and the trails page are translated.
- LCP of /trails is still above 2.5 s on a slow phone.
