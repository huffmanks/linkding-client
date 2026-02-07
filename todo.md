# Todos

## Navigation & Routing

- [ ] Move Admin and LD links into the user dropdown menu on mobile.
- [ ] Create [tags page](<src/routes/(protected)/dashboard/tags/index.tsx>)
- [ ] Create [folders page](<src/routes/(protected)/dashboard/folders/index.tsx>)

## Error & Empty States

- [ ] Make the 404 page full-screen and vertically/horizontally centered when not in sidebar view.
- [ ] Apply the same full-screen centered layout to generic error pages.

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

## Data Validation & Duplication Checks

- [ ] Before creating a bookmark, check if a bookmark with the same URL already exists. (check bookmark existence by URL:
      `GET /api/bookmarks/check/?url=https%3A%2F%2Fexample.com`.)
- [ ] Before creating a folder, check if a folder with the same name already exists.

## Settings & Preferences

- [ ] Display LD preferences as disabled in the Settings page (user profile data from: `GET /api/user/profile/`).
- [ ] Add a “Clear all offline cache”, with toggle checkboxes for each type, action in Settings.
- [ ] Add an environment variable for offline cache retention (default: 120 days).

## Background Sync

- [ ] Use persistMutationClient and a mutation recovery logic, or use Workbox Background Sync to replay failed API calls when the connection returns.
- [ ] Set up the Offline Mutation recovery so users can perform actions like "Add Item" while offline
