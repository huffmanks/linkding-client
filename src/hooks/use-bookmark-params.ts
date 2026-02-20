import { useCallback, useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import {
  type FilterKey,
  type SortField,
  type SortOrder,
  parseBoolParam,
} from "@/lib/bookmark-utils";
import type { Route } from "@/routes/(protected)/dashboard";

export function useBookmarkParams(route: typeof Route) {
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

  const sort = useMemo(() => {
    if (!search.sort) return undefined;
    return { field: search.sort as SortField, order: (search.order as SortOrder) ?? "asc" };
  }, [search.sort, search.order]);

  const setSort = useCallback(
    (field?: SortField, order?: SortOrder) => {
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          sort: field ?? undefined,
          order: order ?? undefined,
          offset: 0,
        }),
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
