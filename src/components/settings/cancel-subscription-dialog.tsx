"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LittleGuy } from "@/components/mascot/little-guy";

export function CancelSubscriptionDialog({
  planName,
  renewsOn,
}: {
  planName: string;
  renewsOn: string;
}) {
  const [canceled, setCanceled] = useState(false);

  if (canceled) {
    return (
      <Button variant="secondary" disabled>
        Cancels on {renewsOn}
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Cancel subscription</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel {planName}?</DialogTitle>
          <DialogDescription>
            You keep {planName} until {renewsOn}, then drop to Free. Your
            streak, XP, gems, and everything you own stay exactly as they are —
            only unlimited hearts, the monthly gem stipend, and the smarter
            mentor go away. No guilt trip, no maze.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-2">
          <LittleGuy animation="think" size={140} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Keep {planName}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => setCanceled(true)}>
              Cancel at period end
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
