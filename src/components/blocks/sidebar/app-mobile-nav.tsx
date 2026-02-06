import { Link } from "@tanstack/react-router";
import { BookmarkIcon, FolderIcon, HashIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ActiveModal } from ".";

interface AppMobileNavProps {
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModal>>;
}

export default function AppMobileNav({ setActiveModal }: AppMobileNavProps) {
  return (
    <nav className="bg-background/80 fixed right-0 bottom-0 left-0 z-50 h-22 border-t pb-8 backdrop-blur-md">
      <div className="h-14 px-3 pt-4">
        <div className="flex w-full items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost-no-events" size="icon-nav" className="flex flex-col gap-1!">
                  <PlusIcon className="size-6" />
                  <p className="text-xs font-normal">Add</p>
                </Button>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Add</DropdownMenuLabel>
                <DropdownMenuItem
                  nativeButton={false}
                  render={<Link to="/dashboard/bookmarks/add">Bookmark</Link>}></DropdownMenuItem>
                <DropdownMenuItem
                  nativeButton={false}
                  render={<Link to="/dashboard/folders/add">Folder</Link>}></DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveModal("tag-form")}>Tag</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost-no-events"
            size="icon-nav"
            nativeButton={false}
            render={
              <Link to="/dashboard" className="flex flex-col gap-1!">
                <BookmarkIcon className="size-6" />
                <p className="text-xs font-normal">Bookmarks</p>
              </Link>
            }></Button>
          <Button
            variant="ghost-no-events"
            size="icon-nav"
            nativeButton={false}
            render={
              <Link to="/dashboard/folders" className="flex flex-col gap-1!">
                <FolderIcon className="size-6" />
                <p className="text-xs font-normal">Folders</p>
              </Link>
            }></Button>
          <Button
            variant="ghost-no-events"
            size="icon-nav"
            nativeButton={false}
            render={
              <Link to="/dashboard/tags" className="flex flex-col gap-1!">
                <HashIcon className="size-6" />
                <p className="text-xs font-normal">Tags</p>
              </Link>
            }></Button>
          <Button
            variant="ghost-no-events"
            size="icon-nav"
            nativeButton={false}
            render={
              <Link to="/dashboard/settings" className="flex flex-col gap-1!">
                <SettingsIcon className="size-6" />
                <p className="text-xs font-normal">Settings</p>
              </Link>
            }></Button>
        </div>
      </div>
    </nav>
  );
}
