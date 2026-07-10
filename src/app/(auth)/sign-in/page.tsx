import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <Card className="glow-border-strong w-full max-w-md animate-pop-in">
      <div className="text-center">
        <h1 className="font-pixel text-2xl">Welcome back</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Your streak missed you. Pick up where you left off.
        </p>
      </div>
      <SignInForm />
    </Card>
  );
}
