import { createFileRoute } from "@tanstack/react-router";

import { EmptyTags } from "@/routes/(protected)/dashboard/tags/-components/empty-tag";

export const Route = createFileRoute("/(protected)/dashboard/tags/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EmptyTags />;
}
