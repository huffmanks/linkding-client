import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  name: string;
  url?: string;
  icon: LucideIcon;
  isActive: boolean;
  isExternal?: boolean;
  isCollapsible?: boolean;
  items?: SidebarSubNavItem[];
}

export interface SidebarSubNavItem {
  name: string;
  url?: string;
  isActive: boolean;
  isModal?: boolean;
}

export type View = "table" | "list" | "grid";
export type Theme = "light" | "dark" | "system";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type BookmarkSearch = {
  offset?: number;
};

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  description: string | null;
  notes: string | "";
  web_archive_snapshot_url: string | null;
  favicon_url: string | null;
  preview_image_url: string | null;
  is_archived: boolean;
  unread: boolean;
  shared: boolean;
  tag_names: string[] | [];
  date_added: string;
  date_modified: string;
  website_title: string | null;
  website_description: string | null;
}

export interface Asset {
  id: number;
  bookmark: number;
  date_created: string;
  file_size: number;
  asset_type: string;
  content_type: string;
  display_name: string;
  status: string;
}

export interface Tag {
  id: number;
  name: string;
  date_added: string;
}

export interface Bundle {
  id: number;
  name: string;
  search: string;
  any_tags: string;
  all_tags: string;
  excluded_tags: string;
  order: number;
  date_created: string;
  date_modified: string;
}

export interface UserProfile {
  theme: "auto" | "light" | "dark";
  bookmark_date_display: "relative" | "absolute" | "hidden";
  bookmark_link_target: "_blank" | "_self";
  web_archive_integration: "disabled" | "enabled";
  tag_search: "lax" | "strict";
  enable_sharing: boolean;
  enable_public_sharing: boolean;
  enable_favicons: boolean;
  display_url: boolean;
  permanent_notes: boolean;
  search_preferences: SearchPreferences;
  version: string;
}

export interface SearchPreferences {
  sort: "title_asc" | "title_desc";
  shared: "off" | "on";
  unread: "off" | "on";
}
