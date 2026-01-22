import { queryOptions } from "@tanstack/react-query";

import { linkdingFetch } from "@/lib/api";
import type { Bookmark, Bundle, PaginatedResponse, Tag } from "@/types";

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
    queryFn: () => linkdingFetch<{ results: Bundle[] }>("bundles"),
  }),
  tags: queryOptions({
    queryKey: ["tags"],
    queryFn: () => linkdingFetch<{ results: Tag[] }>("tags"),
  }),
};
