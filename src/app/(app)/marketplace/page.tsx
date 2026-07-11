import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Coins,
  Dices,
  FlameKindling,
  Gem,
  HeartPulse,
  Snowflake,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WearableGrid } from "@/components/marketplace/wearable-grid";
import { MARKETPLACE_ITEMS } from "@/lib/data/demo-misc";
import { CONSUMABLES, GEM_PACKS } from "@/lib/data/economy";
import { DEMO_USER } from "@/lib/data/demo-user";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Marketplace" };

const RARITY_STYLE: Record<string, string> = {
  common: "border-border text-muted-foreground",
  rare: "border-info/50 text-info",
  epic: "border-[#b78bff]/50 text-[#b78bff]",
  legendary: "border-accent/60 text-accent",
};

const CONSUMABLE_ICONS: Record<string, LucideIcon> = {
  Snowflake,
  FlameKindling,
  HeartPulse,
  Dices,
};

function SectionHeading({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-1 text-sm">{blurb}</p>
    </div>
  );
}

export default function MarketplacePage() {
  const user = DEMO_USER;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-pixel text-2xl sm:text-3xl">Marketplace</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Time, protection, and looks — nothing here makes the game easier. Ever.
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

      <section className="flex flex-col gap-4">
        <SectionHeading
          title="Little Guy's wardrobe"
          blurb="Wearables follow him through every animation — lessons, bosses, level-ups."
        />
        <WearableGrid />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading
          title="Boosts & protection"
          blurb="The serious gem sinks: protect a streak, refill hearts, reroll a quest."
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONSUMABLES.map((item) => {
            const Icon = CONSUMABLE_ICONS[item.icon] ?? Snowflake;
            const affordable = user.gems >= item.priceGems;
            const maxedOut = item.maxHeld !== undefined && item.owned >= item.maxHeld;
            return (
              <Card key={item.slug} className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="bg-gem/15 text-gem flex size-10 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  {item.owned > 0 && (
                    <Badge variant="secondary">
                      Owned ×{item.owned}
                      {item.maxHeld ? ` / ${item.maxHeld}` : ""}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="font-display font-semibold">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
                <Button
                  variant={affordable && !maxedOut ? "default" : "secondary"}
                  disabled={!affordable || maxedOut}
                >
                  {maxedOut ? (
                    <>
                      <Check className="size-4" /> Max held
                    </>
                  ) : (
                    <>
                      <Gem className="size-4" /> {item.priceGems}
                      {!affordable && " — not enough"}
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeading
          title="Cosmetics"
          blurb="Themes, avatars, frames, and titles. Pure style."
        />
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
      </section>

      <Card className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display font-bold">Running low on gems?</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Quests pay {`5-10`}/week, boss first-clears pay 10 — or top up with a
            one-time pack ({GEM_PACKS.map((p) => `${p.gems} for $${p.priceUsd}`).join(" · ")}).
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Button variant="secondary" asChild>
            <Link href="/quests">Do quests</Link>
          </Button>
          <Button asChild>
            <Link href="/premium">Get gems</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
