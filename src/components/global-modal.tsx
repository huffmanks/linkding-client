import { useGlobalModal } from "@/providers/global-modal-context";

import { CreateTagForm } from "@/components/forms/create-tag-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function GlobalModal() {
  const { activeGlobalModal, closeGlobalModal } = useGlobalModal();
  return (
    <>
      {activeGlobalModal === "tag-form" && (
        <Dialog open onOpenChange={closeGlobalModal}>
          <DialogContent className="flex flex-col">
            <CreateTagForm />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
