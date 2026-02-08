import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";

const gcTime = 1000 * 60 * 60 * 24 * 120; // 120 days

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        networkMode: "offlineFirst",
        staleTime: 0,
        gcTime,
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
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: gcTime,
        buster: "v1.0.0",
      }}>
      {children}
    </PersistQueryClientProvider>
  );
}
