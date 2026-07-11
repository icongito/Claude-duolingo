"use client";

import { useState } from "react";
import { Check, Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LittleGuy, type LittleGuyWear } from "@/components/mascot/little-guy";
import { WEARABLES } from "@/lib/data/economy";
import { DEMO_USER } from "@/lib/data/demo-user";
import { cn } from "@/lib/utils";

const RARITY_STYLE: Record<string, string> = {
  rare: "border-info/50 text-info",
  epic: "border-[#b78bff]/50 text-[#b78bff]",
  legendary: "border-accent/60 text-accent",
};

export function WearableGrid() {
  const [equipped, setEquipped] = useState<LittleGuyWear>(DEMO_USER.equippedWear);
  const gems = DEMO_USER.gems;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {WEARABLES.map((item) => {
        const isEquipped = equipped === item.wear;
        const affordable = gems >= item.priceGems;
        return (
          <Card key={item.slug} className="flex flex-col gap-3 p-4">
            <div className="bg-secondary/40 relative flex items-center justify-center rounded-xl py-2">
              <LittleGuy animation="idle" size={120} crop wear={item.wear} />
              <Badge
                variant="outline"
                className={cn("absolute top-2 right-2 capitalize", RARITY_STYLE[item.rarity])}
              >
                {item.rarity}
              </Badge>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="font-display font-semibold">{item.name}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
            {item.owned ? (
              <Button
                variant={isEquipped ? "secondary" : "default"}
                onClick={() => setEquipped(isEquipped ? "none" : item.wear)}
              >
                {isEquipped ? (
                  <>
                    <Check className="size-4" /> Equipped
                  </>
                ) : (
                  "Equip"
                )}
              </Button>
            ) : (
              <Button variant={affordable ? "default" : "secondary"} disabled={!affordable}>
                <Gem className="size-4" /> {item.priceGems}
                {!affordable && " — not enough"}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
