import { useRef, useState } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";

import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchInput, setSearchInput] = useState(search?.q ?? "");

  useKeyboardShortcut("k", toggleFocus, { mod: true });

  function toggleFocus() {
    inputRef.current?.focus();
    inputRef.current?.select();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      setSearchInput("");
      navigate({
        search: undefined,
        replace: true,
      });
      return;
    }

    setSearchInput(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!inputRef.current) return;

    const searchValue = inputRef.current.value;

    navigate({
      to: "/dashboard",
      search: {
        q: searchValue || undefined,
      },
    });
  }

  return (
    <form {...props} onSubmit={handleSubmit}>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>

      <InputGroup className="max-w-sm">
        <InputGroupInput
          ref={inputRef}
          id="search"
          value={searchInput}
          placeholder="Search..."
          className="bg-background h-8 w-full shadow-none"
          onChange={handleChange}
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
