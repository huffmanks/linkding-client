import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useCreateBookmark } from "@/lib/api";
import { getAllQueryOptions } from "@/lib/queries";
import { cn } from "@/lib/utils";

import { ComboboxCreate } from "@/components/combobox-create";
import CustomFieldError from "@/components/custom-field-error";
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

type AddBookmarkFormProps = React.ComponentProps<"div">;

export function AddBookmarkForm({ className, ...props }: AddBookmarkFormProps) {
  const { mutate, isPending } = useCreateBookmark();

  const { data } = useSuspenseQuery(getAllQueryOptions.tags);

  const initialItems = data?.results?.map((item) => item.name) || [];

  const form = useForm({
    defaultValues: {
      url: "",
      title: "",
      description: "",
      notes: "",
      is_archived: false,
      unread: false,
      shared: false,
      tag_names: [""],
    },
    onSubmit: async ({ value }) => {
      mutate({ ...value, tag_names: value.tag_names.filter(Boolean) });
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
                  className="min-h-48"
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
            {isPending ? "Saving..." : "Create"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
