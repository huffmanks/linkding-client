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
- [ ] Make search work offline. If offline try query cache.
- [ ] Bookmarks page if search query params don't show empty bookmarks show no matching bookmarks with that query.

## Settings & Preferences

- [ ] Display LD preferences as disabled in the Settings page (user profile data from: `GET /api/user/profile/`).
- [ ] Add batch deletion to folders, bookmarks.
- [ ] Show stats page (like karakeep).

## Background Sync

- [ ] Offline for (/dashboard) route gives error.
- [ ] Check/test all routes and apis work/handle offline.
- [ ] Edit forms (bookmark/folder): Use query client cache first to send from route to form. This will allow prepopulating fields.
- [ ] Create and edit form: Skip API post if offline like and pass to background sync.
- [ ] If offline make hard refresh not load the browser offline page.
- [ ] [api error offline](src/lib/api.ts#L18)
  - GET http://localhost:3001/api/bundles/8/ net::ERR_INTERNET_DISCONNECTED
  - GET http://localhost:3001/api/bookmarks/?bundle=8&offset=0&limit=10 net::ERR_INTERNET_DISCONNECTED

## UI

- [ ] Grid/list view add url below/above title.
- [x] On mobile tag dialog push dialog up. Most of it is blocked by keyboard. (need to test on mobile)
- [ ] Bug when submitting tag ghost focus from either drawer or modal.
