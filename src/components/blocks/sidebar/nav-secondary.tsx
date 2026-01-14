import * as React from "react";

import { Link } from "@tanstack/react-router";

import type { SidebarLinkItem } from "@/types";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: SidebarLinkItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                size="sm"
                render={
                  <Link
                    to={item.url}
                    target={item.isExternal ? "_blank" : "_self"}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                }></SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
