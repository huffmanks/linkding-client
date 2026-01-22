import z from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Theme, View } from "@/types";

const TokenSchema = z
  .hash("sha1", { error: "API token is not valid." })
  .min(1, { error: "API token is required." });

type Token = z.infer<typeof TokenSchema>;

type SettingsStoreState = {
  username: string | null;
  view: View;
  theme: Theme;
  token: Token | null;
  limit: number;
};

type SettingsStoreActions = {
  setUsername: (username: string | null) => void;
  setView: (view: View) => void;
  setTheme: (theme: Theme) => void;
  setToken: (token: Token | null) => void;
  setLimit: (limit: number) => void;
  reset: () => void;
};

const initialSettingsStoreState: SettingsStoreState = {
  username: null,
  view: "grid",
  theme: "system",
  token: null,
  limit: 10,
};

export const useSettingsStore = create<SettingsStoreState & SettingsStoreActions>()(
  persist(
    (set) => ({
      ...initialSettingsStoreState,
      setUsername: (username) => set({ username }),
      setView: (view) => set({ view }),
      setTheme: (theme) => set({ theme }),
      setToken: (token) => set({ token }),
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
