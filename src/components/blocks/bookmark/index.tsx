import { useEffect, useState } from "react";

import {
  ArrowDownAzIcon,
  ArrowUpAzIcon,
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  CalendarIcon,
  LayoutGridIcon,
  ListIcon,
  Table2Icon,
} from "lucide-react";
import { flushSync } from "react-dom";
import { useShallow } from "zustand/react/shallow";

import { usePagination } from "@/hooks/use-pagination";
import type { BookmarkFilters, FilterKey, SortField, SortOrder } from "@/lib/bookmark-utils";
import { useSettingsStore } from "@/lib/store";
import type { Bookmark, PaginatedResponse, View } from "@/types";

import BookmarkSheet from "@/components/blocks/bookmark/sheet";
import BookmarkGridView from "@/components/blocks/bookmark/views/grid";
import BookmarkListView from "@/components/blocks/bookmark/views/list";
import BookmarkTableView from "@/components/blocks/bookmark/views/table";
import { EmptyCache } from "@/components/default-error-component";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
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
  filters?: BookmarkFilters;
  sort?: {
    field: SortField;
    order: SortOrder;
  };
  onOffsetChange: (offset: number) => void;
  setFilter?: (
    key: FilterKey | Record<string, boolean | undefined>,
    value?: boolean | undefined
  ) => void;
  setSort?: (field?: SortField | undefined, order?: SortOrder) => void;
  emptyComponent: React.ReactNode;
  children?: React.ReactNode;
}

export default function BookmarkWrapper({
  heading,
  emptyComponent,
  bookmarkData,
  offset = 0,
  filters,
  sort,
  onOffsetChange,
  setFilter,
  setSort,
  children,
}: BookmarkWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [selectedFilters, setSelectedFilters] = useState(["all"]);

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

  if (!bookmarkData?.results) {
    return <EmptyCache />;
  }

  if (!bookmarkData.results.length || bookmarkData.count === 0) {
    return emptyComponent;
  }

  const filterOptions = ["all", "unread", "read", "shared", "private", "archived", "active"];

  useEffect(() => {
    const f = filters ?? {};
    if (f.all) {
      setSelectedFilters(["all"]);
      return;
    }
    const next: string[] = [];
    if (f.unread === true) next.push("unread");
    else if (f.unread === false) next.push("read");

    if (f.shared === true) next.push("shared");
    else if (f.shared === false) next.push("private");

    if (f.is_archived === true) next.push("archived");
    else if (f.is_archived === false) next.push("active");

    setSelectedFilters(next);
  }, [filters]);

  function handleFilterChange(keys: FilterKey[] | Set<string>) {
    const selected = new Set(Array.isArray(keys) ? keys : [...keys]);

    const updates: Record<string, boolean | undefined> = {};

    if (selected.has("all")) {
      updates.all = true;
      updates.unread = undefined;
      updates.shared = undefined;
      updates.archived = undefined;
      setSelectedFilters(["all"]);
      setFilter?.(updates as Record<string, boolean | undefined>);
      return;
    }

    updates.all = undefined;

    if (selected.has("unread") && !selected.has("read")) updates.unread = true;
    else if (selected.has("read") && !selected.has("unread")) updates.unread = false;
    else updates.unread = undefined;

    if (selected.has("shared") && !selected.has("private")) updates.shared = true;
    else if (selected.has("private") && !selected.has("shared")) updates.shared = false;
    else updates.shared = undefined;

    if (selected.has("archived") && !selected.has("active")) updates.archived = true;
    else if (selected.has("active") && !selected.has("archived")) updates.archived = false;
    else updates.archived = undefined;

    const ui: string[] = [];
    if (updates.unread === true) ui.push("unread");
    else if (updates.unread === false) ui.push("read");
    if (updates.shared === true) ui.push("shared");
    else if (updates.shared === false) ui.push("private");
    if (updates.archived === true) ui.push("archived");
    else if (updates.archived === false) ui.push("active");

    setSelectedFilters(ui);
    setFilter?.(updates as Record<string, boolean | undefined>);
  }

  function handleComboboxChange(values: string[]) {
    const valuesArr = values ?? [];

    const hasAll = valuesArr.includes("all");
    if (hasAll && valuesArr.length > 1) valuesArr.splice(valuesArr.indexOf("all"), 1);

    function pickLast(a: string, b: string) {
      const iA = valuesArr.indexOf(a);
      const iB = valuesArr.indexOf(b);
      if (iA === -1 && iB === -1) return null;
      if (iA === -1) return b;
      if (iB === -1) return a;
      return iA > iB ? a : b;
    }

    const chosen: Set<string> = new Set();

    const r = pickLast("unread", "read");
    if (r) chosen.add(r);
    const s = pickLast("shared", "private");
    if (s) chosen.add(s);
    const a = pickLast("archived", "active");
    if (a) chosen.add(a);

    if (hasAll && chosen.size === 0) chosen.add("all");

    const normalized = [...chosen];
    setSelectedFilters(normalized);
    handleFilterChange(normalized as FilterKey[]);
  }

  function handleSortChange(field?: SortField[]) {
    const updatedField = sort?.field === field ? undefined : field?.[0];
    const updatedOrder = sort?.order === "asc" ? "desc" : "asc";
    setSort?.(updatedField, updatedOrder);
  }
  const anchor = useComboboxAnchor();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 sm:px-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">{heading}</h1>
          {children}
        </div>

        <div className="flex items-center gap-2">
          <Combobox
            multiple
            autoHighlight
            items={filterOptions}
            value={selectedFilters}
            onValueChange={(val) => handleComboboxChange(val as string[])}>
            <ComboboxChips ref={anchor} className="w-full max-w-xs">
              <ComboboxValue>
                {(values) => (
                  <>
                    {values.map((value: string) => (
                      <ComboboxChip key={value}>{value}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <ToggleGroup
            variant="outline"
            multiple={false}
            defaultValue={[""]}
            onValueChange={(val) => handleSortChange(val as SortField[])}>
            <ToggleGroupItem value="title" aria-label="title sort">
              {sort?.field === "title" && sort.order === "asc" ? (
                <ArrowUpAzIcon />
              ) : sort?.field === "title" && sort.order === "desc" ? (
                <ArrowDownAzIcon />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M14.5 5.75h7l-7 10h7" />
                  <path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" />
                  <path d="M3.304 13h6.392" />
                </svg>
              )}
            </ToggleGroupItem>

            <ToggleGroupItem value="date_modified" aria-label="date modified sort">
              {sort?.field === "date_modified" && sort.order === "asc" ? (
                <CalendarArrowUpIcon />
              ) : sort?.field === "date_modified" && sort.order === "desc" ? (
                <CalendarArrowDownIcon />
              ) : (
                <CalendarIcon />
              )}
            </ToggleGroupItem>
          </ToggleGroup>
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
            count={bookmarkData.count}
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
