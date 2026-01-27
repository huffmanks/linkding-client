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
  const { limit } = useSettingsStore();
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

function EmptyTag({ name }: { name: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkIcon />
        </EmptyMedia>
        <EmptyTitle>No bookmarks yet</EmptyTitle>
        <EmptyDescription>
          You haven’t added any bookmarks to this tag <code>#{name}</code>. Browse your bookmarks or
          create a new bookmark.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link to="/dashboard">Go to bookmarks</Link>}></Button>

          <Button
            nativeButton={false}
            render={<Link to="/dashboard/bookmarks/add">Create bookmark</Link>}></Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
