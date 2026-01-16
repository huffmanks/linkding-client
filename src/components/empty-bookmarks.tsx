import { Link } from "@tanstack/react-router";
import { BookmarkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptyBookmarksProps {
  isTagOrFolder?: boolean;
  description?: React.ReactNode;
}

export default function EmptyBookmarks({
  isTagOrFolder = false,
  description = <DefaultDescription />,
}: EmptyBookmarksProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkIcon />
        </EmptyMedia>
        <EmptyTitle>No bookmarks yet</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          {isTagOrFolder && (
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link to="/dashboard">Go to bookmarks</Link>}></Button>
          )}
          <Button
            nativeButton={false}
            render={<Link to="/dashboard/bookmarks/add">Create bookmark</Link>}></Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}

function DefaultDescription() {
  return (
    <span>You haven’t created any bookmarks yet. Get started by creating your first bokmark.</span>
  );
}
