"use client";

import { useState } from "react";

import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboboxCreateProps {
  value: string[];
  initialItems?: string[];
  onChange: (value: string[]) => void;
}

export function ComboboxCreate({ value, onChange, initialItems = [] }: ComboboxCreateProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");

  const handleCreate = () => {
    if (search && !items.includes(search)) {
      setItems([...items, search]);
      onChange([...value, search]);
      setOpen(false);
      setSearch("");
    }
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            role="combobox"
            variant="outline"
            className="h-auto min-h-9 w-auto justify-between py-2"
            aria-expanded={open}
          />
        }>
        <DisplaySelected value={value} />
        <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-62.5 p-0">
        <Command>
          <div className="mb-2">
            <CommandInput
              value={search}
              placeholder="Search or create..."
              onValueChange={setSearch}
            />
          </div>
          <CommandList>
            <CommandEmpty className="pt-0 pb-1">
              <Button variant="ghost" className="w-full justify-start" onClick={handleCreate}>
                <Plus className="mr-2 size-4" />
                Create {search ? `"${search}"` : "a new one"}
              </Button>
            </CommandEmpty>
            <CommandGroup className="pt-0 pb-1">
              {items.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => {
                    const newValue = value.includes(item)
                      ? value.filter((v) => v !== item)
                      : [...value, item];
                    onChange(newValue);
                    setOpen(false);
                  }}>
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value.includes(item) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
            {search && !items.includes(search) && items.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={handleCreate}>
                    <Plus className="mr-2 size-4" />
                    Create "{search}"
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DisplaySelected({ value }: { value: string[] }) {
  const isMobile = useIsMobile();

  const items = value.filter(Boolean);

  const limit = isMobile ? 2 : 4;
  const hasMore = items.length > limit;

  if (items.length === 0) {
    return <span>Select or create...</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {items.slice(0, limit).map((item) => (
        <Badge key={item}>{item}</Badge>
      ))}

      {hasMore && <Badge>+{items.length - limit} more</Badge>}
    </div>
  );
}
