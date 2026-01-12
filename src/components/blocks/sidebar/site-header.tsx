"use client";

import { SidebarIcon } from "lucide-react";

import { NavUser } from "@/components/blocks/sidebar/nav-user";
import { SearchForm } from "@/components/blocks/sidebar/search-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="size-8 cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-(--header-height)" />

        <div className="flex w-full items-center justify-between gap-4">
          <SearchForm className="w-full sm:w-auto" />
          <NavUser />
        </div>
      </div>
    </header>
  );
}
