import { createFileRoute, redirect } from "@tanstack/react-router";

import { checkAuth } from "@/lib/auth";

import { LoginForm } from "@/components/forms/login-form";
import FullScreenWrapper from "@/components/full-screen-wrapper";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async () => {
    const { isValid } = await checkAuth();

    if (isValid) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function App() {
  return (
    <FullScreenWrapper className="min-h-svh justify-center">
      <LoginForm />
    </FullScreenWrapper>
  );
}
