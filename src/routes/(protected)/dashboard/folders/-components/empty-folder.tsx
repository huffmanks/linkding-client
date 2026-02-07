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

export default function EmptyFolder({ id, name }: { id: number; name: string }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkIcon />
        </EmptyMedia>
        <EmptyTitle>No bookmarks yet</EmptyTitle>
        <EmptyDescription>
          You haven’t added any bookmarks to this folder <code>{name}</code>. Edit this folder to
          include bookmarks or create a new bookmark.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button
            nativeButton={false}
            variant="outline"
            render={
              <Link to="/dashboard/folders/$id/edit" params={{ id: String(id) }}>
                Edit folder
              </Link>
            }></Button>

          <Button
            nativeButton={false}
            render={<Link to="/dashboard/add/bookmark">Create bookmark</Link>}></Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
