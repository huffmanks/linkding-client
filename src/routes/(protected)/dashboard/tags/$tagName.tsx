import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";
import type { BookmarkSearch } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";
import EmptyDescription from "@/components/empty-description";

export const Route = createFileRoute("/(protected)/dashboard/tags/$tagName")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      offset: Number(search.offset) || 0,
    };
  },
  loaderDeps: ({ search: { offset = 0 } }) => ({ offset }),
  loader: async ({ context: { queryClient }, params: { tagName }, deps: { offset } }) => {
    queryClient.ensureQueryData(getAllQueryOptions.bookmarksByTagName(tagName, offset));
  },
});

function RouteComponent() {
  const { tagName } = Route.useParams();
  const { offset } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data } = useSuspenseQuery(getAllQueryOptions.bookmarksByTagName(tagName, offset));

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
