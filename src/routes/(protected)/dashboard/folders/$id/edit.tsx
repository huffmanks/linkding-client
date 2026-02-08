import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";

import { FolderForm } from "@/components/forms/folder-form";

export const Route = createFileRoute("/(protected)/dashboard/folders/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    try {
      await queryClient.ensureQueryData(getAllQueryOptions.folderById(id));
      return { id };
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        throw notFound();
      }
      throw error;
    }
  },
});

function RouteComponent() {
  const { id } = Route.useLoaderData();
  const { data: folder } = useSuspenseQuery(getAllQueryOptions.folderById(id));

  return (
    <div className="max-w-lg pb-8 sm:px-4">
      <h1 className="mb-4 text-2xl font-medium">Edit folder</h1>
      <FolderForm folder={folder} />
    </div>
  );
}
