# Studio architecture

## Routes

| Route | Needs | Page |
| --- | --- | --- |
| /studio | studio:view | overview and numbers |
| /studio/trails | trail:write | list, new, edit |
| /studio/reviews | review:delete:any | list, remove |
| /studio/people | user:set-role | roles |

## Checks

1. proxy: no session, no studio (login)
2. layout: no studio:view, 403
3. data layer: every query checks its own
   permission

## Roles

- user: none
- editor: studio:view, trail:write,
  review:delete:any
- admin: all of them, and user:set-role

## Data

- trails.photo: text, nullable (migration)
- no other change

## Cache

- numbers: use cache, one minute, tags
  ranking (reviews) and trails
- reviews and trails already revalidate them
