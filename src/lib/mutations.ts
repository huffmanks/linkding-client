import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { linkdingFetch } from "@/lib/api";
import { useSettingsStore } from "@/lib/store";
import type { Bookmark, BookmarkInsert, Folder, FolderInsert, TagInsert } from "@/types";

export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBookmark: BookmarkInsert): Promise<Bookmark> =>
      await linkdingFetch("bookmarks", {
        method: "POST",
        body: JSON.stringify(newBookmark),
      }),
    onError: async (err) => {
      console.error("Failed to create bookmark:", err);
      toast.error("Failed to create bookmark.");
    },
    onSuccess: () => {
      toast.success("Bookmark has been created.");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useEditBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      modifiedBookmark,
    }: {
      id: number;
      modifiedBookmark: BookmarkInsert;
    }) =>
      await linkdingFetch(`bookmarks/${id}`, {
        method: "PUT",
        body: JSON.stringify(modifiedBookmark),
      }),
    onError: async (err) => {
      console.error("Failed to update bookmark:", err);
      toast.error("Failed to update bookmark.");
    },
    onSuccess: () => {
      toast.success("Bookmark has been updated.");
    },
    onSettled: async (_, _err, id) => {
      await queryClient.invalidateQueries({ queryKey: ["bookmarks", id] });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  const { token } = useSettingsStore.getState();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/bookmarks/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] });
      const previousBookmarks = await queryClient.getQueryData(["bookmarks"]);

      queryClient.setQueriesData({ queryKey: ["bookmarks"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          count: old.count - 1,
          results: old.results.filter((b: any) => b.id !== deletedId),
        };
      });

      return { previousBookmarks };
    },
    onError: async (err, _, context) => {
      await queryClient.setQueryData(["bookmarks"], context?.previousBookmarks);
      console.error("Failed to delete bookmark:", err);
      toast.error("Failed to delete bookmark.");
    },
    onSuccess: () => {
      toast.success("Bookmark has been deleted.");
    },
    onSettled: async (_, _err, id) => {
      await queryClient.invalidateQueries({ queryKey: ["bookmarks", id] });
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFolder: FolderInsert): Promise<Folder> =>
      await linkdingFetch("bundles", {
        method: "POST",
        body: JSON.stringify(newFolder),
      }),
    onError: async (err) => {
      console.error("Failed to create folder:", err);
      toast.error("Failed to create folder.");
    },
    onSuccess: () => {
      toast.success("Folder has been created.");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bundles"] });
    },
  });
}

export function useEditFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, modifiedFolder }: { id: number; modifiedFolder: FolderInsert }) =>
      await linkdingFetch(`bundles/${id}`, {
        method: "PUT",
        body: JSON.stringify(modifiedFolder),
      }),
    onError: async (err) => {
      console.error("Failed to update folder:", err);
      toast.error("Failed to update folder.");
    },
    onSuccess: () => {
      toast.success("Folder has been updated.");
    },
    onSettled: async (_, _err, id) => {
      await queryClient.invalidateQueries({ queryKey: ["bundles", id] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  const { token } = useSettingsStore.getState();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/bundles/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["bundles"] });
      const previousFolders = await queryClient.getQueryData(["bundles"]);

      queryClient.setQueriesData({ queryKey: ["bundles"] }, (old: any) => {
        if (!old) return old;

        if (old.results) {
          return {
            ...old,
            count: Math.max(0, old.count - 1),
            results: old.results.filter((f: any) => f.id !== deletedId),
          };
        }

        return old.id === deletedId ? undefined : old;
      });

      return { previousFolders };
    },
    onError: async (err, _, context) => {
      await queryClient.setQueryData(["bundles"], context?.previousFolders);
      console.error("Failed to delete folder:", err);
      toast.error("Failed to delete folder.");
    },
    onSuccess: () => {
      toast.success("Folder has been deleted.");
    },
    onSettled: async (_, _err, id) => {
      await queryClient.invalidateQueries({ queryKey: ["bundles", id] });
    },
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTag: TagInsert) =>
      await linkdingFetch("tags", {
        method: "POST",
        body: JSON.stringify(newTag),
      }),
    onError: async (err) => {
      console.error("Failed to create tag:", err);
      toast.error("Failed to create tag.");
    },
    onSuccess: () => {
      toast.success("Tag has been created.");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
}
