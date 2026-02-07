import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { getAllQueryOptions } from "@/lib/queries";
import { getRelativeTimeString } from "@/lib/utils";
import { EmptyFolders } from "@/routes/(protected)/dashboard/folders/-components/empty-folder";
import FolderActionDropdown from "@/routes/(protected)/dashboard/folders/-components/folder-action-dropdown";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/(protected)/dashboard/folders/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: folders } = useSuspenseQuery(getAllQueryOptions.folders);

  if (!folders.results.length) {
    return <EmptyFolders />;
  }

  return (
    <div className="sm:px-2">
      <h1 className="mb-6 text-xl font-medium">Folders</h1>

      <div className="grid gap-4 pb-10 lg:grid-cols-2">
        {folders.results.map((folder) => (
          <Card key={folder.id}>
            <CardHeader>
              <CardTitle className="truncate text-lg font-medium">
                <Link
                  className="decoration-primary underline underline-offset-4"
                  to="/dashboard/folders/$id"
                  params={{ id: String(folder.id) }}>
                  {folder.name}
                </Link>
              </CardTitle>
              <CardDescription>
                <p>
                  <span>Created: </span>
                  <span className="text-foreground">
                    {getRelativeTimeString(folder.date_created)}
                  </span>
                </p>
                <p>
                  <span>Last modified: </span>
                  <span className="text-foreground">
                    {getRelativeTimeString(folder.date_modified)}
                  </span>
                </p>
              </CardDescription>
              <CardAction>
                <FolderActionDropdown id={folder.id} name={folder.name} />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
              <section>
                <h2 className="mb-1 text-sm tracking-wide uppercase">Keywords</h2>
                <p>
                  <FieldValue value={folder.search} />
                </p>
              </section>

              <section>
                <h2 className="mb-1 text-sm tracking-wide uppercase">Tags</h2>
                <p>
                  <span className="font-light">All: </span>
                  <FieldValue value={folder.all_tags} />
                </p>
                <p>
                  <span className="font-light">Any: </span>
                  <FieldValue value={folder.any_tags} />
                </p>
                <p>
                  <span className="font-light">Exclude: </span>
                  <FieldValue value={folder.excluded_tags} />
                </p>
              </section>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FieldValue({ value }: { value: string }) {
  if (!value) {
    return <span className="text-muted-foreground">Empty</span>;
  }
  return <span className="text-primary">{value}</span>;
}
