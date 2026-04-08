import { useBulkSelectionStore } from "./bulk-selection-store";

export function stopBulkSelectionOnEnterRoute({ preload }: { preload: boolean }) {
  if (preload) return;

  useBulkSelectionStore.getState().stopBulkSelection();
}
