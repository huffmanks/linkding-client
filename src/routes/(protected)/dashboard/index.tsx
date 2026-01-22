import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import type { BookmarkSearch } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";

export const Route = createFileRoute("/(protected)/dashboard/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      offset: Number(search.offset) || 0,
    };
  },
  loaderDeps: ({ search: { offset } }) => ({ offset }),
  loader: async ({ context: { queryClient }, deps: { offset } }) => {
    await queryClient.ensureQueryData(getAllQueryOptions.bookmarks(offset));
  },
});

function RouteComponent() {
  const { offset } = Route.useSearch();
  const { limit } = useSettingsStore.getState();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data } = useSuspenseQuery(getAllQueryOptions.bookmarks(offset, limit));

  function onOffsetChange(newOffset: number) {
    navigate({
      search: (prev) => ({ ...prev, offset: newOffset }),
    });
  }
  return (
    <BookmarkWrapper
      heading="All bookmarks"
      bookmarkData={data}
      offset={offset}
      onOffsetChange={onOffsetChange}
    />
  );
}
