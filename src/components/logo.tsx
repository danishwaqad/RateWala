import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "light";
}

const sizeMap = {
  sm: { icon: "h-8 w-8 rounded-lg text-xs", text: "text-base" },
  md: { icon: "h-9 w-9 rounded-xl text-sm", text: "text-xl" },
  lg: { icon: "h-11 w-11 rounded-xl text-base", text: "text-2xl" },
};

export function Logo({ className, showText = true, href = "/", size = "md", variant = "default" }: LogoProps) {
  const sizes = sizeMap[size];
  const isLight = variant === "light";

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-teal-800 font-bold text-white shadow-lg shadow-teal-600/30",
          sizes.icon
        )}
      >
        <span className="relative z-10">Rs</span>
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight", sizes.text)}>
          <span className={isLight ? "text-white" : "text-foreground"}>Rate</span>
          <span
            className={cn(
              isLight
                ? "text-teal-300"
                : "bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent"
            )}
          >
            Wala
          </span>
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex transition-opacity hover:opacity-90">
      {content}
    </Link>
  );
}
