import type { Bookmark } from "@/types";

interface BookmarkGridViewProps {
  bookmarks: Bookmark[];
}

export default function BookmarkGridView({ bookmarks }: BookmarkGridViewProps) {
  return <div>BookmarkGridView</div>;
}
