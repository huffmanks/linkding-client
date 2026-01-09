import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { linkdingFetch } from "@/lib/fetcher";
import type { Bookmark } from "@/types";

export const Route = createFileRoute("/(protected)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => linkdingFetch<{ results: Bookmark[] }>("bookmarks"),
  });

  if (isLoading) return <div>Loading...</div>;

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
