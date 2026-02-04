import { type ErrorComponentProps, useCanGoBack, useRouter } from "@tanstack/react-router";

import FullScreenWrapper from "@/components/full-screen-wrapper";
import { Button } from "@/components/ui/button";

export default function DefaultErrorComponent(props: ErrorComponentProps) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <FullScreenWrapper>
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
