import { createFileRoute } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";

import { FolderForm } from "@/components/forms/folder-form";

export const Route = createFileRoute("/(protected)/dashboard/folders/$id/edit")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params: { id } }) => {
    return await queryClient.ensureQueryData(getAllQueryOptions.folderById(id));
  },
});

function RouteComponent() {
  const folder = Route.useLoaderData();

  return (
    <div className="max-w-lg pb-8 sm:px-4">
      <h1 className="mb-4 text-2xl font-medium">Edit folder</h1>
      <FolderForm folder={folder} />
    </div>
  );
}
