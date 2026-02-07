import { Link } from "@tanstack/react-router";
import { BookmarkIcon } from "lucide-react";

import FolderActionDropdown from "@/routes/(protected)/dashboard/folders/-components/folder-action-dropdown";

import CodeSpan from "@/components/code-span";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyFolder({ id, name }: { id: number; name: string }) {
  return (
    <div className="sm:px-2">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-medium">{name}</h1>
        <FolderActionDropdown id={id} name={name} />
      </div>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookmarkIcon />
          </EmptyMedia>
          <EmptyTitle>
            <span>No bookmarks in </span>
            <CodeSpan text={name} />
          </EmptyTitle>
          <EmptyDescription>
            You haven’t added any bookmarks to the <CodeSpan text={name} /> folder yet. Edit this
            folder to include bookmarks or create a new bookmark.
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
    </div>
  );
}

export function EmptyFolders() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkIcon />
        </EmptyMedia>
        <EmptyTitle>No folders yet</EmptyTitle>
        <EmptyDescription>
          You haven’t created any folders yet. Create a new folder.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button
            nativeButton={false}
            render={<Link to="/dashboard/add/folder">Create folder</Link>}></Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
