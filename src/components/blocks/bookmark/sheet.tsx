import type { Bookmark } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface BookmarkSheetProps {
  bookmark: Bookmark;
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}

export default function BookmarkSheet({ bookmark, isOpen, handleOpenChange }: BookmarkSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="gap-0" side="right">
        <SheetHeader>
          <SheetTitle className="text-base font-medium">Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4">
          {bookmark.preview_image_url && (
            <img
              className="w-full rounded-lg"
              src={bookmark.preview_image_url}
              alt={bookmark.title}
            />
          )}

          <Badge variant="secondary">{bookmark.is_archived ? "Archived" : "Active"}</Badge>
          <h2 className="text-lg font-bold">{bookmark.title}</h2>
          <p className="text-muted-foreground">{bookmark.description}</p>

          <div>external link input icon adornment to copy and visit</div>
          <div>wayback link input icon adornment to copy and visit</div>
          <div>snapshot link input icon adornment to copy and visit</div>

          <div>tags section</div>
          <div>notes section</div>

          <div className="text-muted-foreground text-xs">
            <p>Created: {bookmark.date_added}</p>
            <p>Last modified: {bookmark.date_modified}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
