import { cn } from "@/lib/utils";

export default function FullScreenWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex w-full items-center p-6", className)}>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
