import type { Bookmark } from "@/types";

interface BookmarkGridViewProps {
  bookmarks: Bookmark[];
  handleOpenSheet: (bookmark: Bookmark) => void;
}

export default function BookmarkGridView({ bookmarks, handleOpenSheet }: BookmarkGridViewProps) {
  return <div>BookmarkGridView</div>;
}
