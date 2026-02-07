import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import { EmptyTag } from "@/routes/(protected)/dashboard/tags/-components/empty-tag";
import type { BookmarkSearch } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";

export const Route = createFileRoute("/(protected)/dashboard/tags/$tagName")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      offset: typeof search.offset === "number" && search.offset !== 0 ? search.offset : undefined,
    };
  },
  loaderDeps: ({ search: { offset } }) => ({ offset: offset ?? 0 }),
  loader: async ({ context: { queryClient }, params: { tagName }, deps: { offset } }) => {
    const { limit } = useSettingsStore.getState();
    queryClient.ensureQueryData(getAllQueryOptions.bookmarksByTagName(tagName, offset, limit));
  },
});

function RouteComponent() {
  const { tagName } = Route.useParams();
  const { offset } = Route.useSearch();
  const limit = useSettingsStore((state) => state.limit);
  const navigate = useNavigate({ from: Route.fullPath });

  const { data } = useSuspenseQuery(getAllQueryOptions.bookmarksByTagName(tagName, offset, limit));

  function onOffsetChange(newOffset: number) {
    navigate({
      search: (prev) => ({ ...prev, offset: newOffset }),
    });
  }

  return (
    <BookmarkWrapper
      heading={`#${tagName}`}
      bookmarkData={data}
      offset={offset}
      onOffsetChange={onOffsetChange}
      emptyComponent={<EmptyTag name={tagName} />}
    />
  );
}
