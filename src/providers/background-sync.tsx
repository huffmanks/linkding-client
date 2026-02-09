import { createContext, useContext, useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useSettingsStore } from "@/lib/store";
import type { CacheName, SyncConfig, SyncConfigKey } from "@/types";

interface BackgroundSyncContextType {
  isSyncing: boolean;
  purgeAssets: (cacheName: CacheName) => void;
  updateTtl: (key: SyncConfigKey, value: number) => void;
}

const BackgroundSyncContext = createContext<BackgroundSyncContextType | undefined>(undefined);

export function BackgroundSyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  function purgeAssets(cacheName: CacheName) {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "PURGE_CACHE",
        cacheName,
      });

      toast.success("Caches cleared! Refreshing data...");
    }
  }

  function updateTtl(key: SyncConfigKey, value: number) {
    const configUpdate: SyncConfig = { [key]: value };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SYNC_CONFIG",
        config: configUpdate,
      });
    }
  }

  useEffect(() => {
    if (navigator.serviceWorker.controller) {
      const { cacheTtl } = useSettingsStore.getState();
      updateTtl("linkdingAssetsTtl", Number(cacheTtl));
      updateTtl("appAssetsTtl", Number(cacheTtl));

      toast.success("Cache TTL updated.");
    }
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_STARTING") setIsSyncing(true);

      if (event.data?.type === "OFFLINE_SYNC_COMPLETED") {
        setIsSyncing(false);

        toast.success("Offline changes synced successfully!");
        queryClient.invalidateQueries();
      }

      if (event.data?.type === "SYNC_FAILED") setIsSyncing(false);

      if (event.data?.type === "CACHE_PURGED") {
        toast.info(`Cache ${event.data.cacheName} cleared.`);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, [queryClient]);

  return (
    <BackgroundSyncContext.Provider value={{ isSyncing, purgeAssets, updateTtl }}>
      {children}
    </BackgroundSyncContext.Provider>
  );
}

export const useBackgroundSync = () => {
  const context = useContext(BackgroundSyncContext);
  if (!context) throw new Error("useBackgroundSync must be used within BackgroundSyncProvider");
  return context;
};
