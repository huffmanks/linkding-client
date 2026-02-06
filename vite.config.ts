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
    base: "/",
    build: {
      rollupOptions: {
        output: {
          assetFileNames: "app-assets/[name]-[hash][extname]",
          chunkFileNames: "app-assets/[name]-[hash].js",
          entryFileNames: "app-assets/[name]-[hash].js",
        },
      },
    },
    plugins: [
      devtools(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      viteReact(),
      tailwindcss(),
      VitePWA({
        disable: mode === "development",
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{css,html,js,json,webmanifest,ico,png,svg,otf,ttf,woff,woff2}"],
          navigateFallback: "/index.html",
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                /^\/(assets|favicons|media|previews|static)/.test(url.pathname),
              handler: "StaleWhileRevalidate",
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
              handler: "NetworkOnly",
              options: {
                backgroundSync: {
                  name: "api-retry",
                  options: { maxRetentionTime: 24 * 60 },
                },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/app-assets"),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "app-assets",
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
      }),
    ],
    server: {
      proxy: {
        "^/(api|favicons|media|previews|static)": {
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
