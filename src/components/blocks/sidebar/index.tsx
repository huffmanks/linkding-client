import { useState } from "react";

import { Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components//blocks/sidebar/app-sidebar";
import { SiteHeader } from "@/components//blocks/sidebar/site-header";
import NavModal from "@/components/blocks/sidebar/nav-modal";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export type ActiveModal = "tag-form" | null;

export default function Sidebar() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  return (
    <>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar setActiveModal={setActiveModal} />
            <SidebarInset className="min-w-0">
              <div className="p-4">
                <Outlet />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <NavModal activeModal={activeModal} setActiveModal={setActiveModal} />
    </>
  );
}
