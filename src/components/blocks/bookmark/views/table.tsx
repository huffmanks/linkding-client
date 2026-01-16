import { useState } from "react";

import { getCleanDomain } from "@/lib/utils";
import type { Bookmark } from "@/types";

import BookmarkSheet from "@/components/blocks/bookmark/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BookmarkTableViewProps {
  bookmarks: Bookmark[];
}

export default function BookmarkTableView({ bookmarks }: BookmarkTableViewProps) {
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

  return (
    <>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8.5"></TableHead>
            <TableHead className="w-80">Title</TableHead>
            <TableHead className="w-56">Link</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookmarks.map((item) => (
            <TableRow
              key={item.id}
              tabIndex={0}
              role="button"
              className="hover:bg-muted/50 focus:bg-muted outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenSheet(item);
                }
              }}>
              <TableCell
                role="button"
                className="cursor-pointer"
                onClick={() => handleOpenSheet(item)}>
                {item.favicon_url && (
                  <div className="flex items-center justify-center overflow-hidden rounded-full border border-gray-50 bg-gray-200 shadow-lg">
                    <img className="size-4" src={item.favicon_url} alt={item.title} />
                  </div>
                )}
              </TableCell>
              <TableCell
                role="button"
                className="cursor-pointer truncate"
                onClick={() => handleOpenSheet(item)}>
                {item.title}
              </TableCell>
              <TableCell className="truncate">
                <a
                  className="text-primary"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer">
                  {getCleanDomain(item.url)}
                </a>
              </TableCell>
              <TableCell
                role="button"
                className="min-w-0 cursor-pointer truncate"
                onClick={() => handleOpenSheet(item)}>
                {item.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedBookmark && (
        <BookmarkSheet
          isOpen={isOpen}
          bookmark={selectedBookmark}
          handleOpenChange={handleOpenChange}
        />
      )}
    </>
  );
}
