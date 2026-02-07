import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";
import { EmptyTags } from "@/routes/(protected)/dashboard/tags/-components/empty-tag";

export const Route = createFileRoute("/(protected)/dashboard/tags/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: tags } = useSuspenseQuery(getAllQueryOptions.tags);

  if (!tags.results.length) {
    return <EmptyTags />;
  }

  return (
    <div className="sm:px-2">
      <h1 className="mb-6 text-xl font-medium">Tags</h1>

      <div className="grid gap-4 pb-10 lg:grid-cols-2">
        {tags.results.map((tag) => (
          <div className="" key={tag.id}>
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
}
