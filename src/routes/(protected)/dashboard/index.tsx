import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";

export const Route = createFileRoute("/(protected)/dashboard/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getAllQueryOptions.bookmarks);
  },
});

function RouteComponent() {
  const { data } = useSuspenseQuery(getAllQueryOptions.bookmarks);

  const hasBookmarks = data?.results && data?.results?.length;

  return (
    <>
      {hasBookmarks ? (
        <div>
          {data.results.map((item) => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
      ) : (
        <div>No results.</div>
      )}
    </>
  );
}
