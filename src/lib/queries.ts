import { queryOptions } from "@tanstack/react-query";

import { linkdingFetch } from "@/lib/api";
import type { Bookmark, Bundle, Tag } from "@/types";

export const getAllQueryOptions = {
  bookmarks: queryOptions({
    queryKey: ["bookmarks"],
    queryFn: () => linkdingFetch<{ results: Bookmark[] }>("bookmarks"),
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
