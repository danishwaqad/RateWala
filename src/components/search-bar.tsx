"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/locale-toggle";

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

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={size === "lg" ? "pl-10 h-12 text-base" : "pl-10"}
        />
        <Button
          type="submit"
          size={size === "lg" ? "default" : "sm"}
          className="absolute right-1"
          loading={loading}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
