import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import z from "zod";

import { login } from "@/lib/auth";
import { TokenSchema } from "@/lib/store";
import { cn } from "@/lib/utils";

import CustomFieldError from "@/components/forms/custom-field-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginFormProps = React.ComponentProps<"div">;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      username: "",
      token: "",
    },
    onSubmit: async ({ value }) => {
      const ok = await login({ ...value });

      if (ok) {
        navigate({ to: "/dashboard" });
      } else {
        console.error("Failed to login.");
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="mb-2 flex items-center gap-3">
            <svg
              className="fill-primary size-10"
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 512 512">
              <circle cx="256" cy="256" r="256" />
              <g fill="#fff" transform="translate(25.6, 25.6) scale(0.9) scale(21.3333)">
                <path d="m5.251 9.663l-1.587-1.41a1 1 0 1 0-1.328 1.494l1.405 1.25l.068-.062c.503-.446.982-.873 1.442-1.272m2.295 4.642q.544.436 1.04.777c1.117.763 2.185 1.228 3.414 1.228s2.297-.465 3.413-1.228c1.081-.739 2.306-1.828 3.843-3.194l.052-.046l2.356-2.095a1 1 0 0 0-1.328-1.494l-2.357 2.094c-1.6 1.423-2.731 2.426-3.694 3.084c-.94.642-1.613.88-2.285.88s-1.345-.238-2.285-.88q-.304-.21-.636-.465c-.446.378-.949.82-1.533 1.339" />
                <path d="M16.455 9.695q-.545-.436-1.042-.777C14.297 8.155 13.23 7.689 12 7.689s-2.297.466-3.413 1.229c-1.081.738-2.306 1.828-3.843 3.193l-.052.047l-2.356 2.094a1 1 0 1 0 1.328 1.495l2.357-2.094c1.6-1.423 2.731-2.426 3.694-3.084c.94-.642 1.613-.88 2.285-.88s1.345.238 2.285.88q.304.21.636.464c.446-.377.949-.82 1.534-1.338m3.804 3.308l-.068.061q-.753.672-1.442 1.273l1.587 1.41a1 1 0 0 0 1.328-1.495z" />
              </g>
            </svg>
            <h1>EchoLink</h1>
          </CardTitle>
          <CardDescription>Enter the connection settings.</CardDescription>
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
                name="token"
                validators={{
                  onBlur: TokenSchema,
                }}
                children={(field) => (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor="token">Linkding API token</FieldLabel>
                    <Input
                      id="token"
                      type="password"
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

              <Field>
                <Button className="text-foreground cursor-pointer" type="submit">
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
