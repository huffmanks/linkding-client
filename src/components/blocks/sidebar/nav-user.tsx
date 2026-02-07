import * as React from "react";

import { Link, useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { logout } from "@/lib/auth";
import { SIDEBAR_NAV_SECONDARY } from "@/lib/constants";
import { useSettingsStore } from "@/lib/store";
import { joinUrlPath } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavUser() {
  const navigate = useNavigate();
  const { linkdingUrl, username } = useSettingsStore(
    useShallow((state) => ({
      linkdingUrl: state.linkdingUrl,
      username: state.username,
    }))
  );
  const initial = username ? username.charAt(0).toUpperCase() : "E";

  const items = React.useMemo(() => {
    return SIDEBAR_NAV_SECONDARY.map((item) => {
      const newItem = { ...item };

      if (!linkdingUrl) return newItem;

      if (newItem.isExternal) {
        newItem.url = joinUrlPath(linkdingUrl, newItem.url || null);
      }

      return newItem;
    });
  }, [linkdingUrl]);

  function handleLogout() {
    logout();

    navigate({ to: "/" });
  }

  return (
    <SidebarMenu className="w-auto">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="cursor-pointer"
            render={
              <SidebarMenuButton
                size="default"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-auto p-0">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{initial}</AvatarFallback>
                </Avatar>
              </SidebarMenuButton>
            }></DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{initial}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{username}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {items.slice(0, 1).map((item) => (
                <DropdownMenuItem
                  key={item.url}
                  className="cursor-pointer"
                  nativeButton={false}
                  render={
                    <Link
                      to={item.url}
                      target={item.isExternal ? "_blank" : "_self"}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  }></DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal tracking-wide uppercase">
                Linkding
              </DropdownMenuLabel>
              {items.slice(1).map((item) => (
                <DropdownMenuItem
                  key={item.url}
                  className="cursor-pointer"
                  nativeButton={false}
                  render={
                    <Link
                      to={item.url}
                      target={item.isExternal ? "_blank" : "_self"}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  }></DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOutIcon />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
