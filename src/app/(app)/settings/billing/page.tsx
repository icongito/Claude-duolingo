import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CreditCard, Crown, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CancelSubscriptionDialog } from "@/components/settings/cancel-subscription-dialog";
import { DEMO_BILLING, DEMO_INVOICES, getPlan } from "@/lib/data/economy";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  const billing = DEMO_BILLING;
  const plan = getPlan(billing.plan);
  const price = billing.cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link
          href="/settings"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" /> Settings
        </Link>
        <h1 className="font-pixel mt-2 text-2xl sm:text-3xl">Billing</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your plan, payment method, and receipts.
        </p>
      </div>

      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display flex items-center gap-2 text-lg font-bold">
              <Crown className="text-accent size-5" /> {plan.name}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              ${price.toFixed(2)}/month, billed {billing.cycle} · renews{" "}
              {billing.renewsOn}
            </p>
          </div>
          <Badge variant={billing.status === "active" ? "default" : "outline"} className="capitalize">
            {billing.status}
          </Badge>
        </div>
        <ul className="text-muted-foreground grid gap-1.5 text-sm sm:grid-cols-2">
          <li>Unlimited hearts</li>
          <li>1 free streak repair / month</li>
          <li>{plan.monthlyGemStipend} gems monthly stipend</li>
          <li>Mentor: {plan.mentorDailyMessages}/day (smart model)</li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/premium">Change plan</Link>
          </Button>
          <CancelSubscriptionDialog planName={plan.name} renewsOn={billing.renewsOn} />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <h2 className="font-display flex items-center gap-2 text-lg font-bold">
          <CreditCard className="text-primary size-5" /> Payment method
        </h2>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm">
            {billing.paymentMethod.brand} •••• {billing.paymentMethod.last4}
            <span className="text-muted-foreground">
              {" "}
              · expires {billing.paymentMethod.expires}
            </span>
          </p>
          <Button variant="secondary" size="sm">
            Update card
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          Demo billing — card details are sample data. Production uses Stripe;
          CodeQuest never sees or stores raw card numbers.
        </p>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <h2 className="font-display flex items-center gap-2 text-lg font-bold">
          <ReceiptText className="text-primary size-5" /> Invoices
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-border border-b text-left text-xs uppercase tracking-wider">
                <th className="pb-2 pr-4 font-semibold">Date</th>
                <th className="pb-2 pr-4 font-semibold">Description</th>
                <th className="pb-2 pr-4 font-semibold">Amount</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_INVOICES.map((inv) => (
                <tr key={inv.id} className="border-border border-b last:border-0">
                  <td className="py-2.5 pr-4 whitespace-nowrap">{inv.date}</td>
                  <td className="py-2.5 pr-4">{inv.description}</td>
                  <td className="py-2.5 pr-4">${inv.amountUsd.toFixed(2)}</td>
                  <td className="py-2.5 capitalize">
                    <Badge variant="outline" className="capitalize">
                      {inv.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
