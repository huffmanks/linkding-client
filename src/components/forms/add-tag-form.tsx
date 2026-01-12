import { useForm } from "@tanstack/react-form";
import z from "zod";

import { useCreateTag } from "@/lib/api";
import { cn } from "@/lib/utils";

import CustomFieldError from "@/components/custom-field-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AddTagFormProps = React.ComponentProps<"div">;

export function AddTagForm({ className, ...props }: AddTagFormProps) {
  const { mutate, isPending } = useCreateTag();

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="mb-2 flex items-center gap-3">Add tag</CardTitle>
          <CardDescription>Create a new tag.</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <FieldDescription>
                      Tag names are case-insensitive and cannot contain spaces (spaces will be
                      replaced with hyphens).
                    </FieldDescription>
                    {!field.state.meta.isValid && (
                      <CustomFieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button
                  className="text-foreground cursor-pointer"
                  type="submit"
                  disabled={isPending}>
                  {isPending ? "Saving..." : "Create"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
