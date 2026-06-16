"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function StarRatingInput({
  value,
  onChange,
  disabled = false,
  size = "md",
}: StarRatingInputProps) {
  const starSize = size === "sm" ? "h-5 w-5" : "h-7 w-7";

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-checked={value === star}
          role="radio"
          className={cn(
            "rounded p-0.5 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            !disabled && "hover:scale-110"
          )}
          onClick={() => onChange(star)}
        >
          <Star
            className={cn(
              starSize,
              star <= value ? "fill-orange text-orange" : "text-muted-foreground/40"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function StarRatingDisplay({
  rating,
  className,
  size = "sm",
}: {
  rating: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star className={cn(starSize, "fill-orange text-orange shrink-0")} />
      <span>{Number(rating).toFixed(1)}</span>
    </span>
  );
}

export function StarRatingReadonly({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            starSize,
            star <= rating ? "fill-orange text-orange" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}
