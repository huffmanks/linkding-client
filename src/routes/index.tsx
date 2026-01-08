import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { linkdingFetch } from "@/lib/fetcher";
import type { Bookmark } from "@/types";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => linkdingFetch<{ results: Bookmark[] }>("bookmarks"),
  });

  if (isLoading) return <div>Loading...</div>;

  console.log(data);

  return <div className="m-4 text-red-500">hi</div>;
}
