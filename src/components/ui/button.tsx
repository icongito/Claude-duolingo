import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary to-[#ff8f2f] text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_20px_-6px_rgba(255,122,26,0.55)] hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_10px_28px_-6px_rgba(255,122,26,0.7)] hover:brightness-105",
        gold: "bg-gradient-to-b from-accent to-[#ffb733] text-accent-foreground shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_8px_20px_-6px_rgba(255,200,87,0.55)] hover:brightness-105",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-card",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary/60",
        ghost: "text-foreground hover:bg-secondary/60",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm rounded-lg",
        lg: "h-13 px-8 text-base rounded-2xl",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
