import { useState } from "react";

import { LayoutGridIcon, ListIcon, Table2Icon } from "lucide-react";

import type { Bookmark } from "@/types";

import BookmarkSheet from "@/components/blocks/bookmark/sheet";
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
  const [toggleView, setToggleView] = useState<ToggleView>("list");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);

  function handleOpenSheet(bookmark: Bookmark) {
    setSelectedBookmark(bookmark);
    setIsOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      setSelectedBookmark(null);
    }
  }

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

      {toggleView === "grid" && (
        <BookmarkGridView bookmarks={bookmarks} handleOpenSheet={handleOpenSheet} />
      )}

      {toggleView === "list" && (
        <BookmarkListView bookmarks={bookmarks} handleOpenSheet={handleOpenSheet} />
      )}

      {toggleView === "table" && (
        <BookmarkTableView bookmarks={bookmarks} handleOpenSheet={handleOpenSheet} />
      )}

      {selectedBookmark && (
        <BookmarkSheet
          isOpen={isOpen}
          bookmark={selectedBookmark}
          handleOpenChange={handleOpenChange}
        />
      )}
    </div>
  );
}
