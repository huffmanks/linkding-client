import { StrictMode } from "react";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import * as TanStackQueryProvider from "@/integrations/tanstack-query/root-provider.tsx";
import reportWebVitals from "@/reportWebVitals.ts";
import { routeTree } from "@/routeTree.gen";
import "@/styles.css";

import { ThemeProvider } from "@/components/theme-provider.tsx";

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>
  );
}

reportWebVitals();
