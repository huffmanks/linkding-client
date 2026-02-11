import { useOfflineMutation } from "@/hooks/use-offline-mutation";
import type { BookmarkInsert, FolderInsert, TagInsert } from "@/types";

export function useCreateBookmark() {
  return useOfflineMutation<{ newBookmark: BookmarkInsert }>({
    queryKey: ["bookmarks"],
    url: "/api/bookmarks",
    method: "POST",
  });
}

export function useEditBookmark() {
  return useOfflineMutation<{ id: number; modifiedBookmark: BookmarkInsert }>({
    queryKey: ["bookmarks"],
    url: "/api/bookmarks",
    method: "PUT",
    idField: "id",
  });
}

export function useDeleteBookmark() {
  return useOfflineMutation<{ id: number }>({
    queryKey: ["bookmarks"],
    url: "/api/bookmarks",
    method: "DELETE",
    idField: "id",
  });
}

export function useCreateFolder() {
  return useOfflineMutation<{ newFolder: FolderInsert }>({
    queryKey: ["bundles"],
    url: "/api/bundles",
    method: "POST",
  });
}

export function useEditFolder() {
  return useOfflineMutation<{ id: number; modifiedFolder: FolderInsert }>({
    queryKey: ["bundles"],
    url: "/api/bundles",
    method: "PUT",
    idField: "id",
  });
}

export function useDeleteFolder() {
  return useOfflineMutation<{ id: number }>({
    queryKey: ["bundles"],
    url: "/api/bundles",
    method: "DELETE",
    idField: "id",
  });
}

export function useCreateTag() {
  return useOfflineMutation<{ newTag: TagInsert }>({
    queryKey: ["tags"],
    url: "/api/tags",
    method: "POST",
  });
}
