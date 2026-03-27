import { useRef, useState } from "react";

import { AnimatePresence, type PanInfo, motion, useMotionValue, useTransform } from "motion/react";

export function DragWrapper({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isInZone, setIsInZone] = useState(false);
  const constraintsRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const scale = useTransform(y, [400, 600], [1, 0.85]);

  function handleDrag(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const isOverTarget =
      info.point.y > window.innerHeight - 120 &&
      Math.abs(info.point.x - window.innerWidth / 2) < 60;

    setIsInZone(isOverTarget);
  }

  function handleDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, _info: PanInfo) {
    if (isInZone) {
      setIsVisible(false);
    }
  }

  return (
    <div ref={constraintsRef} className="pointer-events-none fixed inset-0 z-50 h-screen w-screen">
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              style={{ x, y, scale }}
              className="pointer-events-auto absolute bottom-20 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing">
              {children}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isInZone ? 1.4 : 1,
                backgroundColor: isInZone ? "rgb(239, 68, 68)" : "var(--secondary)",
              }}
              exit={{ opacity: 0, y: 20 }}
              className="border-border text-foreground fixed bottom-10 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full border border-dashed backdrop-blur-lg transition-colors">
              <span className={isInZone ? "scale-110" : ""}>✕</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
