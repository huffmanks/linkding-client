import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import z from "zod";

import { useCreateFolder } from "@/lib/api";
import { getAllQueryOptions } from "@/lib/queries";
import { cn, processValue } from "@/lib/utils";

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

type AddFolderFormProps = React.ComponentProps<"div">;

export function AddFolderForm({ className, ...props }: AddFolderFormProps) {
  const { mutate, isPending } = useCreateFolder();

  const { data } = useSuspenseQuery(getAllQueryOptions.tags);

  const tagItems = data?.results?.map((item) => item.name) || [];

  const form = useForm({
    defaultValues: {
      name: "",
      search: [""],
      any_tags: [""],
      all_tags: [""],
      excluded_tags: [""],
    },
    onSubmit: async ({ value }) => {
      const processed = processValue({ value, returnType: "string" });
      mutate(processed);
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
                  initialItems={tagItems}
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
                  initialItems={tagItems}
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
                  initialItems={tagItems}
                  onChange={(val) => field.handleChange(val)}
                />
                <FieldDescription>
                  Do not add any bookmark that has <u>any</u> of these tags, even if it matches the
                  rules above.
                </FieldDescription>
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
