import { useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookmarkIcon } from "lucide-react";

import { useBookmarkParams } from "@/hooks/use-bookmark-params";
import { safeEnsure } from "@/lib/api";
import { applySortAndFilter } from "@/lib/bookmark-utils";
import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import type { BookmarkSearch } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const Route = createFileRoute("/(protected)/dashboard/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      q: typeof search.q === "string" && search.q !== "" ? search.q : undefined,
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
  loaderDeps: ({ search: { q, offset, sort, order, all, archived, unread, shared } }) => ({
    q: q ?? "",
    offset: offset ?? 0,
    sort: sort ?? undefined,
    order: order ?? undefined,
    all: all ?? undefined,
    archived: archived ?? undefined,
    unread: unread ?? undefined,
    shared: shared ?? undefined,
  }),
  loader: async ({
    context: { queryClient },
    deps: { q, offset, sort, order, all, archived, unread, shared },
  }) => {
    const { limit } = useSettingsStore.getState();
    await safeEnsure(
      queryClient,
      getAllQueryOptions.bookmarkList(q, offset, limit, {
        sort,
        order,
        all,
        archived,
        unread,
        shared,
      })
    );
  },
});

function RouteComponent() {
  const { q, offset } = Route.useSearch();
  const limit = useSettingsStore((state) => state.limit);
  const navigate = useNavigate({ from: Route.fullPath });

  const { data } = useSuspenseQuery(getAllQueryOptions.bookmarkList(q, offset, limit));

  function onOffsetChange(newOffset: number) {
    navigate({
      search: (prev): BookmarkSearch => ({ ...prev, offset: newOffset }),
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
      heading="Bookmarks"
      bookmarkData={bookmarkData}
      offset={offset}
      filters={filters}
      sort={sort}
      setSort={setSort}
      setFilter={setFilter}
      onOffsetChange={onOffsetChange}
      emptyComponent={<EmptyBookmarks />}
    />
  );
}

function EmptyBookmarks() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkIcon />
        </EmptyMedia>
        <EmptyTitle>No bookmarks yet</EmptyTitle>
        <EmptyDescription>
          You haven’t created any bookmarks yet. Get started by creating your first bookmark.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button
            nativeButton={false}
            render={<Link to="/dashboard/add/bookmark">Create bookmark</Link>}></Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
