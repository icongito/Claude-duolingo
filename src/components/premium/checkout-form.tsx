"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Info, Lock, PartyPopper } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LittleGuy } from "@/components/mascot/little-guy";

export type OrderSummary = {
  kind: "plan" | "pack";
  title: string;
  detail: string;
  amountUsd: number;
  recurring: "monthly" | "yearly" | null;
};

const checkoutSchema = z.object({
  name: z.string().min(2, "Name on card is required"),
  email: z.email("Enter a valid email"),
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{15,16}$/, "Card number must be 15-16 digits")),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY"),
  cvc: z.string().regex(/^\d{3,4}$/, "3-4 digits"),
});

type Field = keyof z.infer<typeof checkoutSchema>;

export function CheckoutForm({ order }: { order: OrderSummary }) {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<"editing" | "processing" | "done">("editing");

  function set(field: Field, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as Field;
        if (!next[field]) next[field] = issue.message;
      }
      setErrors(next);
      return;
    }
    setState("processing");
    // Demo checkout: no processor is wired up, so "payment" is a short
    // client-side pause. Production swaps this for a Stripe confirm call.
    setTimeout(() => setState("done"), 900);
  }

  if (state === "done") {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex flex-col items-center gap-5"
        >
          <LittleGuy animation="level" size={200} />
          <h1 className="font-pixel text-3xl">
            {order.kind === "plan" ? "Welcome aboard!" : "Gems delivered!"}
          </h1>
          <p className="text-muted-foreground max-w-sm">
            {order.kind === "plan"
              ? `${order.title} is active. Unlimited hearts, streak protection, and your smarter mentor are live right now.`
              : `${order.detail.split("—")[0].trim()} just landed in your account. Spend them wisely — they don't grow on trees.`}
          </p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <PartyPopper className="size-3.5" /> Demo checkout — nothing was charged.
          </p>
          <div className="mt-2 flex gap-3">
            <Button size="lg" asChild>
              <Link href="/dashboard">Back to learning</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/settings/billing">Manage billing</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const fieldError = (f: Field) =>
    errors[f] && (
      <p className="text-destructive text-xs" role="alert">
        {errors[f]}
      </p>
    );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Link
        href="/premium"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" /> Back to plans
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <h1 className="font-display flex items-center gap-2 text-xl font-bold">
              <CreditCard className="text-primary size-5" /> Payment details
            </h1>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="co-name">Name on card</Label>
              <Input
                id="co-name"
                autoComplete="cc-name"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              {fieldError("name")}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="co-email">Email for receipts</Label>
              <Input
                id="co-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
              {fieldError("email")}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="co-card">Card number</Label>
              <Input
                id="co-card"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                value={values.cardNumber}
                onChange={(e) => set("cardNumber", e.target.value)}
                aria-invalid={Boolean(errors.cardNumber)}
              />
              {fieldError("cardNumber")}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="co-expiry">Expiry</Label>
                <Input
                  id="co-expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={values.expiry}
                  onChange={(e) => set("expiry", e.target.value)}
                  aria-invalid={Boolean(errors.expiry)}
                />
                {fieldError("expiry")}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="co-cvc">CVC</Label>
                <Input
                  id="co-cvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={values.cvc}
                  onChange={(e) => set("cvc", e.target.value)}
                  aria-invalid={Boolean(errors.cvc)}
                />
                {fieldError("cvc")}
              </div>
            </div>

            <Button size="lg" type="submit" disabled={state === "processing"}>
              <Lock className="size-4" />
              {state === "processing"
                ? "Processing…"
                : `Pay $${order.amountUsd.toFixed(2)}${order.recurring ? ` / ${order.recurring === "yearly" ? "year" : "month"}` : ""}`}
            </Button>

            <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              Demo checkout — no payment processor is connected and no card is
              ever charged or stored. In production this form is replaced by
              Stripe Elements.
            </p>
          </form>
        </Card>

        <Card className="h-fit p-6">
          <h2 className="font-display font-bold">Order summary</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <span>{order.title}</span>
              <span className="font-semibold">${order.amountUsd.toFixed(2)}</span>
            </div>
            <p className="text-muted-foreground">{order.detail}</p>
          </div>
          <div className="border-border mt-4 flex justify-between border-t pt-4 text-sm font-bold">
            <span>Due today</span>
            <span>${order.amountUsd.toFixed(2)}</span>
          </div>
          {order.recurring && (
            <p className="text-muted-foreground mt-2 text-xs">
              Renews {order.recurring}. Cancel anytime from Settings → Billing;
              you keep access until the period ends.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
