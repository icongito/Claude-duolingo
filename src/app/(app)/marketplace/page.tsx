import type { Metadata } from "next";
import { Check, Coins, Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MARKETPLACE_ITEMS } from "@/lib/data/demo-misc";
import { DEMO_USER } from "@/lib/data/demo-user";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Marketplace" };

const RARITY_STYLE: Record<string, string> = {
  common: "border-border text-muted-foreground",
  rare: "border-info/50 text-info",
  epic: "border-[#b78bff]/50 text-[#b78bff]",
  legendary: "border-accent/60 text-accent",
};

export default function MarketplacePage() {
  const user = DEMO_USER;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-pixel text-2xl sm:text-3xl">Marketplace</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Cosmetics only — nothing here makes the game easier. Ever.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm font-bold text-gold">
            <Coins className="size-4" /> {user.coins.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm font-bold text-gem">
            <Gem className="size-4" /> {user.gems}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MARKETPLACE_ITEMS.map((item) => {
          const affordable =
            item.priceCurrency === "coins"
              ? user.coins >= item.price
              : user.gems >= item.price;

          return (
            <Card key={item.slug} className="gap-4 overflow-hidden p-0">
              <div
                className="flex h-28 items-end justify-between p-4"
                style={{
                  background: `linear-gradient(135deg, ${item.gradient[0]}33, ${item.gradient[1]}33)`,
                }}
              >
                <Badge
                  variant="outline"
                  className={cn("capitalize backdrop-blur", RARITY_STYLE[item.rarity])}
                >
                  {item.rarity}
                </Badge>
                <Badge variant="secondary" className="capitalize backdrop-blur">
                  {item.type.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
                <h2 className="font-display font-semibold">{item.name}</h2>
                <p className="text-muted-foreground flex-1 text-sm">
                  {item.description}
                </p>
                {item.owned ? (
                  <Button variant="secondary" disabled className="mt-2">
                    <Check className="size-4" /> Owned
                  </Button>
                ) : (
                  <Button
                    variant={affordable ? "default" : "secondary"}
                    disabled={!affordable}
                    className="mt-2"
                  >
                    {item.priceCurrency === "coins" ? (
                      <Coins className="size-4" />
                    ) : (
                      <Gem className="size-4" />
                    )}
                    {item.price.toLocaleString()}
                    {!affordable && " — not enough"}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
