import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookmarkIcon } from "lucide-react";

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
    };
  },
  loaderDeps: ({ search: { q, offset } }) => ({ q: q ?? "", offset: offset ?? 0 }),
  loader: async ({ context: { queryClient }, deps: { q, offset } }) => {
    const { limit } = useSettingsStore.getState();
    await queryClient.ensureQueryData(getAllQueryOptions.bookmarks(q, offset, limit));
  },
});

function RouteComponent() {
  const { q, offset } = Route.useSearch();
  const { limit } = useSettingsStore();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data } = useSuspenseQuery(getAllQueryOptions.bookmarks(q, offset, limit));

  function onOffsetChange(newOffset: number) {
    navigate({
      search: (prev): BookmarkSearch => ({ ...prev, offset: newOffset }),
    });
  }
  return (
    <BookmarkWrapper
      heading="Bookmarks"
      bookmarkData={data}
      offset={offset}
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
            render={<Link to="/dashboard/bookmarks/add">Create bookmark</Link>}></Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
