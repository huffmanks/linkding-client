import { createFileRoute } from "@tanstack/react-router";

import { stopBulkSelectionOnEnterRoute } from "@/lib/loaders";
import { EmptyTags } from "@/routes/(protected)/dashboard/tags/-components/empty-tag";

export const Route = createFileRoute("/(protected)/dashboard/tags/")({
  component: RouteComponent,
  onEnter: stopBulkSelectionOnEnterRoute,
});

function RouteComponent() {
  return <EmptyTags />;
}
