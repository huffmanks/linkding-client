import { type Dispatch, type SetStateAction } from "react";

import type { ActiveModal } from "@/components/blocks/sidebar";
import { AddTagForm } from "@/components/forms/add-tag-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NavModalProps {
  activeModal: ActiveModal;
  setActiveModal: Dispatch<SetStateAction<ActiveModal>>;
}

export default function NavModal({ activeModal, setActiveModal }: NavModalProps) {
  return (
    <>
      {activeModal === "tag-form" && (
        <Dialog open onOpenChange={() => setActiveModal(null)}>
          <DialogContent>
            <AddTagForm setOpenTagModal={() => setActiveModal(null)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
