import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { linkdingFetch } from "@/lib/api";
import { useSettingsStore } from "@/lib/store";
import type { Bookmark, BookmarkSearch, PaginatedResponse } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";
import EmptyDescription from "@/components/empty-description";

const { limit } = useSettingsStore.getState();

const tagQueryOptions = (tagName: string, offset: number = 0) =>
  queryOptions({
    queryKey: ["bookmarks", tagName, offset, limit],
    queryFn: () =>
      linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
        params: { q: `#${tagName}`, offset: String(offset), limit: String(limit) },
      }),
  });

export const Route = createFileRoute("/(protected)/dashboard/tags/$tagName")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      offset: Number(search.offset) || 0,
    };
  },
  loaderDeps: ({ search: { offset } }) => ({ offset }),
  loader: async ({ context: { queryClient }, params: { tagName }, deps: { offset } }) => {
    queryClient.ensureQueryData(tagQueryOptions(tagName, offset));
  },
});

function RouteComponent() {
  const { tagName } = Route.useParams();
  const { offset } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data } = useSuspenseQuery(tagQueryOptions(tagName, offset));

  function onOffsetChange(newOffset: number) {
    navigate({
      search: (prev) => ({ ...prev, offset: newOffset }),
    });
  }

  return (
    <BookmarkWrapper
      heading={`#${tagName}`}
      isTagOrFolder
      description={<EmptyDescription name={tagName} isTag />}
      bookmarkData={data}
      offset={offset}
      onOffsetChange={onOffsetChange}
    />
  );
}
