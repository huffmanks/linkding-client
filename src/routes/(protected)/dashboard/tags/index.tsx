import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

import { useBulkSelectionStore } from "@/lib/bulk-selection-store";
import { stopBulkSelectionOnEnterRoute } from "@/lib/loaders";
import { getAllQueryOptions } from "@/lib/queries";
import { useSettingsStore } from "@/lib/store";
import { EmptyTags } from "@/routes/(protected)/dashboard/tags/-components/empty-tag";

import BulkActionBar from "@/components/blocks/bookmark/bulk-action-bar";

import TagTable from "./-components/tag-table";

export const Route = createFileRoute("/(protected)/dashboard/tags/")({
  component: RouteComponent,
  onEnter: stopBulkSelectionOnEnterRoute,
});

function RouteComponent() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { data: tags } = useSuspenseQuery(getAllQueryOptions.tags);

  const { selectedIds, bulkAction, clearSelection, setCurrentBulkAction, stopBulkSelection } =
    useBulkSelectionStore(
      useShallow((state) => ({
        selectedIds: state.selectedIds,
        bulkAction: state.bulkAction,
        clearSelection: state.clearSelection,
        setCurrentBulkAction: state.setCurrentBulkAction,
        stopBulkSelection: state.stopBulkSelection,
      }))
    );
  const { continueBulkEdit, keepBulkSelection } = useSettingsStore(
    useShallow((state) => ({
      continueBulkEdit: state.continueBulkEdit,
      keepBulkSelection: state.keepBulkSelection,
    }))
  );

  if (!tags.results.length) {
    return <EmptyTags />;
  }

  async function handleBulkEdit() {
    if (!bulkAction || selectedIds.size === 0) return;
    // TODO
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

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4 sm:px-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium">Tags</h1>
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
        <TagTable initialTags={tags} />
      </div>
    </>
  );
}
