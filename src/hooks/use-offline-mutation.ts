import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export function useOfflineMutation<TVariables extends BaseEntity | string | number>(
  options: OfflineMutationOptions<TVariables>
) {
  const queryClient = useQueryClient();
  const { isOnline } = useBackgroundSync();
  const { idField = "id" } = options;

  return useMutation({
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
    },

    onMutate: async (newVariables) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey });
      const previousData = queryClient.getQueryData(options.queryKey);

      queryClient.setQueryData(options.queryKey, (old: any) => {
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

          return {
            ...old,
            results: old.results?.map(updateFn),
          };
        }

        return old;
      });

      return { previousData };
    },

    onError: (_err, _var, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(options.queryKey, context.previousData);
      }
    },

    onSettled: () => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: options.queryKey });
      }
    },
  });
}
