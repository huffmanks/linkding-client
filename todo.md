# Todos

## Bookmark States & Indicators

- [ ] Display bookmark state indicators:
  - [ ] Unread: show red dot.
  - [ ] Read: no indicator.
  - [ ] Archived: show archived badge.
  - [ ] Unarchived: no indicator.
  - [ ] Private: show lock or shield icon.
  - [ ] Shared: show share icon.
- [ ] Allow toggling archive and other bookmark states. (e.g. `POST /api/bookmarks/<id>/archive/`)

## Bookmark List Actions

- [ ] Add sorting options to the bookmarks action toolbar (title, date, etc.).
- [ ] Add filters for bookmark states (unread, archived, private, shared).

## Search Enhancements

- [ ] When typing `#` in search, show a dropdown of existing tags.

## Settings & Preferences

- [ ] Display LD preferences as disabled in the Settings page (user profile data from: `GET /api/user/profile/`).
- [ ] Add batch deletion to folders, bookmarks.

## Background Sync

- [ ] Offline for (/dashboard) route gives error.
- [ ] Check/test all routes and apis work/handle offline.

## UI

- [ ] Grid/list view add url below/above title.

## Errors

- [ ] [api error offline](src/lib/api.ts#L18)
  - GET http://localhost:3001/api/bundles/8/ net::ERR_INTERNET_DISCONNECTED
  - GET http://localhost:3001/api/bookmarks/?bundle=8&offset=0&limit=10 net::ERR_INTERNET_DISCONNECTED
