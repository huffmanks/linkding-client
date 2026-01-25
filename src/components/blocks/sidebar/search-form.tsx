import { useRef } from "react";

import { SearchIcon } from "lucide-react";

import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const inputRef = useRef<HTMLInputElement>(null);

  function toggleFocus() {
    inputRef.current?.focus();
  }

  useKeyboardShortcut("k", toggleFocus, { mod: true });

  return (
    <form {...props}>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>

      <InputGroup className="max-w-sm">
        <InputGroupInput
          ref={inputRef}
          id="search"
          placeholder="Search..."
          className="bg-background h-8 w-full shadow-none"
        />
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
