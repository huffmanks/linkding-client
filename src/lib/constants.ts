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

export const DEFAULT_TTL = 60 * 60 * 24 * 90;

export const CACHE_TTL_OPTIONS = [
  { value: String(86400), label: "1 day" },
  { value: String(604800), label: "7 days" },
  { value: String(2592000), label: "30 days" },
  { value: String(DEFAULT_TTL), label: "90 days" },
];

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
    isCollapsible: true,
    icon: FolderIcon,
  },
  {
    name: "Add",
    url: "/dashboard/add",
    isActive: false,
    isCollapsible: true,
    icon: PlusIcon,
  },
  {
    name: "Tags",
    url: "/dashboard/tags",
    isActive: false,
    isCollapsible: true,
    icon: HashIcon,
  },
  {
    name: "Settings",
    url: "/dashboard/settings",
    isActive: false,
    icon: SettingsIcon,
  },
] as SidebarNavItem[];
