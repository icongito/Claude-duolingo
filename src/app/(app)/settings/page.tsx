import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Tune CodeQuest to how you like to learn.
        </p>
      </div>
      <SettingsForm />
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Danger zone
          </CardTitle>
          <CardDescription>
            Deleting your account removes all progress, XP, and certificates.
            This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button className="rounded-xl border border-destructive/50 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10">
            Delete account
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
