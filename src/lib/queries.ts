import { queryOptions } from "@tanstack/react-query";

import { linkdingFetch } from "@/lib/api";
import { useSettingsStore } from "@/lib/store";
import type { Bookmark, Folder, PaginatedResponse, Tag } from "@/types";

const { limit } = useSettingsStore.getState();

export const getAllQueryOptions = {
  bookmarks: (offset: number = 0, limit: number = 10) =>
    queryOptions({
      queryKey: ["bookmarks", offset, limit],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
          params: { offset: String(offset), limit: String(limit) },
        }),
    }),
  folders: queryOptions({
    queryKey: ["bundles"],
    queryFn: () => linkdingFetch<PaginatedResponse<Folder>>("bundles"),
  }),
  folderById: (id: string) =>
    queryOptions({
      queryKey: ["bundles", id],
      queryFn: () => linkdingFetch<Folder>(`bundles/${id}`),
    }),
  bookmarksByFolderId: (folder: Folder, fullQuery: string, offset: number) =>
    queryOptions({
      queryKey: ["bookmarks", "bundles", folder.id, fullQuery, offset, limit],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
          params: { q: fullQuery, offset: String(offset), limit: String(limit) },
        }),
    }),
  tags: queryOptions({
    queryKey: ["tags"],
    queryFn: () => linkdingFetch<PaginatedResponse<Tag>>("tags"),
  }),
  bookmarksByTagName: (tagName: string, offset: number = 0) =>
    queryOptions({
      queryKey: ["bookmarks", tagName, offset, limit],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
          params: { q: `#${tagName}`, offset: String(offset), limit: String(limit) },
        }),
    }),
};

export function folderBookmarksOptions(folder: Folder) {
  const queryParts: string[] = [];

  if (folder.search) queryParts.push(folder.search);

  if (folder.all_tags) {
    const tags = folder.all_tags
      .split(" ")
      .map((t) => `#${t}`)
      .join(" ");
    queryParts.push(tags);
  }

  if (folder.any_tags) {
    const tags = folder.any_tags
      .split(" ")
      .map((t) => `#${t}`)
      .join(" or ");
    queryParts.push(`(${tags})`);
  }

  if (folder.excluded_tags) {
    const tags = folder.excluded_tags
      .split(" ")
      .map((t) => `not #${t}`)
      .join(" ");
    queryParts.push(tags);
  }

  return queryParts.join(" ").trim();
}
