import { BookmarkIcon, SettingsIcon, ShieldUserIcon } from "lucide-react";

export const APP_TITLE = "EchoLink";
export const APP_DESCRIPTION = "Self-hosted client app for Linkding.";

export const LS_PREFIX = "echo_link";
export const LS_LINKDING_TOKEN = `${LS_PREFIX}_linkding_token`;
export const LS_LINKDING_USERNAME = `${LS_PREFIX}_username`;

export const SIDEBAR_ITEMS = {
  navMain: [
    {
      name: "Bookmarks",
      url: "/dashboard",
      icon: BookmarkIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
    {
      title: "Admin",
      url: `${import.meta.env.VITE_LINKDING_URL}/admin`,
      icon: ShieldUserIcon,
    },
  ],
};
