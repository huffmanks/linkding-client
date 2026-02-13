import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";

import { safeEnsure } from "@/lib/api";
import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import { EmptyTag } from "@/routes/(protected)/dashboard/tags/-components/empty-tag";
import type { BookmarkSearch, PaginatedResponse, Tag } from "@/types";

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
    try {
      const tags = (await safeEnsure(
        queryClient,
        getAllQueryOptions.tags
      )) as PaginatedResponse<Tag>;

      const tagExists = tags.results.some((t) => t.name.toLowerCase() === tagName.toLowerCase());

      if (!tagExists) {
        throw notFound();
      }

      await safeEnsure(queryClient, getAllQueryOptions.bookmarksByTagName(tagName, offset, limit));
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        throw notFound();
      }
      throw error;
    }
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
