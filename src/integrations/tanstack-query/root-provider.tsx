import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, useIsRestoring } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

import { DEFAULT_TTL } from "@/lib/constants";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        networkMode: "always",
      },
      queries: {
        networkMode: "offlineFirst",
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: DEFAULT_TTL,
        retry: (failureCount, error: any) => {
          if (error.status === 404 || error.message?.includes("404")) return false;
          if (!navigator.onLine) return false;
          return failureCount < 3;
        },
      },
    },
  });
  return {
    queryClient,
  };
}

const persister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => get(key),
    setItem: (key, value) => set(key, value),
    removeItem: (key) => del(key),
  },
});

function LoadingGate({ children }: { children: React.ReactNode }) {
  const isRestoring = useIsRestoring();

  if (isRestoring) return null;
  return <>{children}</>;
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: DEFAULT_TTL,
        buster: "v1.0.0",
      }}>
      <LoadingGate>{children}</LoadingGate>
    </PersistQueryClientProvider>
  );
}
