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

- [x] Check/test all routes and apis work/handle offline.
- [x] Edit forms (bookmark/folder): Get from cache if offline.
- [x] Create and edit form: add toast.
- [ ] If offline, hard refresh crashes.

## UI

- [ ] Grid/list view add url below/above title.
- [x] [Dialog](src/components/ui/dialog.tsx#L60) On mobile tag dialog push dialog up. Most of it is blocked by keyboard. (need to test on mobile)
- [ ] Bug when submitting tag ghost focus from either drawer or modal.
