import { createContext, useContext, useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { linkdingFetch } from "@/lib/api";
import { db } from "@/lib/db";
import type { CacheName } from "@/types";

interface BackgroundSyncContextType {
  isSyncing: boolean;
  isOnline: boolean;
  purgeAssets: (cacheName: CacheName) => void;
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

    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "SYNC_STARTING") setIsSyncing(true);

      if (event.data?.type === "OFFLINE_SYNC_COMPLETED") {
        setIsSyncing(false);

        toast.success("Offline changes synced successfully!");
        queryClient.invalidateQueries();
      }

      if (event.data?.type === "SYNC_FAILED") setIsSyncing(false);
    }

    async function flushOutbox() {
      if (!isOnline || isSyncing) return;

      const items = await db.outbox.orderBy("timestamp").toArray();
      if (items.length === 0) return;

      setIsSyncing(true);

      for (const item of items) {
        try {
          await linkdingFetch(item.url, {
            method: item.method,
            body: JSON.stringify(item.body),
          });

          await db.outbox.delete(item.id!);
        } catch (error) {
          toast.error("Syncing failed for:", { description: `${item}, ${error}` });
          break;
        }
      }

      await queryClient.invalidateQueries();
      setIsSyncing(false);
    }

    window.addEventListener("online", flushOutbox);
    navigator.serviceWorker.addEventListener("message", handleMessage);

    flushOutbox();

    return () => {
      window.removeEventListener("online", flushOutbox);
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [queryClient]);

  return (
    <BackgroundSyncContext.Provider value={{ isSyncing, isOnline, purgeAssets }}>
      {children}
    </BackgroundSyncContext.Provider>
  );
}

export const useBackgroundSync = () => {
  const context = useContext(BackgroundSyncContext);
  if (!context) throw new Error("useBackgroundSync must be used within BackgroundSyncProvider");
  return context;
};
