import { useState } from "react";

import { Link, useLocation } from "@tanstack/react-router";
import { BookmarkIcon, FolderIcon, HashIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { checkActive, cn } from "@/lib/utils";

import type { ActiveModal } from "@/components/blocks/sidebar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface AppMobileNavProps {
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModal>>;
}

export default function AppMobileNav({ setActiveModal }: AppMobileNavProps) {
  const { pathname } = useLocation();

  return (
    <nav className="bg-background/60 fixed right-0 bottom-0 left-0 z-50 h-26 rounded-b-xl border-t pb-10 backdrop-blur-md">
      <div className="h-18 px-3 pt-4">
        <div className="flex w-full items-center gap-4">
          <Button
            variant="ghost-no-events"
            size="icon-nav"
            nativeButton={false}
            render={
              <Link to="/dashboard" className="flex flex-col gap-1!">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-1.5 transition-colors",
                    checkActive({ pathname, url: "/dashboard", name: "Bookmarks" }) &&
                      "bg-muted text-primary dark:bg-muted/50"
                  )}>
                  <BookmarkIcon className="size-6" />
                </div>
                <p
                  className={cn(
                    "text-muted-foreground text-xs font-normal transition-colors",
                    checkActive({ pathname, url: "/dashboard", name: "Bookmarks" }) &&
                      "text-foreground font-medium"
                  )}>
                  Bookmarks
                </p>
              </Link>
            }></Button>
          <Button
            variant="ghost-no-events"
            size="icon-nav"
            nativeButton={false}
            render={
              <Link to="/dashboard/folders" className="flex flex-col gap-1!">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-1.5 transition-colors",
                    checkActive({ pathname, url: "/dashboard/folders" }) &&
                      "bg-muted text-primary dark:bg-muted/50"
                  )}>
                  <FolderIcon className="size-6" />
                </div>
                <p
                  className={cn(
                    "text-muted-foreground text-xs font-normal transition-colors",
                    checkActive({ pathname, url: "/dashboard/folders" }) &&
                      "text-foreground font-medium"
                  )}>
                  Folders
                </p>
              </Link>
            }></Button>

          <NavDrawer pathname={pathname} setActiveModal={setActiveModal} />

          <Button
            variant="ghost-no-events"
            size="icon-nav"
            nativeButton={false}
            render={
              <Link to="/dashboard/tags" className="flex flex-col gap-1!">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-1.5 transition-colors",
                    checkActive({ pathname, url: "/dashboard/tags" }) &&
                      "bg-muted text-primary dark:bg-muted/50"
                  )}>
                  <HashIcon className="size-6" />
                </div>
                <p
                  className={cn(
                    "text-muted-foreground text-xs font-normal transition-colors",
                    checkActive({ pathname, url: "/dashboard/tags" }) &&
                      "text-foreground font-medium"
                  )}>
                  Tags
                </p>
              </Link>
            }></Button>
          <Button
            variant="ghost-no-events"
            size="icon-nav"
            nativeButton={false}
            render={
              <Link to="/dashboard/settings" className="flex flex-col gap-1!">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-1.5 transition-colors",
                    checkActive({ pathname, url: "/dashboard/settings" }) &&
                      "bg-muted text-primary dark:bg-muted/50"
                  )}>
                  <SettingsIcon className="size-6" />
                </div>
                <p
                  className={cn(
                    "text-muted-foreground text-xs font-normal transition-colors",
                    checkActive({ pathname, url: "/dashboard/settings" }) &&
                      "text-foreground font-medium"
                  )}>
                  Settings
                </p>
              </Link>
            }></Button>
        </div>
      </div>
    </nav>
  );
}

function NavDrawer({
  pathname,
  setActiveModal,
}: {
  pathname: string;
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModal>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingModal, setPendingModal] = useState(false);

  function closeDrawer() {
    setIsOpen(false);
  }

  const isActive = checkActive({ pathname, url: "/dashboard/add", name: "Add" });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost-no-events" size="icon-nav" className="flex flex-col gap-1!">
          <div
            className={cn(
              "bg-foreground text-background flex items-center justify-center rounded-full p-2 transition-colors",
              isActive && "bg-muted text-primary dark:bg-muted/50"
            )}>
            <PlusIcon className="size-6" />
          </div>
          <p
            className={cn(
              "text-muted-foreground text-xs font-normal transition-colors",
              isActive && "text-foreground font-medium"
            )}>
            Add
          </p>
        </Button>
      </DrawerTrigger>
      <DrawerContent className={cn(pendingModal && "data-vaul-drawer:animation-duration-250!")}>
        <DrawerHeader>
          <DrawerTitle>Add</DrawerTitle>
          <DrawerDescription>Select what to add.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3 p-4">
          <Button
            variant="secondary"
            nativeButton={false}
            onClick={closeDrawer}
            render={<Link to="/dashboard/add/bookmark">Bookmark</Link>}></Button>
          <Button
            variant="secondary"
            nativeButton={false}
            onClick={closeDrawer}
            render={<Link to="/dashboard/add/folder">Folder</Link>}></Button>
          <Button
            variant="secondary"
            onClick={() => {
              setPendingModal(true);
              closeDrawer();
              setTimeout(() => {
                setActiveModal("tag-form");
                setPendingModal(false);
              }, 300);
            }}>
            Tag
          </Button>
        </div>
        <DrawerFooter className="mb-4">
          <DrawerClose className={cn(buttonVariants({ variant: "default", size: "default" }))}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
