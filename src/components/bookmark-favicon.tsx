import type { Bookmark } from "@/types";

export default function BookmarkFavicon({ bookmark }: { bookmark: Bookmark }) {
  if (!bookmark?.favicon_url) return null;
  return (
    <div className="flex items-center justify-center overflow-hidden rounded-full border border-gray-50 bg-gray-200 shadow-lg">
      <img className="size-4 shrink-0" src={bookmark.favicon_url} alt={bookmark.title} />
    </div>
  );
}
