import { useEffect, useRef, useState } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon, XIcon } from "lucide-react";

import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
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
      clearSearch();
      return;
    }

    if (e.target.value.split(" ").some((item) => item.startsWith("#"))) {
      console.log("word starts with hash");
    }

    setSearchInput(e.target.value);
  }

  function clearSearch() {
    setSearchInput("");
    navigate({
      to: "/dashboard",
      search: (prev) => {
        return {
          ...prev,
          q: undefined,
        };
      },
      replace: true,
    });
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!inputRef.current) return;

    const searchValue = inputRef.current.value;

    navigate({
      to: "/dashboard",
      search: (prev) => {
        return {
          ...prev,
          q: searchValue || undefined,
        };
      },
    });
  }

  useEffect(() => {
    setSearchInput(search?.q ?? "");
  }, [search?.q]);

  return (
    <form {...props} autoComplete="off" onSubmit={handleSubmit}>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>

      <InputGroup className="max-w-sm">
        <InputGroupInput
          ref={inputRef}
          id="search"
          value={searchInput}
          placeholder="Search..."
          autoComplete="off"
          className="bg-background h-8 w-full shadow-none"
          onChange={handleChange}
          onFocus={() => inputRef.current?.select()}
        />
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Button
            className={cn(searchInput === "" ? "invisible opacity-0" : "visible opacity-100")}
            size="icon-xs"
            variant="ghost"
            onClick={clearSearch}>
            <XIcon />
          </Button>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
