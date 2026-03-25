import { createFileRoute } from "@tanstack/react-router";

import { SettingsForm } from "@/components/forms/settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/(protected)/dashboard/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-lg px-4 pt-4 pb-8 md:pt-0">
      <h1 className="mb-4 text-2xl font-medium">Settings</h1>

      <Tabs defaultValue="user">
        <TabsList>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="ui">UI</TabsTrigger>
          <TabsTrigger value="bookmark">Bookmark</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
        </TabsList>
        <div className="pt-4">
          <TabsContent value="user">
            <SettingsForm />
          </TabsContent>
          <TabsContent value="ui">
            <SettingsForm />
          </TabsContent>
          <TabsContent value="bookmark">
            <SettingsForm />
          </TabsContent>
          <TabsContent value="cache">
            <SettingsForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
