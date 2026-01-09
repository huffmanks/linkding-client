import { createFileRoute, redirect } from "@tanstack/react-router";

import { isAuthenticated } from "@/lib/auth";

import Sidebar from "@/components/blocks/sidebar";

export const Route = createFileRoute("/(protected)")({
  component: RouteComponent,
  beforeLoad: async () => {
    const authed = await isAuthenticated();
    if (!authed) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <>
      <Sidebar />
    </>
  );
}
