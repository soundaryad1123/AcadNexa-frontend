import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "emerald" | "amber" | "indigo" | "purple";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-white",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-red-800/60 bg-red-950/80 text-rose-300",
    outline: "text-foreground border-border",
    emerald: "border-emerald-800/60 bg-emerald-950/80 text-accent-emerald",
    amber: "border-amber-800/60 bg-amber-950/80 text-accent-amber",
    indigo: "border-indigo-800/60 bg-indigo-950/80 text-indigo-300",
    purple: "border-purple-800/60 bg-purple-950/80 text-purple-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
