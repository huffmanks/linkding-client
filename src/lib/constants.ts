import { BookmarkIcon, PlusIcon, SettingsIcon, ShieldUserIcon } from "lucide-react";

import type { SidebarNavItem } from "@/types";

import LinkdingIcon from "@/components/linkding-icon";

export const APP_TITLE = "EchoLink";
export const APP_DESCRIPTION = "Self-hosted client app for Linkding.";

export const SIDEBAR_NAV_MAIN = [
  {
    name: "Add",
    isActive: false,
    icon: PlusIcon,
    isCollapsible: true,
    items: [
      {
        name: "Bookmark",
        url: "/dashboard/bookmarks/add",
        isActive: false,
      },
      {
        name: "Folder",
        url: "/dashboard/folders/add",
        isActive: false,
      },
      {
        name: "Tag",
        isActive: false,
        isModal: true,
      },
    ],
  },
  {
    name: "Bookmarks",
    url: "/dashboard",
    isActive: false,
    icon: BookmarkIcon,
  },
] as SidebarNavItem[];

export const SIDEBAR_NAV_SECONDARY = [
  {
    name: "Settings",
    url: "/dashboard/settings",
    isActive: false,
    isExternal: false,
    icon: SettingsIcon,
  },
  {
    name: "Admin",
    url: `${import.meta.env.VITE_LINKDING_URL}/admin`,
    isActive: false,
    isExternal: true,
    icon: ShieldUserIcon,
  },
  {
    name: "Web UI",
    url: `${import.meta.env.VITE_LINKDING_URL}/bookmarks`,
    isActive: false,
    isExternal: true,
    icon: LinkdingIcon,
  },
] as SidebarNavItem[];
