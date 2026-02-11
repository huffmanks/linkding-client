import { Link } from "@tanstack/react-router";
import { EllipsisVerticalIcon } from "lucide-react";

import { useDeleteBookmark } from "@/lib/mutations";
import { cn } from "@/lib/utils";
import type { Bookmark } from "@/types";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionDropdownProps {
  bookmark: Bookmark;
  handleOpenSheet: (bookmark: Bookmark) => void;
  handleOpenChange: (open: boolean) => void;
  triggerButtonClassName?: string;
}

export default function ActionDropdown({
  bookmark,
  handleOpenSheet,
  handleOpenChange,
  triggerButtonClassName,
}: ActionDropdownProps) {
  const { mutateAsync } = useDeleteBookmark();

  async function handleDelete() {
    mutateAsync({ id: bookmark.id });
    handleOpenChange(false);
  }
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn("cursor-pointer", triggerButtonClassName)}>
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          }></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="truncate">{bookmark.title}</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenSheet(bookmark)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              nativeButton={false}
              render={
                <Link to="/dashboard/bookmarks/$id/edit" params={{ id: String(bookmark.id) }}>
                  Edit
                </Link>
              }
            />

            <DropdownMenuItem className="w-full cursor-pointer" variant="destructive">
              <AlertDialogTrigger
                className="w-full"
                nativeButton={false}
                render={<span>Delete</span>}></AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this bookmark.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
