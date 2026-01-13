"use client";

import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

import type { NavItem, SidebarLinkItem, SidebarParentItem } from "@/types";

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
} from "@/components/ui/sidebar";

import AddMenu from "./add-menu";

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="sr-only">Items</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <AddMenu />
        </SidebarMenuItem>
        {items.map((item) => {
          if ("url" in item) {
            return <NavLinkItem key={item.name} item={item} />;
          }
          return <NavParentItem key={item.name} item={item} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavLinkItem({ item }: { item: SidebarLinkItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={
          <Link to={item.url}>
            <item.icon />
            <span>{item.name}</span>
          </Link>
        }></SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavParentItem({ item }: { item: SidebarParentItem }) {
  const hasItems = item.items !== null && item.items?.length > 0;

  return (
    <Collapsible
      defaultOpen={item.isActive}
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
                  {item.items!.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.name}>
                      <SidebarMenuSubButton
                        render={
                          <Link to={subItem.url}>
                            <span>{subItem.name}</span>
                          </Link>
                        }></SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </>
          ) : null}
        </SidebarMenuItem>
      }></Collapsible>
  );
}
