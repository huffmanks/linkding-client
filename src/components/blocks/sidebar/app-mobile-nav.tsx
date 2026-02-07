import { useMemo, useState } from "react";

import { Link, useLocation } from "@tanstack/react-router";

import { DRAWER_MOBILE_NAV } from "@/lib/constants";
import { checkActive, cn } from "@/lib/utils";
import { useGlobalModal } from "@/providers/global-modal-context";
import type { SidebarNavItem } from "@/types";

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

export default function AppMobileNav() {
  const { pathname } = useLocation();

  const items = useMemo(() => {
    return DRAWER_MOBILE_NAV.map((item) => {
      const newItem = { ...item };

      return {
        ...newItem,
        isActive: checkActive({ pathname, url: newItem.url, name: newItem.name }),
      };
    });
  }, [pathname]);

  return (
    <nav className="bg-background/60 fixed right-0 bottom-0 left-0 z-50 h-26 rounded-b-xl border-t pb-10 backdrop-blur-md">
      <div className="h-18 px-3 pt-4">
        <div className="flex w-full items-center gap-4">
          {items.map((item) => {
            if (item.name === "Add") {
              return <NavDrawer key={item.name} item={item} />;
            }

            return (
              <Button
                key={item.url}
                variant="ghost-no-events"
                size="icon-nav"
                nativeButton={false}
                render={
                  <Link to={item.url} className="flex flex-col gap-1!">
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-full p-1.5 transition-colors",
                        item.isActive && "bg-muted text-primary dark:bg-muted/50"
                      )}>
                      <item.icon className="size-6" />
                    </div>
                    <p
                      className={cn(
                        "text-muted-foreground text-xs font-normal transition-colors",
                        item.isActive && "text-foreground font-medium"
                      )}>
                      {item.name}
                    </p>
                  </Link>
                }></Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function NavDrawer({ item }: { item: SidebarNavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingModal, setPendingModal] = useState(false);

  const { setActiveGlobalModal } = useGlobalModal();

  function closeDrawer() {
    setIsOpen(false);
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost-no-events" size="icon-nav" className="flex flex-col gap-1!">
          <div
            className={cn(
              "bg-foreground text-background flex items-center justify-center rounded-full p-2 transition-colors",
              item.isActive && "bg-muted text-primary dark:bg-muted/50"
            )}>
            <item.icon className="size-6" />
          </div>
          <p
            className={cn(
              "text-muted-foreground text-xs font-normal transition-colors",
              item.isActive && "text-foreground font-medium"
            )}>
            {item.name}
          </p>
        </Button>
      </DrawerTrigger>
      <DrawerContent className={cn(pendingModal && "data-vaul-drawer:animation-duration-250!")}>
        <DrawerHeader>
          <DrawerTitle>{item.name}</DrawerTitle>
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
                setActiveGlobalModal("tag-form");
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
