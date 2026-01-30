import z from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Theme, View } from "@/types";

export const TokenSchema = z
  .hash("sha1", { error: "API token is not valid." })
  .min(1, { error: "API token is required." });

export type Token = z.infer<typeof TokenSchema>;

type SettingsStoreState = {
  username: string | null;
  token: Token | null;
  view: View;
  theme: Theme;
  sidebarAddOpen: boolean;
  limit: number;
};

type SettingsStoreActions = {
  setUsername: (username: string | null) => void;
  setToken: (token: Token | null) => void;
  setView: (view: View) => void;
  setTheme: (theme: Theme) => void;
  setSidebarAddOpen: (sidebarAddOpen: boolean) => void;
  setLimit: (limit: number) => void;
  reset: () => void;
};

const initialSettingsStoreState: SettingsStoreState = {
  username: null,
  token: null,
  view: "grid",
  theme: "system",
  sidebarAddOpen: true,
  limit: 10,
};

export const useSettingsStore = create<SettingsStoreState & SettingsStoreActions>()(
  persist(
    (set) => ({
      ...initialSettingsStoreState,
      setUsername: (username) => set({ username }),
      setToken: (token) => set({ token }),
      setView: (view) => set({ view }),
      setTheme: (theme) => set({ theme }),
      setSidebarAddOpen: (sidebarAddOpen) => set({ sidebarAddOpen }),
      setLimit: (limit) => set({ limit }),
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
