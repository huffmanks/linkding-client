import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import z from "zod";

import { useCreateFolder, useEditFolder } from "@/lib/api";
import { getAllQueryOptions } from "@/lib/queries";
import { cn, processValue, stringToStringArray } from "@/lib/utils";
import type { Folder } from "@/types";

import { ComboboxCreate } from "@/components/combobox-create";
import CustomFieldError from "@/components/custom-field-error";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FolderFormProps = React.ComponentProps<"div"> & {
  folder?: Folder;
};

export function FolderForm({ folder, className, ...props }: FolderFormProps) {
  const { mutate, isPending } = useCreateFolder();
  const { mutateAsync } = useEditFolder();

  const { data } = useSuspenseQuery(getAllQueryOptions.tags);

  const defaultValues = {
    name: folder?.name ?? "",
    search: stringToStringArray(folder?.search),
    any_tags: stringToStringArray(folder?.any_tags),
    all_tags: stringToStringArray(folder?.all_tags),
    excluded_tags: stringToStringArray(folder?.excluded_tags),
  };

  const tagItems = data?.results?.map((item) => item.name) || [];

  const initialAnyTagsItems = [...new Set([...tagItems, ...defaultValues.any_tags])].sort((a, b) =>
    a.localeCompare(b)
  );
  const initialAllTagsItems = [...new Set([...tagItems, ...defaultValues.all_tags])].sort((a, b) =>
    a.localeCompare(b)
  );
  const initialExcludedTagsItems = [...new Set([...tagItems, ...defaultValues.excluded_tags])].sort(
    (a, b) => a.localeCompare(b)
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const processed = processValue({ value, returnType: "string" });
      if (folder?.id) {
        mutateAsync({ id: folder.id, modifiedFolder: processed });
      } else {
        mutate(processed);
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
            name="name"
            validators={{
              onBlur: z.string().min(1, "Name is required."),
            }}
            children={(field) => (
              <Field data-invalid={!field.state.meta.isValid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
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
        </FieldGroup>
        <FieldSeparator className="my-4" />
        <FieldGroup>
          <h2 className="-mb-4 text-lg">Keyword filters</h2>
          <form.Field
            name="search"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor="search">Match keywords</FieldLabel>
                <ComboboxCreate
                  value={field.state.value}
                  entityName="keyword"
                  initialItems={defaultValues.search}
                  onChange={(val) => field.handleChange(val)}
                />
                <FieldDescription>
                  Only bookmarks including <u>all</u> of these specific terms will be added.
                </FieldDescription>
              </Field>
            )}
          />
        </FieldGroup>
        <FieldSeparator className="my-4" />
        <FieldGroup>
          <h2 className="-mb-4 text-lg">Tag filters</h2>
          <form.Field
            name="any_tags"
            children={(field) => (
              <Field>
                <FieldLabel>Match any tag (broad)</FieldLabel>
                <ComboboxCreate
                  value={field.state.value}
                  entityName="tag"
                  initialItems={initialAnyTagsItems}
                  onChange={(val) => field.handleChange(val)}
                />
                <FieldDescription>
                  Adds bookmarks that have <u>at least one</u> of these tags.
                </FieldDescription>
              </Field>
            )}
          />

          <form.Field
            name="all_tags"
            children={(field) => (
              <Field>
                <FieldLabel>Match all tags (strict)</FieldLabel>
                <ComboboxCreate
                  value={field.state.value}
                  entityName="tag"
                  initialItems={initialAllTagsItems}
                  onChange={(val) => field.handleChange(val)}
                />
                <FieldDescription>
                  Only adds bookmarks that contain <u>every</u> tag listed here.
                </FieldDescription>
              </Field>
            )}
          />

          <form.Field
            name="excluded_tags"
            children={(field) => (
              <Field>
                <FieldLabel>Filter out (exclusions)</FieldLabel>
                <ComboboxCreate
                  value={field.state.value}
                  entityName="tag"
                  initialItems={initialExcludedTagsItems}
                  onChange={(val) => field.handleChange(val)}
                />
                <FieldDescription>
                  Do not add any bookmark that has <u>any</u> of these tags, even if it matches the
                  rules above.
                </FieldDescription>
              </Field>
            )}
          />

          <Button
            className="text-primary-foreground cursor-pointer"
            type="submit"
            disabled={isPending}>
            {folder?.id ? "Update" : "Create"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
