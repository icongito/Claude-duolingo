"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  magicLinkSchema,
} from "./schemas";

export type AuthActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

const NOT_CONFIGURED_ERROR =
  "Authentication isn't configured yet. Add your Supabase credentials to .env.local to enable sign-in.";

export async function signInWithPassword(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  if (!supabaseConfigured()) {
    return { ok: false, error: NOT_CONFIGURED_ERROR };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, error: error.message };
  }
  redirect("/dashboard");
}

export async function signUpWithPassword(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  if (!supabaseConfigured()) {
    return { ok: false, error: NOT_CONFIGURED_ERROR };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      data: {
        username: parsed.data.username,
        display_name: parsed.data.username,
      },
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return {
    ok: true,
    message: "Check your inbox to confirm your email and start your quest.",
  };
}

export async function sendMagicLink(input: unknown): Promise<AuthActionResult> {
  const parsed = magicLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  if (!supabaseConfigured()) {
    return { ok: false, error: NOT_CONFIGURED_ERROR };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, message: "Magic link sent — check your inbox." };
}

export async function sendPasswordReset(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  if (!supabaseConfigured()) {
    return { ok: false, error: NOT_CONFIGURED_ERROR };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${siteUrl()}/auth/callback?next=/settings` },
  );

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, message: "Password reset email sent — check your inbox." };
}

export async function signInWithOAuth(
  provider: "google" | "github" | "discord",
): Promise<AuthActionResult> {
  if (!supabaseConfigured()) {
    return { ok: false, error: NOT_CONFIGURED_ERROR };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteUrl()}/auth/callback` },
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  if (data.url) {
    redirect(data.url);
  }
  return { ok: false, error: "OAuth provider did not return a redirect URL." };
}

export async function signOut(): Promise<void> {
  if (supabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
