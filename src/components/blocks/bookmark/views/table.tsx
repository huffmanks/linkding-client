import { getCleanDomain } from "@/lib/utils";
import type { Bookmark } from "@/types";

import BookmarkFavicon from "@/components/bookmark-favicon";
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
  handleOpenSheet: (bookmark: Bookmark) => void;
}

export default function BookmarkTableView({ bookmarks, handleOpenSheet }: BookmarkTableViewProps) {
  return (
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
        {bookmarks.map((bookmark) => (
          <TableRow
            key={bookmark.id}
            tabIndex={0}
            role="button"
            className="hover:bg-muted/50 focus:bg-muted outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenSheet(bookmark);
              }
            }}>
            <TableCell
              role="button"
              className="cursor-pointer"
              onClick={() => handleOpenSheet(bookmark)}>
              <BookmarkFavicon bookmark={bookmark} />
            </TableCell>
            <TableCell
              role="button"
              className="cursor-pointer truncate"
              onClick={() => handleOpenSheet(bookmark)}>
              {bookmark.title}
            </TableCell>
            <TableCell className="truncate">
              <a
                className="text-primary"
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer">
                {getCleanDomain(bookmark.url)}
              </a>
            </TableCell>
            <TableCell
              role="button"
              className="min-w-0 cursor-pointer truncate"
              onClick={() => handleOpenSheet(bookmark)}>
              {bookmark.description}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
