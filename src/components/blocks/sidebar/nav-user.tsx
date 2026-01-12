"use client";

import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { getUsername, logout } from "@/lib/auth";

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

  const username = getUsername();
  const initial = username.charAt(0).toUpperCase();

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
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
