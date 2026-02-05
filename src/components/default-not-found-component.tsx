import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";

import FullScreenWrapper from "@/components/full-screen-wrapper";
import { Button } from "@/components/ui/button";

export default function DefaultNotFoundComponent() {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <FullScreenWrapper className="min-h-svh justify-center">
      <h1 className="mb-3 font-mono text-2xl">404 | Not found</h1>
      <p className="text-muted-foreground mb-6">This page does not exist.</p>

      <div className="flex items-center gap-4">
        {canGoBack && (
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => router.history.back()}>
            Go back
          </Button>
        )}
        <Button
          nativeButton={false}
          className="cursor-pointer"
          render={<Link to="/dashboard">Dashboard</Link>}></Button>
      </div>
    </FullScreenWrapper>
  );
}
