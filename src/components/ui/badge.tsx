import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary-soft border-primary/30 text-[--cq-orange-soft]",
        gold: "bg-accent/15 text-accent border-accent/30",
        secondary: "bg-secondary text-secondary-foreground border-border",
        outline: "bg-transparent text-foreground border-border",
        success: "bg-success/15 text-success border-success/30",
        destructive: "bg-destructive/15 text-destructive border-destructive/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
