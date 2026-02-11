import { useOfflineMutation } from "@/hooks/use-offline-mutation";
import type { BookmarkInsert, FolderInsert, TagInsert } from "@/types";

export function useCreateBookmark() {
  return useOfflineMutation<BookmarkInsert>({
    queryKey: ["bookmarks"],
    url: "bookmarks",
    method: "POST",
  });
}

export function useEditBookmark() {
  return useOfflineMutation<BookmarkInsert & { id: number }>({
    queryKey: ["bookmarks"],
    url: "bookmarks",
    method: "PUT",
    idField: "id",
  });
}

export function useDeleteBookmark() {
  return useOfflineMutation<number>({
    queryKey: ["bookmarks"],
    url: "bookmarks",
    method: "DELETE",
    idField: "id",
  });
}

export function useCreateFolder() {
  return useOfflineMutation<FolderInsert>({
    queryKey: ["bundles"],
    url: "bundles",
    method: "POST",
  });
}

export function useEditFolder() {
  return useOfflineMutation<FolderInsert & { id: number }>({
    queryKey: ["bundles"],
    url: "bundles",
    method: "PUT",
    idField: "id",
  });
}

export function useDeleteFolder() {
  return useOfflineMutation<number>({
    queryKey: ["bundles"],
    url: "bundles",
    method: "DELETE",
    idField: "id",
  });
}

export function useCreateTag() {
  return useOfflineMutation<TagInsert>({
    queryKey: ["tags"],
    url: "tags",
    method: "POST",
  });
}
