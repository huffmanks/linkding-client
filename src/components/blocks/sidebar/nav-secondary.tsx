import * as React from "react";

import { Link } from "@tanstack/react-router";

import type { SidebarNavItem } from "@/types";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: SidebarNavItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile, setOpenMobile } = useSidebar();

  function handleCloseSidebar(isExternal: boolean) {
    if (isExternal || !isMobile) return;

    setOpenMobile(false);
  }
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.slice(0, 1).map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                size="sm"
                render={
                  <Link
                    to={item.url}
                    target={item.isExternal ? "_blank" : "_self"}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => handleCloseSidebar(!!item.isExternal)}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                }></SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      <SidebarSeparator className="my-2" />
      <SidebarGroupContent>
        <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-normal tracking-wide uppercase">
          Linkding
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.slice(1).map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                size="sm"
                render={
                  <Link
                    to={item.url}
                    target={item.isExternal ? "_blank" : "_self"}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => handleCloseSidebar(!!item.isExternal)}>
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
