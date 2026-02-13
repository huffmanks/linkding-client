import { type QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { linkdingFetch } from "@/lib/api";
import { db } from "@/lib/db";
import { useBackgroundSync } from "@/providers/background-sync";

const generateTempId = () => `temp-${crypto.randomUUID()}`;

interface BaseEntity {
  [key: string]: any;
}

interface OfflineMutationOptions<TVariables> {
  queryKey: string[];
  url: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  updateLocalCache?: (oldData: any, newVariables: TVariables) => any;
  idField?: string;
}

type OfflineResult<T = unknown> = { offline: true } | T;

export function useOfflineMutation<
  TVariables extends BaseEntity | string | number,
  TResult = unknown,
>(options: OfflineMutationOptions<TVariables>) {
  const queryClient = useQueryClient();
  const { isOnline } = useBackgroundSync();
  const { idField = "id" } = options;

  return useMutation<
    OfflineResult<TResult>,
    unknown,
    TVariables,
    {
      previousData: [QueryKey, unknown][];
    }
  >({
    mutationFn: async (variables: TVariables) => {
      let resourcePath = options.url;
      const idValue =
        typeof variables === "object" && variables !== null
          ? (variables as BaseEntity)[idField]
          : variables;

      if (["PUT", "PATCH", "DELETE"].includes(options.method) && idValue) {
        resourcePath = resourcePath.endsWith("/")
          ? `${resourcePath}${idValue}`
          : `${resourcePath}/${idValue}`;
      }

      try {
        if (!isOnline) {
          await db.outbox.add({
            resourcePath,
            method: options.method,
            body: variables,
            timestamp: Date.now(),
          });
          return { offline: true };
        }

        return await linkdingFetch(resourcePath, {
          method: options.method,
          body: JSON.stringify(variables),
        });
      } catch (error) {
        if (!isOnline || (error instanceof Error && error.name === "AbortError")) {
          await db.outbox.add({
            resourcePath,
            method: options.method,
            body: variables,
            timestamp: Date.now(),
          });
        }
        return { offline: true };
      }
    },
    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey });
      const previousData = queryClient.getQueriesData({
        queryKey: options.queryKey,
      });

      const updateEntityDetails = (vars: BaseEntity) => {
        const id = vars[idField];
        if (!id) return;

        const rootKey = options.queryKey[0];

        queryClient.setQueriesData(
          {
            predicate: (query) => {
              const key = query.queryKey;

              return (
                Array.isArray(key) &&
                key[0] === rootKey &&
                key.length === 2 &&
                typeof key[1] !== "object" &&
                String(key[1]) === String(id)
              );
            },
          },
          (old: any) => (old ? { ...old, ...vars } : old)
        );
      };

      const updater = (old: any) => {
        if (!old) return old;

        if (options.method === "DELETE") {
          const targetId =
            typeof newVariables === "object" && newVariables !== null
              ? (newVariables as BaseEntity)[idField]
              : newVariables;

          if (Array.isArray(old)) {
            return old.filter((item) => item[idField] !== targetId);
          }

          return {
            ...old,
            count: old.count ? old.count - 1 : 0,
            results: old.results?.filter((item: any) => item[idField] !== targetId),
          };
        }

        if (options.method === "POST") {
          const newItem = {
            ...(newVariables as object),
            [idField]: generateTempId(),
            _isPending: true,
          };

          if (Array.isArray(old)) {
            return [newItem, ...old];
          }

          return {
            ...old,
            count: (old.count || 0) + 1,
            results: [newItem, ...(old.results || [])],
          };
        }

        if (options.method === "PUT" || options.method === "PATCH") {
          const vars = newVariables as BaseEntity;
          const updateFn = (item: any) =>
            item[idField] === vars[idField] ? { ...item, ...vars } : item;

          if (Array.isArray(old)) {
            return old.map(updateFn);
          }

          updateEntityDetails(vars);

          return {
            ...old,
            results: old.results?.map(updateFn),
          };
        }

        return old;
      };

      queryClient.setQueriesData({ queryKey: options.queryKey, exact: false }, updater);

      return { previousData };
    },
    onError: (_err, _var, context) => {
      if (context?.previousData) {
        context?.previousData?.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSuccess: (result: OfflineResult<TResult>, variables: TVariables) => {
      if ((result as any)?.offline) return;

      queryClient.setQueriesData({ queryKey: options.queryKey, exact: false }, (old: any) => {
        if (!old) return old;

        if (Array.isArray(old)) {
          return old.map((item) =>
            item[idField] === (variables as any)[idField] &&
            (variables as any)[idField]?.startsWith("temp-")
              ? { ...item, ...result }
              : item
          );
        }

        return {
          ...old,
          results: old.results?.map((item: any) =>
            item[idField] === (variables as any)[idField] &&
            (variables as any)[idField]?.startsWith("temp-")
              ? { ...item, ...result }
              : item
          ),
        };
      });
    },
    onSettled: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: options.queryKey });
      }
    },
  });
}
