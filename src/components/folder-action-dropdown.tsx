import { useNavigate } from "@tanstack/react-router";
import { EllipsisVerticalIcon } from "lucide-react";

import { useDeleteFolder } from "@/lib/api";
import type { Folder } from "@/types";

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
  folder: Folder;
}

export default function FolderActionDropdown({ folder }: ActionDropdownProps) {
  const { mutateAsync } = useDeleteFolder();
  const navigate = useNavigate();

  function handleEdit() {
    navigate({ to: "/dashboard/folders/$id/edit", params: { id: String(folder.id) } });
  }

  async function handleDelete() {
    mutateAsync(folder.id);

    navigate({ to: "/dashboard" });
  }
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" className="cursor-pointer">
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          }></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="truncate">{folder.name}</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
              Edit
            </DropdownMenuItem>
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
            This action cannot be undone. This will permanently delete this folder.
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
