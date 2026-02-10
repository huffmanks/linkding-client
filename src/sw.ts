import { BackgroundSyncPlugin } from "workbox-background-sync";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

import type { SyncConfig, SyncConfigKey } from "./types";

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any };

precacheAndRoute(self.__WB_MANIFEST);

const DEFAULT_TTL = 60 * 60 * 24 * 90;

let CONFIG: SyncConfig = {
  linkdingAssetsTtl: DEFAULT_TTL,
  appAssetsTtl: DEFAULT_TTL,
};

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data?.type === "SYNC_CONFIG") {
    CONFIG = { ...CONFIG, ...event.data.config };
  }

  if (event.data?.type === "PURGE_CACHE") {
    event.waitUntil(caches.delete(event.data.cacheName));
    event.source?.postMessage({ type: "CACHE_PURGED" });
  }
});

const createDynamicExpirationPlugin = (configKey: SyncConfigKey) => ({
  cachedResponseWillBeUsed: async ({ cachedResponse }: any) => {
    if (!cachedResponse) return undefined;

    const dateHeader = cachedResponse.headers.get("date");
    if (dateHeader) {
      const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;

      const maxAge = CONFIG[configKey] ?? DEFAULT_TTL;

      if (age > maxAge) {
        return undefined;
      }
    }
    return cachedResponse;
  },
});

registerRoute(
  ({ url }) => /^\/(assets|favicons|media|previews|static)/.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: "linkding-assets",
    plugins: [
      createDynamicExpirationPlugin("linkdingAssetsTtl"),
      new ExpirationPlugin({ maxEntries: 5000 }),
    ],
  })
);

registerRoute(
  ({ url, request }) => url.pathname.startsWith("/api") && request.method === "GET",
  new NetworkFirst({
    cacheName: "linkding-api-get",
    plugins: [
      createDynamicExpirationPlugin("linkdingAssetsTtl"),
      new ExpirationPlugin({ maxEntries: 500 }),
      {
        handlerDidError: async () => {
          return new Response(JSON.stringify({ offline: true }), {
            headers: { "Content-Type": "application/json" },
          });
        },
      },
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/app-assets"),
  new StaleWhileRevalidate({
    cacheName: "app-assets",
    plugins: [
      createDynamicExpirationPlugin("appAssetsTtl"),
      new ExpirationPlugin({ maxEntries: 500 }),
    ],
  })
);

const bgSyncPlugin = new BackgroundSyncPlugin("api-retry-queue", {
  maxRetentionTime: 24 * 60,
  onSync: async ({ queue }) => {
    const clients = await self.clients.matchAll();

    clients.forEach((c) => c.postMessage({ type: "SYNC_STARTING" }));

    try {
      await queue.replayRequests();
      clients.forEach((c) => c.postMessage({ type: "OFFLINE_SYNC_COMPLETED" }));
    } catch (e) {
      clients.forEach((c) => c.postMessage({ type: "SYNC_FAILED" }));
    }
  },
});

registerRoute(
  ({ url, request }) => {
    return (
      url.pathname.startsWith("/api") && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method)
    );
  },
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  })
);
