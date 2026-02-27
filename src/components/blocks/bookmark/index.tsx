import { useEffect, useState } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowDownAzIcon,
  ArrowUpAzIcon,
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  CalendarIcon,
  LayoutGridIcon,
  ListIcon,
  SearchXIcon,
  Table2Icon,
} from "lucide-react";
import { flushSync } from "react-dom";
import { useShallow } from "zustand/react/shallow";

import { usePagination } from "@/hooks/use-pagination";
import { FILTER_OPTIONS } from "@/lib/constants";
import { useSettingsStore } from "@/lib/store";
import { useBackgroundSync } from "@/providers/background-sync";
import type { Bookmark, PaginatedResponse, View } from "@/types";

import type {
  BookmarkFilters,
  FilterKey,
  SortField,
  SortOrder,
} from "@/components/blocks/bookmark/bookmark-utils";
import BookmarkSheet from "@/components/blocks/bookmark/sheet";
import BookmarkGridView from "@/components/blocks/bookmark/views/grid";
import BookmarkListView from "@/components/blocks/bookmark/views/list";
import BookmarkTableView from "@/components/blocks/bookmark/views/table";
import { EmptyCache } from "@/components/default-error-component";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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

  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const anchor = useComboboxAnchor();
  const { isOnline } = useBackgroundSync();

  const { limit, view, setView } = useSettingsStore(
    useShallow((state) => ({
      limit: state.limit,
      view: state.view,
      setView: state.setView,
    }))
  );

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

  const FILTER_GROUPS = [
    { param: "unread", trueKey: "unread", falseKey: "read" },
    { param: "shared", trueKey: "shared", falseKey: "private" },
    { param: "archived", trueKey: "archived", falseKey: "active" },
  ] as const;

  function resolveGroupValue(
    selected: Set<string>,
    trueKey: string,
    falseKey: string
  ): boolean | undefined {
    if (selected.has(trueKey) && !selected.has(falseKey)) return true;
    if (selected.has(falseKey) && !selected.has(trueKey)) return false;
    return undefined;
  }

  function handleFilterChange(keys: FilterKey[] | Set<string>) {
    const selected = new Set(Array.isArray(keys) ? keys : [...keys]);

    if (selected.has("all")) {
      setSelectedFilters(["all"]);
      setFilter?.({
        all: true,
        unread: undefined,
        shared: undefined,
        archived: undefined,
      });
      return;
    }

    const updates: Record<string, boolean | undefined> = { all: undefined };
    const ui: string[] = [];

    for (const g of FILTER_GROUPS) {
      const val = resolveGroupValue(selected, g.trueKey, g.falseKey);
      updates[g.param] = val;
      if (val === true) ui.push(g.trueKey);
      else if (val === false) ui.push(g.falseKey);
    }

    setSelectedFilters(ui.length ? ui : []);
    setFilter?.(updates);
  }

  function handleComboboxChange(values: string[]) {
    const arr = values ?? [];

    const hadAll = selectedFilters.includes("all");
    const hasAllNow = arr.includes("all");

    if (!hadAll && hasAllNow) {
      handleFilterChange(["all"]);
      return;
    }

    const working = hasAllNow ? arr.filter((v) => v !== "all") : arr;

    const selected = new Set<string>();

    for (const g of FILTER_GROUPS) {
      const iTrue = working.lastIndexOf(g.trueKey);
      const iFalse = working.lastIndexOf(g.falseKey);
      if (iTrue === -1 && iFalse === -1) continue;
      selected.add(iTrue > iFalse ? g.trueKey : g.falseKey);
    }

    handleFilterChange([...selected] as FilterKey[]);
  }

  function handleSortChange(field: SortField[]) {
    const newField = field[0] as SortField;

    if (newField) {
      setSort?.(newField);
    } else if (sort?.field) {
      setSort?.(sort.field);
    }
  }

  function clearAllFilters() {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        q: undefined,
        offset: undefined,
        all: undefined,
        archived: undefined,
        unread: undefined,
        shared: undefined,
      }),
    });

    setFilter?.({
      all: undefined,
      archived: undefined,
      unread: undefined,
      shared: undefined,
    });
  }

  useEffect(() => {
    const f = filters ?? {};

    if (f.all) {
      setSelectedFilters(["all"]);
      return;
    }

    const next: string[] = [];

    for (const g of FILTER_GROUPS) {
      const val = g.param === "archived" ? f.is_archived : f[g.param];
      if (val === true) next.push(g.trueKey);
      else if (val === false) next.push(g.falseKey);
    }

    setSelectedFilters(next);
  }, [filters]);

  if (!isOnline && !bookmarkData?.results) {
    return <EmptyCache />;
  }

  if (bookmarkData.count === 0 && !search.q) {
    return emptyComponent;
  }

  const isFilterEmpty =
    (bookmarkData.count > 0 && bookmarkData.results.length === 0) || (search?.q && search.q !== "");

  return (
    <div>
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:px-2 lg:flex-row">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">{heading}</h1>
          {children}
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <ToggleGroup
              variant="outline"
              multiple={false}
              value={sort?.field ? [sort.field] : []}
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
          <Combobox
            multiple
            autoHighlight
            items={FILTER_OPTIONS}
            value={selectedFilters}
            onValueChange={(val) => handleComboboxChange(val as string[])}>
            <ComboboxChips ref={anchor} className="w-full max-w-xs">
              <ComboboxValue>
                {(values) => (
                  <>
                    {values.map((value: string) => (
                      <ComboboxChip key={value}>{value}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput placeholder="Select filters" />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(group, index) => (
                  <ComboboxGroup key={group.value} items={group.items}>
                    <ComboboxCollection>
                      {(item) => (
                        <ComboboxItem key={item.label} value={item.value}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                    {index < FILTER_OPTIONS.length - 1 && <ComboboxSeparator />}
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      {isFilterEmpty ? (
        <EmptyFilterResults clearAllFilters={clearAllFilters} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

function EmptyFilterResults({ clearAllFilters }: { clearAllFilters: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>No matches found</EmptyTitle>
        <EmptyDescription>
          No bookmarks match those filters. Try resetting the filters below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button className="cursor-pointer" onClick={clearAllFilters}>
            Reset filters
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
