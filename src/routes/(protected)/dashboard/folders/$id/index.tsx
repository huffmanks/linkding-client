import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import EmptyFolder from "@/routes/(protected)/dashboard/folders/-components/empty-folder";
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
    const folder = await queryClient.ensureQueryData(getAllQueryOptions.folderById(id));

    await queryClient.ensureQueryData(getAllQueryOptions.bookmarksByFolderId(id, offset, limit));

    return folder;
  },
  component: FolderComponent,
});

function FolderComponent() {
  const folder = Route.useLoaderData();
  const { offset } = Route.useSearch();
  const limit = useSettingsStore((state) => state.limit);
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: bookmarks } = useSuspenseQuery(
    getAllQueryOptions.bookmarksByFolderId(String(folder.id), offset, limit)
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
      <FolderActionDropdown folder={folder} />
    </BookmarkWrapper>
  );
}
