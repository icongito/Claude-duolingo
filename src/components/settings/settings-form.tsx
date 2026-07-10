"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DEMO_USER } from "@/lib/data/demo-user";

export function SettingsForm() {
  const [displayName, setDisplayName] = useState(DEMO_USER.displayName);
  const [dailyGoal, setDailyGoal] = useState(String(DEMO_USER.dailyGoalXp));
  const [reminders, setReminders] = useState(true);
  const [sound, setSound] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  function save() {
    toast.success("Settings saved", {
      description: "Your preferences are stored locally in this demo build.",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>How you appear to other players</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Public profile</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Let anyone view your stats and showcase
              </p>
            </div>
            <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Learning</CardTitle>
          <CardDescription>Goals, reminders, and pace</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Daily XP goal</Label>
            <Select value={dailyGoal} onValueChange={setDailyGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Casual — 10 XP</SelectItem>
                <SelectItem value="30">Regular — 30 XP</SelectItem>
                <SelectItem value="50">Serious — 50 XP</SelectItem>
                <SelectItem value="100">Intense — 100 XP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily reminders</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                A nudge at 7pm if you haven&apos;t hit your goal
              </p>
            </div>
            <Switch checked={reminders} onCheckedChange={setReminders} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accessibility & sound</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Sound effects</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Muted by default — correct/wrong chimes, XP dings
              </p>
            </div>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Reduced motion</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Minimize animations across the app
              </p>
            </div>
            <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>High contrast</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Stronger borders and text contrast
              </p>
            </div>
            <Switch checked={highContrast} onCheckedChange={setHighContrast} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-factor authentication</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Require a one-time code at sign-in
              </p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Button size="lg" onClick={save} className="self-end">
        Save changes
      </Button>
    </div>
  );
}
