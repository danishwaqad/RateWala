"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/locale-toggle";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  defaultValue?: string;
  size?: "default" | "lg";
}

export function SearchBar({ className, defaultValue = "", size = "default" }: SearchBarProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setTimeout(() => setLoading(false), 500);
  };

  const isLarge = size === "lg";

  return (
    <form onSubmit={handleSearch} className={className}>
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-white shadow-soft transition-shadow focus-within:border-teal/40 focus-within:shadow-glow",
          isLarge ? "h-14" : "h-11"
        )}
      >
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
            isLarge ? "h-14 pl-11 pr-28 text-base" : "h-11 pl-10 pr-20"
          )}
        />
        <Button
          type="submit"
          size={isLarge ? "default" : "sm"}
          className={cn("absolute right-1.5 rounded-lg", isLarge && "h-10 px-5")}
          loading={loading}
        >
          Search
        </Button>
      </div>
    </form>
  );
}
