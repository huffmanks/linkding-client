"use client";

import { useEffect, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRightIcon, FolderIcon, HashIcon } from "lucide-react";

import { SIDEBAR_NAV_MAIN } from "@/lib/constants";
import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import type { SidebarNavItem, SidebarSubNavItem } from "@/types";

import type { ActiveModal } from "@/components/blocks/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavMainProps {
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModal>>;
}

export function NavMain({ setActiveModal }: NavMainProps) {
  const { data: folders } = useSuspenseQuery(getAllQueryOptions.folders);
  const { data: tags } = useSuspenseQuery(getAllQueryOptions.tags);

  const { isMobile, setOpenMobile } = useSidebar();
  const { pathname } = useLocation();

  const checkActive = (url?: string, name?: string) =>
    (!!url && pathname === url) || (!!url && pathname === "/dashobard" && name === "Bookmarks");

  const folderItems =
    folders?.results?.map((item) => {
      const url = `/dashboard/folders/${item.id}`;

      return {
        name: item.name,
        url,
        isActive: checkActive(url),
      };
    }) || [];

  const tagItems =
    tags?.results?.map((item) => {
      const url = `/dashboard/tags/${item.name}`;
      return {
        name: item.name,
        url,
        isActive: checkActive(url),
      };
    }) || [];

  const items = [
    ...SIDEBAR_NAV_MAIN.map((item) => {
      const subItems =
        item.items?.map((sub) => ({
          ...sub,
          isActive: checkActive(sub.url),
        })) || [];

      return {
        ...item,
        isActive: checkActive(item.url),
        items: subItems,
      };
    }),
    {
      name: "Folders",
      icon: FolderIcon,
      isActive: folderItems.some((folder) => folder.isActive),
      isCollapsible: true,
      items: folderItems,
    },
    {
      name: "Tags",
      icon: HashIcon,
      isActive: tagItems.some((tag) => tag.isActive),
      isCollapsible: true,
      items: tagItems,
    },
  ] as SidebarNavItem[];

  function handleCloseSidebar() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="sr-only">Items</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item?.url ? (
            <NavLinkItem key={item.name} item={item} handleCloseSidebar={handleCloseSidebar} />
          ) : item?.isCollapsible ? (
            <NavCollapsibleItem
              key={item.name}
              item={item}
              handleCloseSidebar={handleCloseSidebar}
              setActiveModal={setActiveModal}
            />
          ) : null
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavLinkItem({
  item,
  handleCloseSidebar,
}: {
  item: SidebarNavItem;
  handleCloseSidebar: () => void;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={item.isActive}
        render={
          <Link to={item.url} onClick={handleCloseSidebar}>
            <item.icon />
            <span>{item.name}</span>
          </Link>
        }></SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SubNavItems({
  items = [],
  handleCloseSidebar,
  setActiveModal,
}: {
  items?: SidebarSubNavItem[];
  handleCloseSidebar: () => void;
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModal>>;
}) {
  function handleClick() {
    handleCloseSidebar();
    setActiveModal("tag-form");
  }
  return (
    <>
      {items.map((subItem) => (
        <SidebarMenuSubItem key={subItem.name}>
          {subItem.isModal ? (
            <SidebarMenuSubButton className="cursor-pointer" onClick={handleClick}>
              {subItem.name}
            </SidebarMenuSubButton>
          ) : (
            <SidebarMenuSubButton
              isActive={subItem.isActive}
              render={
                <Link to={subItem.url} onClick={handleCloseSidebar}>
                  <span>{subItem.name}</span>
                </Link>
              }></SidebarMenuSubButton>
          )}
        </SidebarMenuSubItem>
      ))}
    </>
  );
}

function NavCollapsibleItem({
  item,
  handleCloseSidebar,
  setActiveModal,
}: {
  item: SidebarNavItem;
  handleCloseSidebar: () => void;
  setActiveModal: React.Dispatch<React.SetStateAction<ActiveModal>>;
}) {
  const sidebarAddOpen = useSettingsStore((state) => state.sidebarAddOpen);
  const isAdd = item.name === "Add";
  const [isOpen, setIsOpen] = useState(isAdd ? sidebarAddOpen : item.isActive);

  useEffect(() => {
    if (isAdd) {
      setIsOpen(sidebarAddOpen);
    }
  }, [sidebarAddOpen, isAdd]);

  const hasItems = !!item.items?.length;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      render={
        <SidebarMenuItem>
          <CollapsibleTrigger
            disabled={!hasItems}
            nativeButton={false}
            render={
              <SidebarMenuAction
                className="group relative top-0 right-0 flex aspect-auto h-8 w-full items-center justify-between gap-2 p-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0"
                render={
                  <div>
                    <span className="flex items-center gap-2 text-sm">
                      <item.icon />
                      <span>{item.name}</span>
                    </span>
                    {hasItems && (
                      <ChevronRightIcon
                        aria-label="toggle"
                        className="transition-transform group-data-panel-open:rotate-90"
                      />
                    )}
                  </div>
                }></SidebarMenuAction>
            }></CollapsibleTrigger>

          {hasItems ? (
            <>
              <CollapsibleContent className="py-2">
                <SidebarMenuSub className="scrollbar max-h-48 overflow-y-auto">
                  <SubNavItems
                    items={item.items}
                    handleCloseSidebar={handleCloseSidebar}
                    setActiveModal={setActiveModal}
                  />
                </SidebarMenuSub>
              </CollapsibleContent>
            </>
          ) : null}
        </SidebarMenuItem>
      }></Collapsible>
  );
}
