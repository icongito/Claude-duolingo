import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <Card className="glow-border-strong w-full max-w-md animate-pop-in">
      <div className="text-center">
        <h1 className="font-pixel text-2xl">Reset password</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </Card>
  );
}
