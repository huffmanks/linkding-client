import { createFileRoute } from "@tanstack/react-router";

import { EmptyFolders } from "@/routes/(protected)/dashboard/folders/-components/empty-folder";

export const Route = createFileRoute("/(protected)/dashboard/folders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EmptyFolders />;
}
