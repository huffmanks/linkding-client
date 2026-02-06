import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/dashboard/tags/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>List of all the tags here my guy!</div>;
}
