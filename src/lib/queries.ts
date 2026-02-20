import { queryOptions } from "@tanstack/react-query";

import { linkdingFetch } from "@/lib/api";
import type { Bookmark, BookmarkCheck, Folder, PaginatedResponse, Tag } from "@/types";

export const getAllQueryOptions = {
  bookmarks: queryOptions({
    queryKey: ["bookmarks"],
    queryFn: () =>
      linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
        params: { limit: String(1000) },
      }),
  }),
  bookmarkList: (
    q: string = "",
    offset: number = 0,
    limit: number = 10,
    opts?: {
      sort?: string;
      order?: string;
      all?: string | boolean;
      archived?: string | boolean;
      unread?: string | boolean;
      shared?: string | boolean;
    }
  ) =>
    queryOptions({
      queryKey: ["bookmarks", { q, offset, limit, ...opts }],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
          params: {
            q: String(q),
            offset: String(offset),
            limit: String(limit),
            ...(opts?.sort ? { sort: String(opts.sort) } : {}),
            ...(opts?.order ? { order: String(opts.order) } : {}),
            ...(opts?.all != null ? { all: String(opts.all) } : {}),
            ...(opts?.archived != null ? { archived: String(opts.archived) } : {}),
            ...(opts?.unread != null ? { unread: String(opts.unread) } : {}),
            ...(opts?.shared != null ? { shared: String(opts.shared) } : {}),
          },
        }),
    }),
  bookmarkById: (id: string) =>
    queryOptions({
      queryKey: ["bookmarks", id],
      queryFn: () => linkdingFetch<Bookmark>(`bookmarks/${id}`),
    }),
  bookmarkCheckIfExists: (url: string = "") =>
    queryOptions({
      queryKey: ["bookmarksCheck", { url }],
      queryFn: () =>
        linkdingFetch<BookmarkCheck>("bookmarks/check", {
          params: { url: String(url) },
        }),
    }),
  folders: queryOptions({
    queryKey: ["bundles"],
    queryFn: () => linkdingFetch<PaginatedResponse<Folder>>("bundles"),
  }),
  folderList: (offset: number = 0, limit: number = 10) =>
    queryOptions({
      queryKey: ["bundles", { offset, limit }],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Folder>>("bundles", {
          params: { offset: String(offset), limit: String(limit) },
        }),
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
  tagList: (offset: number = 0, limit: number = 10) =>
    queryOptions({
      queryKey: ["tags", { offset, limit }],
      queryFn: () =>
        linkdingFetch<PaginatedResponse<Tag>>("tags", {
          params: { offset: String(offset), limit: String(limit) },
        }),
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
