import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

import { safeEnsure } from "@/lib/api";
import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useBulkSelection } from "@/providers/bulk-selection";
import { EmptyFolders } from "@/routes/(protected)/dashboard/folders/-components/empty-folder";
import FolderActionDropdown from "@/routes/(protected)/dashboard/folders/-components/folder-action-dropdown";

import BulkActionBar from "@/components/blocks/bookmark/bulk-action-bar";
import { AllCheckbox, ItemCheckbox } from "@/components/blocks/bookmark/checkboxes";
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
  loader: async ({ context: { queryClient } }) => {
    try {
      await safeEnsure(queryClient, getAllQueryOptions.folders);
    } catch (error) {
      if (error instanceof Error && error.message.includes("404")) {
        throw notFound();
      }
      throw error;
    }
  },
});

function RouteComponent() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { data: folders } = useSuspenseQuery(getAllQueryOptions.folders);

  const {
    selectedIds,
    bulkAction,
    isBulkSelecting,
    clearSelection,
    setCurrentBulkAction,
    stopBulkSelection,
  } = useBulkSelection();
  const { continueBulkEdit, keepBulkSelection } = useSettingsStore(
    useShallow((state) => ({
      limit: state.limit,
      view: state.view,
      defaultSortDate: state.defaultSortDate,
      continueBulkEdit: state.continueBulkEdit,
      keepBulkSelection: state.keepBulkSelection,
      setView: state.setView,
    }))
  );

  if (!folders.results.length) {
    return <EmptyFolders />;
  }

  async function handleBulkEdit() {
    if (!bulkAction || selectedIds.size === 0) return;

    try {
    } catch (error) {}
  }

  function handlePostBulkAction() {
    if (!continueBulkEdit) {
      stopBulkSelection();
    } else if (!keepBulkSelection) {
      clearSelection();
    } else {
      setCurrentBulkAction(null);
    }

    setIsAlertOpen(false);
  }

  const filteredFolders = folders.results.filter(
    (folder) => !folder.id.toString().startsWith("temp")
  );

  const allFolderIds = filteredFolders.map((folder) => folder.id);

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4 sm:px-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">Folders</h1>
        </div>
        <div>
          <BulkActionBar
            isAlertOpen={isAlertOpen}
            setIsAlertOpen={setIsAlertOpen}
            handleBulkEdit={handleBulkEdit}
            handlePostBulkAction={handlePostBulkAction}
          />
        </div>
      </div>
      <div className="pb-6 sm:px-2">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className={cn("transition-all", isBulkSelecting ? "w-8.5 p-2" : "w-0 p-0")}>
                <AllCheckbox allIds={allFolderIds} />
              </TableHead>
              <TableHead className="w-8.5">Id</TableHead>
              <TableHead className="min-36 w-3/4 truncate">Name</TableHead>
              <TableHead className="min-24 w-1/4">Bookmarks</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFolders.map((folder) => (
              <TableRow key={folder.id}>
                <TableCell>
                  <ItemCheckbox id={folder.id} />
                </TableCell>
                <TableCell>{folder.id}</TableCell>
                <TableCell>{folder.name}</TableCell>
                <TableCell>
                  <BookmarksCount id={folder.id} />
                </TableCell>
                <TableCell className="flex items-center justify-end">
                  <FolderActionDropdown id={folder.id} name={folder.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground px-2 py-2.5">
                Total: {folders.count}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

function BookmarksCount({ id }: { id: number }) {
  const { data: bookmarks } = useSuspenseQuery(getAllQueryOptions.bookmarksByFolderId(String(id)));

  return <span>{bookmarks.count}</span>;
}
