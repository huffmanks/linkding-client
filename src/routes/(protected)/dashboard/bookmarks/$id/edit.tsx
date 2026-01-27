import { createFileRoute } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";

import { BookmarkForm } from "@/components/forms/bookmark-form";

export const Route = createFileRoute("/(protected)/dashboard/bookmarks/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    return await queryClient.ensureQueryData(getAllQueryOptions.bookmarkById(id));
  },
});

function RouteComponent() {
  const bookmark = Route.useLoaderData();

  return (
    <div className="max-w-lg pb-8 sm:px-4">
      <h1 className="mb-4 text-2xl font-medium">Edit bookmark</h1>
      <BookmarkForm bookmark={bookmark} />
    </div>
  );
}
