import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";

import { safeEnsure } from "@/lib/api";
import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import { EmptyFolder } from "@/routes/(protected)/dashboard/folders/-components/empty-folder";
import FolderActionDropdown from "@/routes/(protected)/dashboard/folders/-components/folder-action-dropdown";
import type { BookmarkSearch } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";

export const Route = createFileRoute("/(protected)/dashboard/folders/$id/")({
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      offset: typeof search.offset === "number" && search.offset !== 0 ? search.offset : undefined,
    };
  },
  loaderDeps: ({ search: { offset } }) => ({ offset: offset ?? 0 }),
  loader: async ({ context: { queryClient }, params: { id }, deps: { offset } }) => {
    const { limit } = useSettingsStore.getState();

    try {
      await safeEnsure(queryClient, getAllQueryOptions.folderById(id));

      await safeEnsure(queryClient, getAllQueryOptions.bookmarksByFolderId(id, offset, limit));
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        throw notFound();
      }
      throw error;
    }
  },
  component: FolderComponent,
});

function FolderComponent() {
  const { id } = Route.useParams();
  const { offset } = Route.useSearch();
  const limit = useSettingsStore((state) => state.limit);
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: folder } = useSuspenseQuery(getAllQueryOptions.folderById(id));
  const { data: bookmarks } = useSuspenseQuery(
    getAllQueryOptions.bookmarksByFolderId(id, offset, limit)
  );

  function onOffsetChange(newOffset: number) {
    navigate({
      search: (prev) => ({ ...prev, offset: newOffset }),
    });
  }

  return (
    <BookmarkWrapper
      heading={folder.name}
      bookmarkData={bookmarks}
      offset={offset}
      onOffsetChange={onOffsetChange}
      emptyComponent={<EmptyFolder id={folder.id} name={folder.name} />}>
      <FolderActionDropdown id={folder.id} name={folder.name} />
    </BookmarkWrapper>
  );
}
