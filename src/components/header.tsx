"use client";

import Link from "next/link";
import { HeaderAuth, MobileHeaderAuth } from "@/components/auth/header-auth";
import { SearchBar } from "@/components/search-bar";
import { Logo } from "@/components/logo";
import { useTranslation } from "@/components/locale-toggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/80 hover:text-foreground";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 glass">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 lg:flex">
          <Link href="/menu" className={navLinkClass}>
            {t("viewMenu")}
          </Link>
          <Link href="/mandi" className={navLinkClass}>
            {t("mandiRates")}
          </Link>
        </nav>

        <div className="hidden flex-1 md:block md:max-w-md lg:max-w-lg md:mx-auto">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <HeaderAuth />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>
                  <Logo href={undefined} size="sm" />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <SearchBar />
                <MobileHeaderAuth />
                <nav className="flex flex-col gap-1 border-t pt-4">
                  <Link href="/menu" className={cn(navLinkClass, "px-0")}>
                    {t("viewMenu")}
                  </Link>
                  <Link href="/mandi" className={cn(navLinkClass, "px-0")}>
                    {t("mandiRates")}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
