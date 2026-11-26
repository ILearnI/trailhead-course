# Trailhead Studio

A back office, so that the people who run Trailhead
keep the site up to date without touching code or
the database.

## People

- Visitor: as today. No access to the studio.
- Editor: trails, photos, and removing reviews.
- Admin: all of it, and the roles of people.

## What we build

1. The shell: /studio, protected, with a menu
   that shows only what the role may open.
2. The overview: numbers, cached, refreshed
   when the data changes.
3. Trails: create, edit and delete, validated.
4. Photos: upload, check and serve.
5. Reviews: list and remove.

## Rules

- Every query checks the permission itself.
- Every write is a Server Action with a schema.
- What changes, revalidates its tags.
- No secret in the browser, no data in a log.
- Each part has tests before we move on.

## Done when

- [ ] An editor can add a trail with a photo.
- [ ] A visitor and a normal user cannot enter.
- [ ] The numbers update after a review.
- [ ] The tests and the pipeline are green.
- [ ] The launch checklist has no open item.
