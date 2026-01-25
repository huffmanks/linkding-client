import { useEffect } from "react";

interface ShortcutOptions {
  mod?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { mod, shift, alt, preventDefault = true } = options;

      const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();

      const isModMatch = mod ? event.metaKey || event.ctrlKey : true;

      const isShiftMatch = shift !== undefined ? event.shiftKey === shift : true;
      const isAltMatch = alt !== undefined ? event.altKey === alt : true;

      if (isKeyMatch && isModMatch && isShiftMatch && isAltMatch) {
        if (preventDefault) event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, JSON.stringify(options)]);
}
