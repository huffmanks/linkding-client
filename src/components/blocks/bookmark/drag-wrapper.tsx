import { useRef, useState } from "react";

import { XIcon } from "lucide-react";
import { AnimatePresence, type PanInfo, motion, useMotionValue, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

interface DragWrapperProps {
  onDismiss?: () => void;
  children: React.ReactNode;
}

export function DragWrapper({ onDismiss, children }: DragWrapperProps) {
  const [isInZone, setIsInZone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const constraintsRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const scale = useTransform(y, [400, 600], [1, 0.85]);

  function handleDragStart() {
    setIsDragging(true);
  }

  function handleDrag(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const isOverTarget =
      info.point.y > window.innerHeight - 215 &&
      Math.abs(info.point.x - window.innerWidth / 2) < 60;

    setIsInZone(isOverTarget);
  }

  function handleDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, _info: PanInfo) {
    setIsDragging(false);
    if (isInZone) onDismiss?.();
  }

  const zoneTransition = { type: "tween", ease: "easeOut", duration: 0.2 } as const;

  return (
    <div
      ref={constraintsRef}
      className="pointer-events-none fixed inset-0 z-50 h-dvh w-screen overflow-hidden">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        style={{ x, y, scale }}
        className="pointer-events-auto absolute right-4 bottom-6 w-full max-w-[calc(100%-2rem)] cursor-grab active:cursor-grabbing sm:bottom-12 sm:max-w-sm">
        {children}
      </motion.div>

      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: isInZone ? 1.1 : 1,
              backgroundColor: isInZone ? "rgba(239, 68, 68, 0.25)" : "rgba(255, 255, 255, 0.05)",
              borderColor: isInZone ? "rgba(239, 68, 68, 0.6)" : "rgba(255, 255, 255, 0.1)",
              boxShadow: isInZone ? "0 0 0 6px rgba(239, 68, 68, 0.2)" : "0 0 0 0px rgba(0,0,0,0)",
            }}
            exit={{ opacity: 0, y: 30, scale: 0.6 }}
            transition={zoneTransition}
            className={cn(
              "border-border text-foreground fixed bottom-32 left-1/2 flex size-12 -translate-x-1/2 items-center justify-center rounded-full border border-dashed backdrop-blur-md transition-colors",
              isInZone && "ring-destructive/20 ring-4"
            )}>
            <motion.div
              animate={{
                color: isInZone ? "rgb(239, 68, 68)" : "rgb(161, 161, 170)",
                scale: isInZone ? 1.1 : 1,
              }}
              transition={zoneTransition}>
              <XIcon className="size-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
