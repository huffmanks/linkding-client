import {
  type ErrorComponentProps,
  useCanGoBack,
  useLocation,
  useRouter,
} from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import FullScreenWrapper from "@/components/full-screen-wrapper";
import { Button } from "@/components/ui/button";

export default function DefaultErrorComponent(props: ErrorComponentProps) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const { pathname } = useLocation();

  const isDashboardRoute = pathname.startsWith("/dashboard");
  return (
    <FullScreenWrapper className={cn(!isDashboardRoute && "min-h-svh justify-center")}>
      <h1 className="mb-3 font-mono text-2xl">{props.error.name}</h1>
      <p className="text-muted-foreground mb-6">{props.error.message}</p>
      <div className="flex items-center gap-4">
        {canGoBack && (
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => router.history.back()}>
            Go back
          </Button>
        )}
        <Button className="cursor-pointer" onClick={() => props.reset()}>
          Reset
        </Button>
      </div>
    </FullScreenWrapper>
  );
}
