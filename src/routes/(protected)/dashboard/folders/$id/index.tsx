import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { folderBookmarksOptions, getAllQueryOptions } from "@/lib/queries";
import type { BookmarkSearch } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";
import EmptyDescription from "@/components/empty-description";
import FolderActionDropdown from "@/components/folder-action-dropdown";

export const Route = createFileRoute("/(protected)/dashboard/folders/$id/")({
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      offset: Number(search.offset) || 0,
    };
  },
  loaderDeps: ({ search: { offset } }) => ({ offset }),
  loader: async ({ context: { queryClient }, params: { id }, deps: { offset } }) => {
    const folder = await queryClient.ensureQueryData(getAllQueryOptions.folderById(id));

    const bookmarksByFolderQuery = folderBookmarksOptions(folder);

    await queryClient.ensureQueryData(
      getAllQueryOptions.bookmarksByFolderId(folder, bookmarksByFolderQuery, (offset = 0))
    );

    return folder;
  },
  component: FolderComponent,
});

function FolderComponent() {
  const folder = Route.useLoaderData();
  const { offset } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const bookmarksByFolderQuery = folderBookmarksOptions(folder);
  const { data: bookmarks } = useSuspenseQuery(
    getAllQueryOptions.bookmarksByFolderId(folder, bookmarksByFolderQuery, offset ?? 0)
  );

  function onOffsetChange(newOffset: number) {
    navigate({
      search: (prev) => ({ ...prev, offset: newOffset }),
    });
  }

  return (
    <BookmarkWrapper
      heading={folder.name}
      isTagOrFolder
      description={<EmptyDescription name={folder.name} />}
      bookmarkData={bookmarks}
      offset={offset}
      onOffsetChange={onOffsetChange}>
      <FolderActionDropdown folder={folder} />
    </BookmarkWrapper>
  );
}
