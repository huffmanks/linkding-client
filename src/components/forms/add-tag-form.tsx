import type { Dispatch, SetStateAction } from "react";

import { useForm } from "@tanstack/react-form";
import z from "zod";

import { useCreateTag } from "@/lib/api";

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

interface AddTagFormProps {
  setModalType: Dispatch<SetStateAction<"folder" | "tag" | null>>;
}

export function AddTagForm({ setModalType }: AddTagFormProps) {
  const { mutate, isPending } = useCreateTag();

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      mutate(value);
      setModalType(null);
    },
  });

  return (
    <>
      <DialogHeader className="px-4">
        <DialogTitle>Add tag</DialogTitle>
        <DialogDescription>Create a new tag.</DialogDescription>
      </DialogHeader>
      <div className="px-4 pb-4">
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
