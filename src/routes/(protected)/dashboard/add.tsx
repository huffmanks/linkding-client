import { createFileRoute } from "@tanstack/react-router";

import { AddBookmarkForm } from "@/components/forms/add-bookmark-form";
import { AddFolderForm } from "@/components/forms/add-folder-form";
import { AddTagForm } from "@/components/forms/add-tag-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/(protected)/dashboard/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-lg">
      <Tabs defaultValue="bookmark">
        <TabsList>
          <TabsTrigger value="bookmark">Bookmark</TabsTrigger>
          <TabsTrigger value="folder">Folder</TabsTrigger>
          <TabsTrigger value="tag">Tag</TabsTrigger>
        </TabsList>
        <TabsContent value="bookmark">
          <AddBookmarkForm />
        </TabsContent>
        <TabsContent value="folder">
          <AddFolderForm />
        </TabsContent>
        <TabsContent value="tag">
          <AddTagForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
