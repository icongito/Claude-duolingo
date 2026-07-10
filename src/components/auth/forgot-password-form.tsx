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
import { sendPasswordReset } from "@/lib/auth/actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/auth/schemas";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const result = await sendPasswordReset(values);
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
        <h2 className="font-display text-lg font-semibold">Check your inbox</h2>
        <p className="text-muted-foreground max-w-xs text-sm">
          If an account exists for that address, a reset link is on its way.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
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

      <Button type="submit" disabled={pending} className="mt-2">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Send reset link
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Remembered it?{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
