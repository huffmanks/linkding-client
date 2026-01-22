import { useForm } from "@tanstack/react-form";
import { LaptopIcon, LayoutGridIcon, ListIcon, MoonIcon, SunIcon, Table2Icon } from "lucide-react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { useSettingsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Theme, View } from "@/types";

import CustomFieldError from "@/components/custom-field-error";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SettingsFormProps = React.ComponentProps<"div">;

export function SettingsForm({ className, ...props }: SettingsFormProps) {
  const { username, view, theme, limit, setUsername, setView, setTheme, setLimit } =
    useSettingsStore(
      useShallow((state) => ({
        username: state.username,
        view: state.view,
        theme: state.theme,
        limit: state.limit,
        setUsername: state.setUsername,
        setView: state.setView,
        setTheme: state.setTheme,
        setLimit: state.setLimit,
      }))
    );

  const form = useForm({
    defaultValues: {
      username: username ?? "",
      view,
      theme,
      limit,
    },
    onSubmit: async ({ value }) => {
      setUsername(value.username);
      setView(value.view);
      setTheme(value.theme);
      setLimit(Number(value.limit));
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
        <FieldSet>
          <FieldLegend className="text-muted-foreground">User settings</FieldLegend>
          <FieldGroup>
            <form.Field
              name="username"
              validators={{
                onBlur: z.string().min(1, "Username is required."),
              }}
              children={(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FieldLabel htmlFor="username">Linkding username</FieldLabel>
                  <Input
                    id="username"
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
              name="theme"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="theme">Theme</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as Theme)}>
                    <SelectTrigger id="theme">
                      <SelectValue>
                        {field.state.value === "light" ? (
                          <SunIcon />
                        ) : field.state.value === "dark" ? (
                          <MoonIcon />
                        ) : (
                          <LaptopIcon />
                        )}
                        <span>{field.state.value}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem className="[&>div]:items-center" value="light">
                          <SunIcon />
                          <span>Light</span>
                        </SelectItem>
                        <SelectItem className="[&>div]:items-center" value="dark">
                          <MoonIcon />
                          <span>Dark</span>
                        </SelectItem>
                        <SelectItem className="[&>div]:items-center" value="system">
                          <LaptopIcon />
                          <span>System</span>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSeparator className="my-4" />

        <FieldSet>
          <FieldLegend className="text-muted-foreground">UI settings</FieldLegend>
          <FieldGroup>
            <form.Field
              name="view"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor="view">View</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as View)}>
                    <SelectTrigger id="view">
                      <SelectValue>
                        {field.state.value === "grid" ? (
                          <LayoutGridIcon />
                        ) : field.state.value === "list" ? (
                          <ListIcon />
                        ) : (
                          <Table2Icon />
                        )}
                        <span>{field.state.value}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="[&>div]:items-center" value="grid">
                        <LayoutGridIcon />
                        <span>Grid</span>
                      </SelectItem>
                      <SelectItem className="[&>div]:items-center" value="list">
                        <ListIcon />
                        <span>List</span>
                      </SelectItem>
                      <SelectItem className="[&>div]:items-center" value="table">
                        <Table2Icon />
                        <span>Table</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <form.Field
              name="limit"
              validators={{
                onChange: z.number().min(10, "Must have a minimum of 10."),
              }}
              children={(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FieldLabel htmlFor="limit">Results per page</FieldLabel>
                  <Input
                    id="limit"
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    aria-invalid={!field.state.meta.isValid}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {!field.state.meta.isValid && (
                    <CustomFieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSeparator className="my-4" />

        <FieldGroup>
          <Button className="text-foreground cursor-pointer" type="submit">
            Update
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
