import { type Dispatch, type SetStateAction } from "react";

import type { ActiveModal } from "@/components/blocks/sidebar";
import { CreateTagForm } from "@/components/forms/create-tag-form";
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
            <CreateTagForm setOpenTagModal={() => setActiveModal(null)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
