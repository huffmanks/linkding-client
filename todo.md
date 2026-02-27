# Todos

## Bookmark filters

- [ ] Under select filters combobox, add `${count} results` e.g. *10 results*
- [ ] Make filters combobox a button instead of an input. Use filter icon and show filter count not chips.
- [ ] If a filter is selected, e.g. `unread` and marking a bookmark as read the UI glitches. Probably a recursive loop from useMemo, useCallback or useEffect.

## Search

- [ ] Searching with `#` for tags not working.
- [ ] When typing `#` in search, show a dropdown of existing tags.
- [ ] Make search work offline. If offline try query cache.

## Settings & preferences

- [ ] Display LD preferences as disabled in the Settings page (user profile data from: `GET /api/user/profile/`).
- [ ] Add batch deletion to folders, bookmarks.
- [ ] Show stats page (like karakeep).

## Background sync

- [ ] If offline, hard refresh crashes.
- [ ] If offline, optimisitic updates dont work for PUT/PATCH.

## UI

- [ ] Grid/list view add url below/above title.
- [ ] Bug when submitting tag ghost focus from either drawer or modal.
- [ ] Swap out vaul drawer for Base UI drawer.
- [ ] On mobile, hide bottom nav menu if keyboard is active.
