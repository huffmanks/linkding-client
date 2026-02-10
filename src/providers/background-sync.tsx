import { createContext, useContext, useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useSettingsStore } from "@/lib/store";
import type { CacheName, SyncConfig, SyncConfigKey } from "@/types";

interface BackgroundSyncContextType {
  isSyncing: boolean;
  isOnline: boolean;
  purgeAssets: (cacheName: CacheName) => void;
  updateTtl: (key: SyncConfigKey, value: number) => void;
}

const BackgroundSyncContext = createContext<BackgroundSyncContextType | undefined>(undefined);

export function BackgroundSyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();

  function purgeAssets(cacheName: CacheName) {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "PURGE_CACHE",
        cacheName,
      });
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
    const updateStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
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
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, [queryClient]);

  return (
    <BackgroundSyncContext.Provider value={{ isSyncing, isOnline, purgeAssets, updateTtl }}>
      {children}
    </BackgroundSyncContext.Provider>
  );
}

export const useBackgroundSync = () => {
  const context = useContext(BackgroundSyncContext);
  if (!context) throw new Error("useBackgroundSync must be used within BackgroundSyncProvider");
  return context;
};
