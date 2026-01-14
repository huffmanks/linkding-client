import { createFileRoute } from "@tanstack/react-router";

import { AddFolderForm } from "@/components/forms/add-folder-form";

export const Route = createFileRoute("/(protected)/dashboard/folders/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-lg pb-8 sm:px-4">
      <h1 className="mb-4 text-2xl font-medium">Add folder</h1>
      <AddFolderForm />
    </div>
  );
}
