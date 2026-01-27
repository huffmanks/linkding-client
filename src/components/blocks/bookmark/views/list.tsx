import { Link } from "@tanstack/react-router";
import { GlobeIcon, ShieldIcon } from "lucide-react";

import { cn, getRelativeTimeString } from "@/lib/utils";
import type { Bookmark } from "@/types";

import ActionDropdown from "@/components/blocks/bookmark/action-dropdown";
import BookmarkFavicon from "@/components/blocks/bookmark/bookmark-favicon";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BookmarkListViewProps {
  bookmarks: Bookmark[];
  handleOpenSheet: (bookmark: Bookmark) => void;
  handleOpenChange: (open: boolean) => void;
}

export default function BookmarkListView({
  bookmarks,
  handleOpenSheet,
  handleOpenChange,
}: BookmarkListViewProps) {
  return (
    <div className="max-w-3xl space-y-2 pb-10">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="has-[[data-sheet-trigger]:focus-visible]:ring-primary/20 has-[[data-sheet-trigger]:hover]:ring-primary/20 rounded-md p-2 has-[[data-sheet-trigger]:focus-visible]:ring-1 has-[[data-sheet-trigger]:hover]:ring-1 has-[[data-tag-links]:focus-visible]:ring-0 has-[[data-tag-links]:hover]:ring-0">
          <section className="mb-1 flex items-center justify-between gap-2">
            <a
              className="decoration-primary hover:decoration-primary/70 focus-visible:decoration-primary/70 hover:text-primary/70 focus-visible:text-primary/70 flex items-center gap-2 underline underline-offset-4 transition-colors outline-none"
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer">
              <BookmarkFavicon bookmark={bookmark} />
              <h2 className="truncate text-sm font-medium">{bookmark.title}</h2>
            </a>
            <ActionDropdown
              bookmark={bookmark}
              handleOpenSheet={handleOpenSheet}
              handleOpenChange={handleOpenChange}
            />
          </section>
          <div
            tabIndex={0}
            role="button"
            data-sheet-trigger
            className="cursor-pointer outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenSheet(bookmark);
              }
            }}
            onClick={() => handleOpenSheet(bookmark)}>
            <section className="mb-2 space-y-1">
              {bookmark?.description && (
                <p className="text-muted-foreground line-clamp-2 text-xs">{bookmark.description}</p>
              )}
              <p className={cn("text-xs", !bookmark?.description && "mt-2")}>
                {getRelativeTimeString(new Date(bookmark.date_added))}
              </p>
            </section>
            <section className="mb-2 flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Badge size="icon" variant="outline">
                      {bookmark.shared ? (
                        <GlobeIcon className="text-primary" />
                      ) : (
                        <ShieldIcon className="text-primary" />
                      )}
                    </Badge>
                  }></TooltipTrigger>
                <TooltipContent>
                  <p>{bookmark.shared ? "Public" : "Private"}</p>
                </TooltipContent>
              </Tooltip>

              <Badge variant="secondary">{bookmark.is_archived ? "Archived" : "Active"}</Badge>

              {bookmark?.tag_names && (
                <div className="flex items-center gap-1" data-tag-links>
                  {bookmark.tag_names.map((tag) => (
                    <Badge
                      key={tag}
                      render={
                        <Link
                          className="hover:bg-muted! hover:text-primary/80 focus-visible:bg-muted! focus-visible:text-primary/80 transition-colors outline-none"
                          to="/dashboard/tags/$tagName"
                          params={{ tagName: tag }}
                          onClick={(e) => e.stopPropagation()}>
                          #{tag}
                        </Link>
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      ))}
    </div>
  );
}
