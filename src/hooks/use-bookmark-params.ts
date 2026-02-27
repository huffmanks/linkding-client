import { useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import type { Route as DashboardRoute } from "@/routes/(protected)/dashboard";
import type { Route as FolderRoute } from "@/routes/(protected)/dashboard/folders/$id";
import type { Route as TagRoute } from "@/routes/(protected)/dashboard/tags/$tagName";

import {
  type FilterKey,
  type SortField,
  type SortOrder,
  parseBoolParam,
} from "@/components/blocks/bookmark/bookmark-utils";

type Route = typeof DashboardRoute | typeof FolderRoute | typeof TagRoute;

export function useBookmarkParams(route: Route) {
  const search = route.useSearch();
  const navigate = useNavigate({ from: route.fullPath });

  const filters = useMemo(
    () => ({
      all: parseBoolParam(search.all),
      is_archived: parseBoolParam(search.archived),
      unread: parseBoolParam(search.unread),
      shared: parseBoolParam(search.shared),
    }),
    [search.all, search.archived, search.unread, search.shared]
  );

  function parseSortOrder(order?: string): SortOrder {
    return order === "desc" ? "desc" : "asc";
  }

  const sort = useMemo(() => {
    if (!search.sort) return undefined;
    return { field: search.sort as SortField, order: parseSortOrder(search.order) };
  }, [search.sort, search.order]);

  const setSort = useCallback(
    (field?: SortField) => {
      if (!field) return;

      navigate({
        search: (prev) => {
          const isSameField = prev.sort === field;
          const currentOrder = parseSortOrder(prev.order);

          const nextOrder = isSameField ? (currentOrder === "asc" ? "desc" : "asc") : "asc";

          return {
            ...prev,
            sort: field,
            order: nextOrder,
            offset: 0,
          };
        },
      });
    },
    [navigate]
  );

  const setFilter = useCallback(
    (keyOrUpdates: FilterKey | Record<string, boolean | undefined>, value?: boolean) => {
      function mapSingle(k: FilterKey, v?: boolean) {
        let paramName: string;
        let paramValue: boolean | undefined = v;

        switch (k) {
          case "all":
            paramName = "all";
            break;
          case "read":
          case "unread":
            paramName = "unread";
            if (k === "read") paramValue = v == null ? undefined : false;
            break;
          case "shared":
          case "private":
            paramName = "shared";
            if (k === "private") paramValue = v == null ? undefined : false;
            break;
          case "archived":
          case "active":
            paramName = "archived";
            if (k === "active") paramValue = v == null ? undefined : false;
            break;
          default:
            paramName = k as string;
        }
        return { paramName, paramValue } as const;
      }

      if (typeof keyOrUpdates === "object" && !Array.isArray(keyOrUpdates)) {
        const updates: Record<string, boolean | undefined> = {};
        for (const [k, v] of Object.entries(keyOrUpdates)) {
          const { paramName, paramValue } = mapSingle(k as FilterKey, v as boolean | undefined);
          updates[paramName] = paramValue;
        }

        navigate({
          search: (prev: Record<string, unknown>) => ({
            ...prev,
            ...updates,
            offset: 0,
          }),
        });

        return;
      }

      const { paramName, paramValue } = mapSingle(keyOrUpdates as FilterKey, value);
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          [paramName]: paramValue == null ? undefined : paramValue,
          offset: 0,
        }),
      });
    },
    [navigate]
  );
  return { filters, sort, setSort, setFilter };
}
