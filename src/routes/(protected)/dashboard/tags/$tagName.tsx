import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { linkdingFetch } from "@/lib/api";
import type { Bookmark } from "@/types";

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

  return (
    <div>
      <h1 className="mb-4 flex items-center gap-1 text-xl font-medium">
        <span className="text-muted-foreground text-base">#</span>
        <span>{tagName}</span>
      </h1>
      {data?.results.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
        </div>
      ))}
    </div>
  );
}
