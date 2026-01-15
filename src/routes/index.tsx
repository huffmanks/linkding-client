import { createFileRoute, redirect } from "@tanstack/react-router";

import { isAuthenticated } from "@/lib/auth";

import { LoginForm } from "@/components/forms/login-form";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async () => {
    const authed = await isAuthenticated();
    if (authed) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function App() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
