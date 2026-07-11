import Link from "next/link";
import { Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GEM_PACKS } from "@/lib/data/economy";

export function GemPackRow() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-xl font-bold">Gem packs</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Top up if quests are too slow. Gems only ever buy protection and
          cosmetics — streak freezes, heart refills, hats for Little Guy.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {GEM_PACKS.map((pack) => (
          <Card key={pack.id} className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-gem inline-flex items-center gap-1.5 font-display text-lg font-bold">
                <Gem className="size-5" /> {pack.gems}
              </span>
              {pack.badge && <Badge variant="secondary">{pack.badge}</Badge>}
            </div>
            <p className="text-muted-foreground flex-1 text-sm">{pack.name}</p>
            <Button variant="secondary" asChild>
              <Link href={`/premium/checkout?pack=${pack.id}`}>
                ${pack.priceUsd.toFixed(2)}
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
