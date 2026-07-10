"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  signInWithPassword,
  sendMagicLink,
} from "@/lib/auth/actions";
import { signInSchema, type SignInInput } from "@/lib/auth/schemas";
import { OAuthButtons } from "./oauth-buttons";

export function SignInForm() {
  const [pending, startTransition] = useTransition();
  const [magicMode, setMagicMode] = useState(false);

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: SignInInput) {
    startTransition(async () => {
      if (magicMode) {
        const result = await sendMagicLink({ email: values.email });
        if (result.ok) {
          toast.success(result.message);
        } else {
          toast.error(result.error);
        }
        return;
      }
      const result = await signInWithPassword(values);
      if (result && !result.ok) {
        toast.error(result.error);
      }
    });
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

        {!magicMode && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-primary text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-destructive text-xs">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
        )}

        <Button type="submit" disabled={pending} className="mt-2">
          {pending && <Loader2 className="size-4 animate-spin" />}
          {magicMode ? "Send magic link" : "Sign in"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setMagicMode((m) => !m)}
        className="text-muted-foreground inline-flex items-center justify-center gap-1.5 text-xs hover:text-foreground"
      >
        <WandSparkles className="size-3.5" />
        {magicMode
          ? "Use password instead"
          : "Email me a magic link instead"}
      </button>

      <p className="text-muted-foreground text-center text-sm">
        New to CodeQuest?{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
