import z from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Theme, View } from "@/types";

export const TokenSchema = z
  .hash("sha1", { error: "API token is not valid." })
  .min(1, { error: "API token is required." });

export const UrlSchema = z
  .url({ error: "Url is not valid." })
  .min(1, { error: "Url is required." });

export type Token = z.infer<typeof TokenSchema>;
export type Url = z.infer<typeof UrlSchema>;

type SettingsStoreState = {
  username: string;
  linkdingUrl: Url;
  token: Token | null;
  view: View;
  theme: Theme;
  sidebarAddOpen: boolean;
  limit: number;
  archivedDefault: boolean;
  unreadDefault: boolean;
  sharedDefault: boolean;
  autoMarkRead: boolean;
  isAuthenticated: boolean;
};

type SettingsStoreActions = {
  setUsername: (username: string) => void;
  setLinkdingUrl: (linkdingUrl: Url) => void;
  setToken: (token: Token | null) => void;
  setView: (view: View) => void;
  setTheme: (theme: Theme) => void;
  setSidebarAddOpen: (sidebarAddOpen: boolean) => void;
  setLimit: (limit: number) => void;
  setArchivedDefault: (archivedDefault: boolean) => void;
  setUnreadDefault: (unreadDefault: boolean) => void;
  setSharedDefault: (sharedDefault: boolean) => void;
  setAutoMarkRead: (autoMarkRead: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  reset: () => void;
};

const initialSettingsStoreState: SettingsStoreState = {
  username: "admin",
  linkdingUrl: "http://localhost:9090",
  token: null,
  view: "grid",
  theme: "system",
  sidebarAddOpen: true,
  limit: 10,
  archivedDefault: false,
  unreadDefault: false,
  sharedDefault: false,
  autoMarkRead: true,
  isAuthenticated: false,
};

export const useSettingsStore = create<SettingsStoreState & SettingsStoreActions>()(
  persist(
    (set) => ({
      ...initialSettingsStoreState,
      setUsername: (username) => set({ username }),
      setLinkdingUrl: (linkdingUrl) => set({ linkdingUrl }),
      setToken: (token) => set({ token }),
      setView: (view) => set({ view }),
      setTheme: (theme) => set({ theme }),
      setSidebarAddOpen: (sidebarAddOpen) => set({ sidebarAddOpen }),
      setLimit: (limit) => set({ limit }),
      setArchivedDefault: (archivedDefault) => set({ archivedDefault }),
      setUnreadDefault: (unreadDefault) => set({ unreadDefault }),
      setSharedDefault: (sharedDefault) => set({ sharedDefault }),
      setAutoMarkRead: (autoMarkRead) => set({ autoMarkRead }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      reset: () => set(initialSettingsStoreState),
    }),
    {
      name: "settings-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function resetPersistedStorage() {
  useSettingsStore.persist.clearStorage();
  useSettingsStore.getState().reset();
}
