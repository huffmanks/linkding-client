import { useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";

import { useBookmarkParams } from "@/hooks/use-bookmark-params";
import { safeEnsure } from "@/lib/api";
import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import { EmptyTag } from "@/routes/(protected)/dashboard/tags/-components/empty-tag";
import type { BookmarkSearch, PaginatedResponse, Tag } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";
import { applySortAndFilter } from "@/components/blocks/bookmark/bookmark-utils";

export const Route = createFileRoute("/(protected)/dashboard/tags/$tagName")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      offset: typeof search.offset === "number" && search.offset !== 0 ? search.offset : undefined,
      sort: typeof search.sort === "string" && search.sort !== "" ? search.sort : undefined,
      order: typeof search.order === "string" && search.order !== "" ? search.order : undefined,
      all:
        typeof search.all === "string" || typeof search.all === "boolean"
          ? (search.all as string | boolean)
          : undefined,
      archived:
        typeof search.archived === "string" || typeof search.archived === "boolean"
          ? (search.archived as string | boolean)
          : undefined,
      unread:
        typeof search.unread === "string" || typeof search.unread === "boolean"
          ? (search.unread as string | boolean)
          : undefined,
      shared:
        typeof search.shared === "string" || typeof search.shared === "boolean"
          ? (search.shared as string | boolean)
          : undefined,
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

  const { filters, sort, setSort, setFilter } = useBookmarkParams(Route);

  const bookmarkData = useMemo(() => {
    if (!data) return data;
    return {
      ...data,
      results: applySortAndFilter(data.results, { filters, sort }),
    };
  }, [data, filters, sort]);

  return (
    <BookmarkWrapper
      heading={`#${tagName}`}
      bookmarkData={bookmarkData}
      offset={offset}
      filters={filters}
      sort={sort}
      setSort={setSort}
      setFilter={setFilter}
      onOffsetChange={onOffsetChange}
      emptyComponent={<EmptyTag name={tagName} />}
    />
  );
}
