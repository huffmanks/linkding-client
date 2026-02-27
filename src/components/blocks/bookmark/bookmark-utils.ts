import type { Bookmark } from "@/types";

export type SortField = "title" | "date_modified";
export type SortOrder = "asc" | "desc";
export type FilterKey = "all" | "unread" | "read" | "shared" | "private" | "archived" | "active";

export type BookmarkFilters = {
  all?: boolean | undefined;
  is_archived?: boolean | undefined;
  unread?: boolean | undefined;
  shared?: boolean | undefined;
};

function compareStrings(a: string | null | undefined, b: string | null | undefined) {
  const aa = (a ?? "").toLowerCase();
  const bb = (b ?? "").toLowerCase();
  return aa.localeCompare(bb);
}

function compareDates(a: string | null | undefined, b: string | null | undefined) {
  const da = a ? Date.parse(a) : 0;
  const db = b ? Date.parse(b) : 0;
  if (da < db) return -1;
  if (da > db) return 1;
  return 0;
}

export function sortBookmarks(
  items: Bookmark[],
  field: SortField,
  order: SortOrder = "asc"
): Bookmark[] {
  const dir = order === "asc" ? 1 : -1;
  return [...items].sort((x, y) => {
    let cmp = 0;
    switch (field) {
      case "title":
        cmp = compareStrings(x.title ?? x.website_title, y.title ?? y.website_title);
        break;
      case "date_modified":
        cmp = compareDates(x.date_modified, y.date_modified);
        break;
      default:
        cmp = 0;
    }
    return cmp * dir;
  });
}

export function filterBookmarks(
  items: Bookmark[] | null | undefined,
  filters: BookmarkFilters
): Bookmark[] {
  const list = items ?? [];

  if (filters.all === true) return list;

  return list.filter((b) => {
    if (filters.is_archived !== undefined && b.is_archived !== filters.is_archived) return false;
    if (filters.unread !== undefined && b.unread !== filters.unread) return false;
    if (filters.shared !== undefined && b.shared !== filters.shared) return false;
    return true;
  });
}

export function applySortAndFilter(
  items: Bookmark[] | null | undefined,
  options?: {
    filters?: BookmarkFilters;
    sort?: { field: SortField; order?: SortOrder } | null;
  }
): Bookmark[] {
  let result = items ?? [];
  if (options?.filters) result = filterBookmarks(result, options.filters);
  if (options?.sort)
    result = sortBookmarks(result, options.sort.field, options.sort.order ?? "asc");
  return result;
}

export function parseBoolParam(
  v?: string | number | boolean | null | undefined
): boolean | undefined {
  if (v == null) return undefined;
  if (typeof v === "boolean") return v;

  const s = String(v).toLowerCase().trim();
  if (s === "true") return true;
  if (s === "false") return false;
  return undefined;
}

export default {
  sortBookmarks,
  filterBookmarks,
  applySortAndFilter,
  parseBoolParam,
};
