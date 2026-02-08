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
  q?: string;
  offset?: number;
  bundle?: string;
};

export type TableList = {
  offset?: number;
};

export type Bookmark = BookmarkInsert & {
  id: number;
  web_archive_snapshot_url: string | null;
  favicon_url: string | null;
  preview_image_url: string | null;
  date_added: string;
  date_modified: string;
  website_title: string | null;
  website_description: string | null;
};

export type BookmarkInsert = {
  url: string;
  title: string;
  description: string;
  notes: string;
  is_archived: boolean;
  unread: boolean;
  shared: boolean;
  tag_names: string[];
};

export type Asset = {
  id: number;
  bookmark: number;
  date_created: string;
  file_size: number;
  asset_type: string;
  content_type: string;
  display_name: string;
  status: string;
};

export type Tag = TagInsert & {
  id: number;
  date_added: string;
};

export type TagInsert = {
  name: string;
};

export type Folder = FolderInsert & {
  id: number;
  order: number;
  date_created: string;
  date_modified: string;
};

export type FolderInsert = {
  name: string;
  search: string;
  any_tags: string;
  all_tags: string;
  excluded_tags: string;
};
