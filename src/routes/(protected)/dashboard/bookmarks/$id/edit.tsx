import { createFileRoute, notFound } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";

import { BookmarkForm } from "@/components/forms/bookmark-form";

export const Route = createFileRoute("/(protected)/dashboard/bookmarks/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    try {
      return await queryClient.ensureQueryData(getAllQueryOptions.bookmarkById(id));
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        throw notFound();
      }
      throw error;
    }
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
