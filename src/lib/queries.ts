import { queryOptions } from "@tanstack/react-query";

import { linkdingFetch } from "@/lib/api";
import type { Bookmark, Folder, PaginatedResponse, Tag } from "@/types";

export const getAllQueryOptions = {
  bookmarks: (q: string = "", offset: number = 0, limit: number = 10) =>
    queryOptions({
      queryKey: ["bookmarks", { q, offset, limit }],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
          params: { q: String(q), offset: String(offset), limit: String(limit) },
        }),
    }),
  bookmarkById: (id: string) =>
    queryOptions({
      queryKey: ["bookmarks", id],
      queryFn: () => linkdingFetch<Bookmark>(`bookmarks/${id}`),
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
  bookmarksByFolderId: (id: string, offset: number = 0, limit: number = 10) =>
    queryOptions({
      queryKey: ["bookmarks", { bundle: id, offset, limit }],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
          params: { bundle: id, offset: String(offset), limit: String(limit) },
        }),
    }),
  tags: queryOptions({
    queryKey: ["tags"],
    queryFn: () => linkdingFetch<PaginatedResponse<Tag>>("tags"),
  }),
  bookmarksByTagName: (tagName: string, offset: number = 0, limit: number = 10) =>
    queryOptions({
      queryKey: ["bookmarks", { q: `#${tagName}`, offset, limit }],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
          params: { q: `#${tagName}`, offset: String(offset), limit: String(limit) },
        }),
    }),
};
