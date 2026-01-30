import * as React from "react";

import { Link } from "@tanstack/react-router";

import { SIDEBAR_NAV_SECONDARY } from "@/lib/constants";
import { useSettingsStore } from "@/lib/store";
import { joinUrlPath } from "@/lib/utils";

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
  ...props
}: {} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile, setOpenMobile } = useSidebar();
  const linkdingUrl = useSettingsStore((state) => state.linkdingUrl);

  const items = React.useMemo(() => {
    return SIDEBAR_NAV_SECONDARY.map((item) => {
      const newItem = { ...item };
      if (!!linkdingUrl && (newItem.name === "Admin" || newItem.name === "Web UI")) {
        newItem.url = joinUrlPath(linkdingUrl, newItem.url || null);
      }
      return newItem;
    });
  }, [linkdingUrl]);

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
