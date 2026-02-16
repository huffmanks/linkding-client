# Todos

## Bookmark States & Indicators

- [ ] [Bookmark dropdown](src/components/blocks/bookmark/action-dropdown.tsx#L60)
  - [ ] Unarchive/archive toggle.
  - [ ] Shared/unshared toggle.
  - [ ] Mark read/mark unread toggle.

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
- [ ] Disable mark as read when bookmark sheet is open.
- [ ] When creating bookmark, unread/archived/shared as default.

## Background Sync

- [ ] If offline, hard refresh crashes.
- [ ] If offline, optimisitic updates dont work for PUT/PATCH.

## UI

- [ ] Grid/list view add url below/above title.
- [ ] Bug when submitting tag ghost focus from either drawer or modal.
