import { createFileRoute } from "@tanstack/react-router";

import { BookmarkForm } from "@/components/forms/bookmark-form";

export const Route = createFileRoute("/(protected)/dashboard/bookmarks/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-lg pb-8 sm:px-4">
      <h1 className="mb-4 text-2xl font-medium">Add bookmark</h1>
      <BookmarkForm />
    </div>
  );
}
