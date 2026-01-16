import { GlobeIcon, ShieldIcon } from "lucide-react";

import type { Bookmark } from "@/types";

import BookmarkFavicon from "@/components/bookmark-favicon";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BookmarkListViewProps {
  bookmarks: Bookmark[];
  handleOpenSheet: (bookmark: Bookmark) => void;
}

export default function BookmarkListView({ bookmarks, handleOpenSheet }: BookmarkListViewProps) {
  return (
    <div className="space-y-6">
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id}>
          <section className="mb-1 flex items-center gap-2">
            <BookmarkFavicon bookmark={bookmark} />
            <h2 className="truncate text-sm font-medium">{bookmark.title}</h2>
          </section>
          <section className="mb-2">
            <p className="text-muted-foreground line-clamp-2 text-xs">{bookmark.description}</p>
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
          </section>
        </div>
      ))}
    </div>
  );
}
