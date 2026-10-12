"use client";

import React, { useEffect, useState } from "react";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  className?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState<number>(direction === "down" ? value : 0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms
    let animationFrameId: number;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // easeOutExpo function for a sleek premium deceleration feel
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

        if (direction === "up") {
          setDisplayValue(ease * value);
        } else {
          setDisplayValue(value - ease * value);
        }

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, direction, delay]);

  return (
    <span className={className}>
      {displayValue.toLocaleString("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}
    </span>
  );
}
