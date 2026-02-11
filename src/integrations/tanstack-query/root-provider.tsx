import { useState } from "react";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

import { DEFAULT_TTL } from "@/lib/constants";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode: "offlineFirst",
        staleTime: 0,
        gcTime: DEFAULT_TTL,
        refetchOnWindowFocus: true,
        retry: (failureCount, error: any) => {
          if (error.status === 404 || error.message?.includes("404")) return false;
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

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  const [isRestored, setIsRestored] = useState(false);

  if (!isRestored) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: DEFAULT_TTL,
        buster: "v1.0.0",
      }}
      onSuccess={() => setIsRestored(true)}>
      {children}
    </PersistQueryClientProvider>
  );
}
