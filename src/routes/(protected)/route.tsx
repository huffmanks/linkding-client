import { createFileRoute, redirect } from "@tanstack/react-router";

import { isAuthenticated } from "@/lib/auth";
import { getAllQueryOptions } from "@/lib/queries";

import Sidebar from "@/components/blocks/sidebar";

export const Route = createFileRoute("/(protected)")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { isValid } = await isAuthenticated();

    if (!isValid) {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(getAllQueryOptions.bookmarks("", 0, 1000)),
      queryClient.ensureQueryData(getAllQueryOptions.folders),
      queryClient.ensureQueryData(getAllQueryOptions.tags),
    ]);
  },
});

function RouteComponent() {
  return (
    <>
      <Sidebar />
    </>
  );
}
