import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { URL, fileURLToPath } from "node:url";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      devtools(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      viteReact(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{css,html,js,json,webmanifest,ico,png,svg,otf,ttf,woff,woff2}"],
          navigateFallback: "/index.html",
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                url.pathname.startsWith("/favicons") ||
                url.pathname.startsWith("/media") ||
                url.pathname.startsWith("/static") ||
                url.pathname.startsWith("/previews"),
              handler: "CacheFirst",
              options: {
                cacheName: "linkding-assets",
                expiration: {
                  maxEntries: 5000,
                  maxAgeSeconds: 60 * 60 * 24 * 120,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/api"),
              handler: "NetworkFirst",
              options: {
                cacheName: "api-data-cache",
                expiration: {
                  maxEntries: 1000,
                  maxAgeSeconds: 60 * 60 * 24 * 120,
                },
                networkTimeoutSeconds: 3,
              },
            },
            {
              urlPattern: ({ request, url }) =>
                request.destination === "document" &&
                request.mode !== "navigate" &&
                (url.pathname.startsWith("/media") || url.pathname.startsWith("/static")),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "linkding-html-archives",
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 120,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: mode === "development",
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:9090",
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
