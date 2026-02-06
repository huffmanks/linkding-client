import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/dashboard/folders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>List of all the folders here my guy!</div>;
}
