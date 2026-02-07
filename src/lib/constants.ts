import {
  BookmarkIcon,
  FolderIcon,
  HashIcon,
  PlusIcon,
  SettingsIcon,
  ShieldUserIcon,
} from "lucide-react";

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
        url: "/dashboard/add/bookmark",
        isActive: false,
      },
      {
        name: "Folder",
        url: "/dashboard/add/folder",
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
    url: "/admin",
    isActive: false,
    isExternal: true,
    icon: ShieldUserIcon,
  },
  {
    name: "Web UI",
    url: "bookmarks",
    isActive: false,
    isExternal: true,
    icon: LinkdingIcon,
  },
] as SidebarNavItem[];

export const DRAWER_MOBILE_NAV = [
  {
    name: "Bookmarks",
    url: "/dashboard",
    isActive: false,
    icon: BookmarkIcon,
  },
  {
    name: "Folders",
    url: "/dashboard/folders",
    isActive: false,
    icon: FolderIcon,
  },
  {
    name: "Add",
    url: "/dashboard/add",
    isActive: false,
    icon: PlusIcon,
  },
  {
    name: "Tags",
    url: "/dashboard/tags",
    isActive: false,
    icon: HashIcon,
  },
  {
    name: "Settings",
    url: "/dashboard/settings",
    isActive: false,
    icon: SettingsIcon,
  },
] as SidebarNavItem[];
