import { useState } from "react";

import { LayoutGridIcon, ListIcon, Table2Icon } from "lucide-react";
import { flushSync } from "react-dom";
import { useShallow } from "zustand/react/shallow";

import { usePagination } from "@/hooks/use-pagination";
import { useSettingsStore } from "@/lib/store";
import type { Bookmark, PaginatedResponse, View } from "@/types";

import BookmarkSheet from "@/components/blocks/bookmark/sheet";
import BookmarkGridView from "@/components/blocks/bookmark/views/grid";
import BookmarkListView from "@/components/blocks/bookmark/views/list";
import BookmarkTableView from "@/components/blocks/bookmark/views/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BookmarkWrapperProps {
  heading: string;
  bookmarkData: PaginatedResponse<Bookmark>;
  offset?: number;
  onOffsetChange: (offset: number) => void;
  emptyComponent: React.ReactNode;
  children?: React.ReactNode;
}

export default function BookmarkWrapper({
  heading,
  emptyComponent,
  bookmarkData,
  offset = 0,
  onOffsetChange,
  children,
}: BookmarkWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);

  const { limit, view, setView } = useSettingsStore(
    useShallow((state) => ({
      limit: state.limit,
      view: state.view,
      setView: state.setView,
    }))
  );

  function handleOpenSheet(bookmark: Bookmark) {
    setSelectedBookmark(bookmark);
    setIsOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) {
      setSelectedBookmark(null);
    }
  }

  function handleValueChange(values: string[]) {
    const nextView = values[values.length - 1] as View;
    if (!nextView) return;

    if (!document.startViewTransition) {
      setView(nextView);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setView(nextView);
      });
    });
  }

  const {
    currentPage,
    pageNumbers,
    handleNext,
    handlePrevious,
    handlePageClick,
    hasNext,
    hasPrevious,
  } = usePagination({
    offset,
    limit,
    totalCount: bookmarkData.count,
    hasNext: !!bookmarkData.next,
    hasPrevious: !!bookmarkData.previous,
    onOffsetChange,
  });

  if (!bookmarkData?.results.length) {
    return emptyComponent;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 sm:px-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">{heading}</h1>
          {children}
        </div>

        <ToggleGroup
          variant="outline"
          multiple={false}
          value={[view]}
          onValueChange={handleValueChange}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGridIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <Table2Icon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="view-content overflow-hidden">
        {view === "grid" && (
          <BookmarkGridView
            bookmarks={bookmarkData.results}
            handleOpenSheet={handleOpenSheet}
            handleOpenChange={handleOpenChange}
          />
        )}

        {view === "list" && (
          <BookmarkListView
            bookmarks={bookmarkData.results}
            handleOpenSheet={handleOpenSheet}
            handleOpenChange={handleOpenChange}
          />
        )}

        {view === "table" && (
          <BookmarkTableView
            bookmarks={bookmarkData.results}
            handleOpenSheet={handleOpenSheet}
            handleOpenChange={handleOpenChange}
          />
        )}
      </div>

      {selectedBookmark && (
        <BookmarkSheet
          isOpen={isOpen}
          bookmark={selectedBookmark}
          handleOpenChange={handleOpenChange}
        />
      )}

      {bookmarkData.count > limit && (
        <Pagination className="mb-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevious}
                className={!hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {pageNumbers.map((page, i) => (
              <PaginationItem key={typeof page === "string" ? `el-${i}` : page}>
                {page === "ellipsis-start" || page === "ellipsis-end" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageClick(page as number);
                    }}>
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
