import { useForm } from "@tanstack/react-form";
import { LaptopIcon, LayoutGridIcon, ListIcon, MoonIcon, SunIcon, Table2Icon } from "lucide-react";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { UrlSchema, useSettingsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Theme, View } from "@/types";

import CustomFieldError from "@/components/forms/custom-field-error";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
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
import { Switch } from "@/components/ui/switch";

type SettingsFormProps = React.ComponentProps<"div">;

export function SettingsForm({ className, ...props }: SettingsFormProps) {
  const {
    username,
    linkdingUrl,
    view,
    theme,
    sidebarAddOpen,
    limit,
    setUsername,
    setLinkdingUrl,
    setView,
    setTheme,
    setSidebarAddOpen,
    setLimit,
  } = useSettingsStore(
    useShallow((state) => ({
      username: state.username,
      linkdingUrl: state.linkdingUrl,
      view: state.view,
      theme: state.theme,
      sidebarAddOpen: state.sidebarAddOpen,
      limit: state.limit,
      setUsername: state.setUsername,
      setLinkdingUrl: state.setLinkdingUrl,
      setView: state.setView,
      setTheme: state.setTheme,
      setSidebarAddOpen: state.setSidebarAddOpen,
      setLimit: state.setLimit,
    }))
  );

  const form = useForm({
    defaultValues: {
      username: username ?? "",
      linkdingUrl: linkdingUrl ?? "",
      view,
      theme,
      sidebarAddOpen,
      limit,
    },
    onSubmit: async ({ value }) => {
      setUsername(value.username);
      setLinkdingUrl(value.linkdingUrl);
      setView(value.view);
      setTheme(value.theme);
      setSidebarAddOpen(value.sidebarAddOpen);
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
                  <FieldLabel htmlFor="username">Username</FieldLabel>
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
              name="linkdingUrl"
              validators={{
                onBlur: UrlSchema,
              }}
              children={(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FieldLabel htmlFor="linkdingUrl">Linkding URL</FieldLabel>
                  <Input
                    id="linkdingUrl"
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
        </FieldSet>

        <FieldSeparator className="my-4" />

        <FieldSet>
          <FieldLegend className="text-muted-foreground">UI settings</FieldLegend>
          <FieldGroup>
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
              name="sidebarAddOpen"
              children={(field) => (
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="sidebarAddOpen">Sidebar “Add” default open</FieldLabel>
                    <FieldDescription>
                      Choose whether the “Add” item in the sidebar is open or collapsed by default.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="sidebarAddOpen"
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                  />
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
