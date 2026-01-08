import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Custom Algobox variants
        success: "border-transparent bg-success/20 text-success",
        warning: "border-transparent bg-warning/20 text-warning",
        info: "border-transparent bg-primary/20 text-primary",
        muted: "border-transparent bg-muted text-muted-foreground",
        // Skill level badges
        beginner: "border-transparent bg-success/20 text-success",
        intermediate: "border-transparent bg-warning/20 text-warning",
        advanced: "border-transparent bg-destructive/20 text-destructive",
        // Status badges
        active: "border-success/50 bg-success/10 text-success",
        pending: "border-warning/50 bg-warning/10 text-warning",
        completed: "border-primary/50 bg-primary/10 text-primary",
        locked: "border-muted bg-muted/50 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
