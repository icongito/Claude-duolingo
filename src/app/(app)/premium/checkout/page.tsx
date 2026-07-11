import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGemPack, getPlan, type PlanId } from "@/lib/data/economy";
import { CheckoutForm, type OrderSummary } from "@/components/premium/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

const PLAN_IDS: PlanId[] = ["premium", "premium_plus"];

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; cycle?: string; pack?: string }>;
}) {
  const { plan: planParam, cycle: cycleParam, pack: packParam } = await searchParams;

  let order: OrderSummary | null = null;

  if (packParam) {
    const pack = getGemPack(packParam);
    if (pack) {
      order = {
        kind: "pack",
        title: pack.name,
        detail: `${pack.gems} gems — one-time purchase`,
        amountUsd: pack.priceUsd,
        recurring: null,
      };
    }
  } else if (planParam && PLAN_IDS.includes(planParam as PlanId)) {
    const plan = getPlan(planParam as PlanId);
    const cycle = cycleParam === "monthly" ? "monthly" : "yearly";
    const perMonth = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    order = {
      kind: "plan",
      title: `${plan.name} — ${cycle}`,
      detail:
        cycle === "yearly"
          ? `$${perMonth.toFixed(2)}/month, billed $${(perMonth * 12).toFixed(2)} today`
          : `$${perMonth.toFixed(2)}/month, billed monthly`,
      amountUsd: cycle === "yearly" ? perMonth * 12 : perMonth,
      recurring: cycle,
    };
  }

  if (!order) notFound();

  return <CheckoutForm order={order} />;
}
