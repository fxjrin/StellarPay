import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent text-white hover:opacity-80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:opacity-80",
        destructive: "border-transparent text-white hover:opacity-80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  // Define inline styles for variants that need specific colors
  let variantStyle: React.CSSProperties = {}

  if (variant === "default" || !variant) {
    variantStyle = {
      backgroundColor: '#3b82f6', // primary blue
      color: '#ffffff',
      ...style
    }
  } else if (variant === "destructive") {
    variantStyle = {
      backgroundColor: '#ef4444', // destructive red
      color: '#ffffff',
      ...style
    }
  } else if (variant === "outline") {
    variantStyle = {
      borderColor: '#e5e7eb', // border color
      ...style
    }
  } else {
    variantStyle = style || {}
  }

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={variantStyle}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
