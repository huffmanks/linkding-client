import { useBulkSelectionStore } from "./store/bulk-selection";

export function stopBulkSelectionOnEnterRoute({ preload }: { preload: boolean }) {
  if (preload) return;

  useBulkSelectionStore.getState().stopBulkSelection();
}
