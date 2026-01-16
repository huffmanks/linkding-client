import { useState } from "react";

import { LayoutGridIcon, ListIcon, Table2Icon } from "lucide-react";

import type { Bookmark } from "@/types";

import BookmarkGridView from "@/components/blocks/bookmark/views/grid";
import BookmarkListView from "@/components/blocks/bookmark/views/list";
import BookmarkTableView from "@/components/blocks/bookmark/views/table";
import EmptyBookmarks from "@/components/empty-bookmarks";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BookmarkWrapperProps {
  heading: string;
  isTagOrFolder?: boolean;
  description?: React.ReactNode;
  bookmarks: Bookmark[];
}

type ToggleView = "grid" | "list" | "table";

export default function BookmarkWrapper({
  heading,
  isTagOrFolder,
  description,
  bookmarks,
}: BookmarkWrapperProps) {
  const [toggleView, setToggleView] = useState<ToggleView>("table");

  function handleValueChange(values: string[]) {
    const nextValue = values[values.length - 1] as ToggleView;

    if (nextValue) {
      setToggleView(nextValue);
    }
  }

  if (!bookmarks.length) {
    return <EmptyBookmarks isTagOrFolder={isTagOrFolder} description={description} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-medium">{heading}</h1>

        <ToggleGroup
          variant="outline"
          multiple={false}
          value={[toggleView]}
          onValueChange={handleValueChange}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGridIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <Table2Icon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {toggleView === "grid" && <BookmarkGridView bookmarks={bookmarks} />}

      {toggleView === "list" && <BookmarkListView bookmarks={bookmarks} />}

      {toggleView === "table" && <BookmarkTableView bookmarks={bookmarks} />}
    </div>
  );
}
