import { cn, getCleanDomain } from "@/lib/utils";
import type { Bookmark } from "@/types";

import ActionDropdown from "@/components/blocks/bookmark/action-dropdown";
import BookmarkFavicon from "@/components/blocks/bookmark/bookmark-favicon";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BookmarkTableViewProps {
  bookmarks: Bookmark[];
  count: number;
  handleOpenSheet: (bookmark: Bookmark) => void;
  handleOpenChange: (open: boolean) => void;
}

export default function BookmarkTableView({
  bookmarks,
  count,
  handleOpenSheet,
  handleOpenChange,
}: BookmarkTableViewProps) {
  return (
    <div className="pb-6 sm:px-2">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8.5"></TableHead>
            <TableHead className="w-80">Title</TableHead>
            <TableHead className="w-56">Link</TableHead>
            <TableHead className="w-80">Description</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookmarks.map((bookmark) => (
            <TableRow
              key={bookmark.id}
              tabIndex={0}
              role="button"
              className={cn(
                "hover:bg-muted/50 focus:bg-muted border-muted outline-none",
                bookmark.unread && "bg-primary/10"
              )}
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
                  className="text-primary focus-visible:text-primary/80 underline-offset-2 transition-all outline-none hover:underline focus-visible:underline"
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
                {bookmark?.description ? (
                  bookmark.description
                ) : (
                  <span className="text-muted-foreground">No description</span>
                )}
              </TableCell>
              <TableCell className="flex items-center justify-end">
                <ActionDropdown
                  bookmark={bookmark}
                  handleOpenSheet={handleOpenSheet}
                  handleOpenChange={handleOpenChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total: {count}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
