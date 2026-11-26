# Diagnosis: /sluggish

Measured on a phone (processor four times slower, network 1.6 Mbit/s), on the
production build, with `scripts/vitals.mjs` and `scripts/page-weight.mjs`.

| Metric | Value | Limit | Verdict |
| --- | --- | --- | --- |
| LCP | 4.1 s | 2.5 s | poor |
| INP | 450 ms | 200 ms | poor |
| CLS | 0.14 | 0.1 | needs work |
| JavaScript | 717 KB | 600 KB | over budget |

## Causes

1. LCP: the hero image takes 3.9 s to download. It is a plain `img` tag, with
   no `priority`, and a photo of 1000 px.
2. INP: the click handler of Recalculate runs 410 ms on the main thread.
3. CLS: the element that moves is the hero image, but the cause is the Promo
   banner, shown after 600 ms above it with no reserved space (0.14; 0 without it).
4. Bundle: one chunk of 191 KB holds 1200 reviews, imported by a client
   component that shows three.

## Fixes, by expected effect

1. Image: `next/image` with `fetchPriority`, `sizes`, width and height.
   Goal: LCP under 2.5 s.
2. Click: move the work out of the handler. Goal: INP under 200 ms.
3. Banner: reserve its space, or render it on the server. Goal: CLS under 0.1.
4. Reviews: filter on the server, and send three. Goal: about 190 KB less.

## Result

| Metric | Before | After | Limit |
| --- | --- | --- | --- |
| LCP | 4.1 s | 2.3 s | 2.5 s |
| INP | 450 ms | 50 ms | 200 ms |
| CLS | 0.14 | 0 | 0.1 |
| JavaScript | 723 KB | 547 KB | 600 KB |
| Lighthouse | 75 | 92 | 90 |
