import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "emerald";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      default: "bg-primary text-white hover:bg-primary-600 shadow-md shadow-primary/20",
      destructive: "bg-destructive text-white hover:bg-red-600 shadow-md shadow-red-500/20",
      outline: "border border-border bg-transparent hover:bg-secondary text-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-slate-800",
      ghost: "hover:bg-secondary hover:text-foreground text-muted-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      emerald: "bg-accent-emerald text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
