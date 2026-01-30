import { useSettingsStore } from "@/lib/store";
import { joinUrlPath } from "@/lib/utils";
import type { Bookmark } from "@/types";

export default function BookmarkFavicon({ bookmark }: { bookmark: Bookmark }) {
  const linkdingUrl = useSettingsStore((state) => state.linkdingUrl);
  if (!bookmark?.favicon_url || !linkdingUrl) return null;

  const src = joinUrlPath(linkdingUrl, bookmark.favicon_url);

  return (
    <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-50 bg-gray-200 shadow-lg">
      <img className="size-4 shrink-0" src={src} alt={bookmark.title} />
    </div>
  );
}
