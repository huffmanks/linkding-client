import type { Dispatch, SetStateAction } from "react";

import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

import { linkdingFetch, useCreateFolder } from "@/lib/api";
import { processValue } from "@/lib/utils";
import type { Tag } from "@/types";

import { ComboboxCreate } from "@/components/combobox-create";
import CustomFieldError from "@/components/custom-field-error";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface AddFolderFormProps {
  setModalType: Dispatch<SetStateAction<"folder" | "tag" | null>>;
}

export function AddFolderForm({ setModalType }: AddFolderFormProps) {
  const { mutate, isPending } = useCreateFolder();

  const { data, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => linkdingFetch<{ results: Tag[] }>("tags"),
  });

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
      setModalType(null);
    },
  });

  return (
    <>
      <DialogHeader className="px-4">
        <DialogTitle className="text-2xl font-medium">Add folder</DialogTitle>
        <DialogDescription>
          These rules act as a filter for your existing bookmarks.
        </DialogDescription>
        <h2 className="text-lg">Smart folder configuration</h2>
        <p className="text-muted-foreground text-sm">
          Note: Creating a rule with a new tag name will not create that tag in your library. At
          least one field must be filled to create this folder.
        </p>
      </DialogHeader>

      <div className="scrollbar h-full max-h-[60svh] overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-6">
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
                  onChange: z.string().min(1, "Name is required."),
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
                    {!field.state.meta.isValid && (
                      <CustomFieldError errors={field.state.meta.errors} />
                    )}
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
              {isLoading ? (
                <p>Loading tags...</p>
              ) : (
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
              )}

              {isLoading ? (
                <p>Loading tags...</p>
              ) : (
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
              )}

              {isLoading ? (
                <p>Loading tags...</p>
              ) : (
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
                        Do not add any bookmark that has <u>any</u> of these tags, even if it
                        matches the rules above.
                      </FieldDescription>
                    </Field>
                  )}
                />
              )}

              <DialogFooter>
                <DialogClose
                  render={
                    <Button type="button" variant="outline" className="cursor-pointer">
                      Cancel
                    </Button>
                  }></DialogClose>
                <Button
                  className="text-foreground cursor-pointer"
                  type="submit"
                  disabled={isPending}>
                  {isPending ? "Saving..." : "Create"}
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </div>
      </div>
    </>
  );
}
