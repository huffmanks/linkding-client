import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";

import BookmarkWrapper from "@/components/blocks/bookmark";

export const Route = createFileRoute("/(protected)/dashboard/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getAllQueryOptions.bookmarks);
  },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(getAllQueryOptions.bookmarks);

  return <BookmarkWrapper heading="Bookmarks" bookmarks={data.results} />;
}
