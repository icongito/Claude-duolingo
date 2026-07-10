import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <Card className="glow-border-strong w-full max-w-md animate-pop-in">
      <div className="text-center">
        <h1 className="font-pixel text-2xl">Start your quest</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Free forever for Worlds 1–5. No credit card required.
        </p>
      </div>
      <SignUpForm />
    </Card>
  );
}
