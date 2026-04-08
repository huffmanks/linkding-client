# Todos

## Issues

### Data/Background sync

- [ ] [Refactor useEffect](src/providers/background-sync.tsx#L60).
- [ ] Use cached results for search when offline.

---

## New features

### Bulk edit

- [ ] Add ability to remove/add tags for selected bookmarks.

### Upload assets

- [ ] Support uploading bookmark assets.

### Settings form

- [ ] Hide Id/order column, (optional preference) use settingsStore from:
  - [folder-table](<src/routes/(protected)/dashboard/folders/-components/folder-table.tsx>)
  - [tag-table](<src/routes/(protected)/dashboard/tags/-components/tag-table.tsx>)
  - [bookmark-table](src/components/blocks/bookmark/views/table.tsx)

---

## New pages

### Stats

- [ ] Stats page (like karakeep).

### Tags

- [ ] Editing/removing should cascade to bookmarks.
- [ ] [handleBulkEdit](<src/routes/(protected)/dashboard/folders/index.tsx>)

### Folders

- [ ] [handleBulkEdit](<src/routes/(protected)/dashboard/folders/index.tsx>)
