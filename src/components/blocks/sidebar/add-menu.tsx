import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";

import { AddTagForm } from "@/components/forms/add-tag-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export type ModalType = "tag" | null;

export default function AddMenu() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <Dialog open={!!modalType} onOpenChange={(open) => !open && setModalType(null)}>
      <DropdownMenu>
        <SidebarMenuButton
          render={
            <DropdownMenuTrigger className="cursor-pointer">
              <PlusIcon />
              <span>Add</span>
            </DropdownMenuTrigger>
          }
        />
        <DropdownMenuContent
          className="min-w-56"
          side={isMobile ? "bottom" : "right"}
          align="start">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate({ to: "/dashboard/bookmarks/add" })}>
            Bookmark
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate({ to: "/dashboard/folders/add" })}>
            Folder
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setModalType("tag")}>
            Tag
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="gap-4 px-2 pb-2">
        {modalType === "tag" && <AddTagForm setModalType={setModalType} />}
      </DialogContent>
    </Dialog>
  );
}
