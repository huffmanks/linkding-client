import { useForm } from "@tanstack/react-form";
import z from "zod";

import { useCreateFolder } from "@/lib/api";
import { cn } from "@/lib/utils";

import CustomFieldError from "@/components/custom-field-error";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AddFolderFormProps = React.ComponentProps<"div">;

export function AddFolderForm({ className, ...props }: AddFolderFormProps) {
  const { mutate, isPending } = useCreateFolder();

  const form = useForm({
    defaultValues: {
      name: "",
      search: "",
      any_tags: "",
      all_tags: "",
      excluded_tags: "",
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
    <>
      <DialogHeader className="px-4">
        <DialogTitle>Add folder</DialogTitle>
        <DialogDescription>Create a new folder.</DialogDescription>
      </DialogHeader>

      <div className="scrollbar h-full max-h-[60svh] overflow-y-auto px-4 pb-4">
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
                    {!field.state.meta.isValid && (
                      <CustomFieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              />

              <form.Field
                name="search"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="search">Search terms</FieldLabel>
                    <Input
                      id="search"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldDescription>
                      All of these search terms must be present in a bookmark to match.
                    </FieldDescription>
                  </Field>
                )}
              />

              <form.Field
                name="any_tags"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="any_tags">Tags</FieldLabel>
                    <Input
                      id="any_tags"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldDescription>
                      At least one of these tags must be present in a bookmark to match.
                    </FieldDescription>
                  </Field>
                )}
              />

              <form.Field
                name="all_tags"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="all_tags">Required tags</FieldLabel>
                    <Input
                      id="all_tags"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              />

              <form.Field
                name="excluded_tags"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor="excluded_tags">Excluded tags</FieldLabel>
                    <Input
                      id="excluded_tags"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              />

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
