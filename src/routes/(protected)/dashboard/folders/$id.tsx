import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { linkdingFetch } from "@/lib/api";
import { useSettingsStore } from "@/lib/store";
import type { Bookmark, BookmarkSearch, Bundle, PaginatedResponse } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";
import EmptyDescription from "@/components/empty-description";

const { limit } = useSettingsStore.getState();

const folderQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["bundles", id],
    queryFn: () => linkdingFetch<Bundle>(`bundles/${id}`),
  });

const folderBookmarksOptions = (folder: Bundle, offset: number = 0) => {
  const queryParts: string[] = [];

  if (folder.search) queryParts.push(folder.search);

  if (folder.all_tags) {
    const tags = folder.all_tags
      .split(" ")
      .map((t) => `#${t}`)
      .join(" ");
    queryParts.push(tags);
  }

  if (folder.any_tags) {
    const tags = folder.any_tags
      .split(" ")
      .map((t) => `#${t}`)
      .join(" or ");
    queryParts.push(`(${tags})`);
  }

  if (folder.excluded_tags) {
    const tags = folder.excluded_tags
      .split(" ")
      .map((t) => `not #${t}`)
      .join(" ");
    queryParts.push(tags);
  }

  const fullQuery = queryParts.join(" ").trim();

  return queryOptions({
    queryKey: ["bookmarks", "folder", folder.id, fullQuery, offset, limit],
    queryFn: () =>
      linkdingFetch<PaginatedResponse<Bookmark>>("bookmarks", {
        params: { q: fullQuery, offset: String(offset), limit: String(limit) },
      }),
  });
};

export const Route = createFileRoute("/(protected)/dashboard/folders/$id")({
  validateSearch: (search: Record<string, unknown>): BookmarkSearch => {
    return {
      offset: Number(search.offset) || 0,
    };
  },
  loaderDeps: ({ search: { offset } }) => ({ offset }),
  loader: async ({ context: { queryClient }, params: { id }, deps: { offset } }) => {
    const folder = await queryClient.ensureQueryData(folderQueryOptions(id));

    await queryClient.ensureQueryData(folderBookmarksOptions(folder, offset));

    return { folderId: id };
  },
  component: FolderComponent,
});

function FolderComponent() {
  const { id } = Route.useParams();
  const { offset } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: folder } = useSuspenseQuery(folderQueryOptions(id));
  const { data: bookmarks } = useSuspenseQuery(folderBookmarksOptions(folder, offset));

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
      onOffsetChange={onOffsetChange}
    />
  );
}
