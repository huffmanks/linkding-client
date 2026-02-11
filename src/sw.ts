import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst, NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any };

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const DEFAULT_TTL = 60 * 60 * 24 * 90;

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "PURGE_CACHE") {
    event.waitUntil(caches.delete(event.data.cacheName));
    event.source?.postMessage({ type: "CACHE_PURGED" });
  }
});

const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigations",
  }),
  {
    denylist: [/^\/assets\/.*\.html$/],
  }
);
registerRoute(navigationRoute);

registerRoute(
  ({ url }) => /^\/(assets|favicons|media|previews|static)/.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: "linkding-assets",
    plugins: [new ExpirationPlugin({ maxEntries: 5000, maxAgeSeconds: DEFAULT_TTL })],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith("/app-assets"),
  new StaleWhileRevalidate({
    cacheName: "app-assets",
    plugins: [new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: DEFAULT_TTL })],
  })
);

registerRoute(
  ({ url, request }) => url.pathname.startsWith("/api") && request.method === "GET",
  new NetworkFirst({
    cacheName: "linkding-api-cache",
    plugins: [new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: DEFAULT_TTL })],
  })
);

registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith("/api") && ["POST", "PUT", "PATCH", "DELETE"].includes(request.method),
  new NetworkOnly()
);
