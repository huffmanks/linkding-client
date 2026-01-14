import type { Bookmark } from "@/types";

interface BookmarkListViewProps {
  bookmarks: Bookmark[];
}

export default function BookmarkListView({ bookmarks }: BookmarkListViewProps) {
  return <div>BookmarkListView</div>;
}
