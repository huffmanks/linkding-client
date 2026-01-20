import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSettingsStore } from "@/lib/store";

export async function linkdingFetch<T>(
  endpoint: string,
  { params, ...options }: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const baseUrl = "/api";
  const { token } = useSettingsStore.getState();

  const path = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
  let url = `${baseUrl}/${path}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

interface CreateBookmarkInput {
  url: string;
  title: string;
  description: string;
  notes: string;
  is_archived: boolean;
  unread: boolean;
  shared: boolean;
  tag_names: string[];
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBookmark: CreateBookmarkInput) =>
      linkdingFetch("bookmarks", {
        method: "POST",
        body: JSON.stringify(newBookmark),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

interface CreateFolderInput {
  name: string;
  search: string;
  any_tags: string;
  all_tags: string;
  excluded_tags: string;
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newFolder: CreateFolderInput) =>
      linkdingFetch("bundles", {
        method: "POST",
        body: JSON.stringify(newFolder),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    },
  });
}

interface CreateTagInput {
  name: string;
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTag: CreateTagInput) =>
      linkdingFetch("tags", {
        method: "POST",
        body: JSON.stringify(newTag),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
