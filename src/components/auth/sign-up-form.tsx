"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUpWithPassword } from "@/lib/auth/actions";
import { signUpSchema, type SignUpInput } from "@/lib/auth/schemas";
import { OAuthButtons } from "./oauth-buttons";

export function SignUpForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: SignUpInput) {
    startTransition(async () => {
      const result = await signUpWithPassword(values);
      if (result.ok) {
        setSent(true);
      } else {
        toast.error(result.error);
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <MailCheck className="size-7" />
        </span>
        <h2 className="font-display text-lg font-semibold">
          Confirm your email
        </h2>
        <p className="text-muted-foreground max-w-xs text-sm">
          We sent a confirmation link to your inbox. Click it to activate your
          account and start World 1.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <OAuthButtons />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <Separator className="flex-1" />
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            autoComplete="username"
            placeholder="pixel_dev"
            aria-invalid={!!form.formState.errors.username}
            {...form.register("username")}
          />
          {form.formState.errors.username && (
            <p className="text-destructive text-xs">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-destructive text-xs">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="8+ characters, 1 number"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!form.formState.errors.confirmPassword}
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-destructive text-xs">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={pending} className="mt-2">
          {pending && <Loader2 className="size-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
