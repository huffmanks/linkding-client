import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import { usePagination } from "@/hooks/use-pagination";
import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import { formatToLocalTime } from "@/lib/utils";
import { EmptyFolders } from "@/routes/(protected)/dashboard/folders/-components/empty-folder";
import FolderActionDropdown from "@/routes/(protected)/dashboard/folders/-components/folder-action-dropdown";
import type { TableList } from "@/types";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/(protected)/dashboard/folders/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): TableList => {
    return {
      offset: typeof search.offset === "number" && search.offset !== 0 ? search.offset : undefined,
    };
  },
  loaderDeps: ({ search: { offset } }) => ({ offset: offset ?? 0 }),
  loader: async ({ context: { queryClient }, deps: { offset } }) => {
    const { limit } = useSettingsStore.getState();
    await queryClient.ensureQueryData(getAllQueryOptions.folderList(offset, limit));
  },
});

function RouteComponent() {
  const { offset } = Route.useSearch();
  const limit = useSettingsStore((state) => state.limit);
  const { data: folders } = useSuspenseQuery(getAllQueryOptions.folderList(offset, limit));
  const navigate = useNavigate({ from: Route.fullPath });

  function onOffsetChange(newOffset: number) {
    navigate({
      search: (prev): TableList => ({ ...prev, offset: newOffset }),
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
    offset: offset ?? 0,
    limit,
    totalCount: folders.count,
    hasNext: !!folders.next,
    hasPrevious: !!folders.previous,
    onOffsetChange,
  });

  if (!folders.results.length) {
    return <EmptyFolders />;
  }

  return (
    <>
      <div className="pb-6 sm:px-2">
        <h1 className="mb-6 text-xl font-medium">Folders</h1>
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Id</TableHead>
              <TableHead className="w-72">Name</TableHead>
              <TableHead className="w-44">Created at</TableHead>
              <TableHead className="w-44">Modified at</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {folders.results.map((folder) => (
              <TableRow key={folder.id} className="hover:bg-muted/50 focus:bg-muted outline-none">
                <TableCell>{folder.id}</TableCell>
                <TableCell className="truncate">
                  <Link
                    className="text-primary focus-visible:text-primary/80 underline-offset-2 transition-all outline-none hover:underline focus-visible:underline"
                    to="/dashboard/folders/$id"
                    params={{ id: String(folder.id) }}>
                    {folder.name}
                  </Link>
                </TableCell>
                <TableCell>{formatToLocalTime(folder.date_created)}</TableCell>
                <TableCell>{formatToLocalTime(folder.date_modified)}</TableCell>
                <TableCell className="flex items-center justify-end">
                  <FolderActionDropdown id={folder.id} name={folder.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total: {folders.count}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {folders.count > limit && (
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
  );
}
