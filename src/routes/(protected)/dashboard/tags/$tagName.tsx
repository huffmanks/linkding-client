import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { linkdingFetch } from "@/lib/api";
import type { Bookmark } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";

const tagQueryOptions = (tagName: string) =>
  queryOptions({
    queryKey: ["bookmarks", tagName],
    queryFn: () =>
      linkdingFetch<{ results: Bookmark[] }>("bookmarks", {
        params: { q: `#${tagName}` },
      }),
  });

export const Route = createFileRoute("/(protected)/dashboard/tags/$tagName")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { tagName } }) =>
    queryClient.ensureQueryData(tagQueryOptions(tagName)),
});

function RouteComponent() {
  const { tagName } = Route.useParams();

  const { data } = useSuspenseQuery(tagQueryOptions(tagName));

  return <BookmarkWrapper heading={`#${tagName}`} bookmarks={data.results} />;
}
