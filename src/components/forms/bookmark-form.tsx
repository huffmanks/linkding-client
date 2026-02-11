import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

import { useCreateBookmark, useEditBookmark } from "@/lib/mutations";
import { getAllQueryOptions } from "@/lib/queries";
import { cn, getErrorMessage } from "@/lib/utils";
import type { Bookmark } from "@/types";

import { ComboboxCreate } from "@/components/forms/combobox-create";
import CustomFieldError from "@/components/forms/custom-field-error";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type BookmarkFormProps = React.ComponentProps<"div"> & {
  bookmark?: Bookmark;
};

export function BookmarkForm({ bookmark, className, ...props }: BookmarkFormProps) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const queryClient = useQueryClient();
  const { mutateAsync: createBookmark, isPending } = useCreateBookmark();
  const { mutateAsync: editBookmark } = useEditBookmark();

  const { data } = useSuspenseQuery(getAllQueryOptions.tags);

  const defaultValues = {
    url: bookmark?.url ?? "",
    title: bookmark?.title ?? "",
    description: bookmark?.description ?? "",
    notes: bookmark?.notes ?? "",
    is_archived: bookmark?.is_archived ?? false,
    unread: bookmark?.unread ?? false,
    shared: bookmark?.shared ?? false,
    tag_names: bookmark?.tag_names ?? [],
  };

  const tagItems = data.results.map((item) => item.name) || [];

  const initialItems = [...new Set([...tagItems, ...defaultValues.tag_names])].sort((a, b) =>
    a.localeCompare(b)
  );

  async function checkDuplicateUrl(url: string): Promise<boolean> {
    try {
      const check = await queryClient.fetchQuery(getAllQueryOptions.bookmarkCheckIfExists(url));

      if (check.bookmark?.id) {
        toast.error("Bookmark already exists with that url.");
        return true;
      }
    } catch (e) {
      toast.warning("Offline: Skipping duplicate check.");
    }
    return false;
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        if (bookmark?.id) {
          await editBookmark({ ...value, id: bookmark.id });
        } else {
          const exists = await checkDuplicateUrl(value.url);
          if (exists) return;

          await createBookmark({ ...value, tag_names: value.tag_names.filter(Boolean) });
          form.reset();
        }

        if (canGoBack) {
          router.history.back();
        } else {
          router.navigate({ to: "/dashboard" });
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
        }}>
        <FieldGroup>
          <form.Field
            name="url"
            validators={{
              onBlur: z.url("URL is invalid.").min(1, "URL is required."),
            }}
            children={(field) => (
              <Field data-invalid={!field.state.meta.isValid}>
                <FieldLabel htmlFor="url">URL</FieldLabel>
                <Input
                  id="url"
                  type="text"
                  value={field.state.value}
                  aria-invalid={!field.state.meta.isValid}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {!field.state.meta.isValid && <CustomFieldError errors={field.state.meta.errors} />}
              </Field>
            )}
          />

          <form.Field
            name="title"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  className="scrollbar max-h-72 resize-none pr-4"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          />

          <form.Field
            name="tag_names"
            children={(field) => (
              <Field>
                <FieldLabel>Tags</FieldLabel>
                <ComboboxCreate
                  value={field.state.value}
                  initialItems={initialItems}
                  onChange={(val) => field.handleChange(val)}
                />
              </Field>
            )}
          />

          <form.Field
            name="notes"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <Textarea
                  id="notes"
                  className="scrollbar max-h-72 min-h-36 resize-none pr-4"
                  placeholder="Additional notes, supports Markdown"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldDescription>Additional notes, supports Markdown.</FieldDescription>
              </Field>
            )}
          />

          <form.Field
            name="is_archived"
            children={(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="is_archived">Mark archived</FieldLabel>
                  <FieldDescription>Saves the bookmark directly to the archive.</FieldDescription>
                </FieldContent>
                <Switch
                  id="is_archived"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          />

          <form.Field
            name="unread"
            children={(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="unread">Mark unread</FieldLabel>
                  <FieldDescription>
                    Unread bookmarks can be filtered for, and marked as read after you had a chance
                    to look at them.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="unread"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          />

          <form.Field
            name="shared"
            children={(field) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel htmlFor="shared">Mark shared</FieldLabel>
                  <FieldDescription>
                    Allows to share this bookmark. with other users.
                  </FieldDescription>
                </FieldContent>
                <Switch
                  id="shared"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </Field>
            )}
          />

          <Button className="text-foreground cursor-pointer" type="submit" disabled={isPending}>
            {bookmark?.id ? "Update" : "Create"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
