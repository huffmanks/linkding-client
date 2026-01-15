import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { linkdingFetch } from "@/lib/api";
import type { Bookmark, Bundle } from "@/types";

import BookmarkWrapper from "@/components/blocks/bookmark";

const folderQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["bundles", id],
    queryFn: () => linkdingFetch<Bundle>(`bundles/${id}`),
  });

const folderBookmarksOptions = (folder: Bundle) => {
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
    queryKey: ["bookmarks", "folder", folder.id, fullQuery],
    queryFn: () =>
      linkdingFetch<{ results: Bookmark[] }>("bookmarks", {
        params: { q: fullQuery },
      }),
  });
};

export const Route = createFileRoute("/(protected)/dashboard/folders/$id")({
  loader: async ({ context: { queryClient }, params: { id } }) => {
    const folder = await queryClient.ensureQueryData(folderQueryOptions(id));

    await queryClient.ensureQueryData(folderBookmarksOptions(folder));

    return { folderId: id };
  },
  component: FolderComponent,
});

function FolderComponent() {
  const { id } = Route.useParams();

  const { data: folder } = useSuspenseQuery(folderQueryOptions(id));
  const { data: bookmarks } = useSuspenseQuery(folderBookmarksOptions(folder));

  return <BookmarkWrapper heading={folder.name} bookmarks={bookmarks.results} />;
}
