"use client";

import Link from "next/link";
import { HeaderAuth, MobileHeaderAuth } from "@/components/auth/header-auth";
import { SearchBar } from "@/components/search-bar";
import { useTranslation } from "@/components/locale-toggle";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-14 items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center">
          <span className="text-lg font-bold tracking-tight text-teal">RateWala</span>
        </Link>

        <div className="hidden flex-1 md:block md:max-w-lg md:mx-auto">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <HeaderAuth />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-teal">RateWala</SheetTitle>
              </SheetHeader>
              <div className="mt-5 flex flex-col gap-3">
                <SearchBar />
                <MobileHeaderAuth />
                <nav className="flex flex-col gap-1 border-t pt-3">
                  <Link href="/menu" className="py-2 text-sm font-medium hover:text-teal">
                    {t("viewMenu")}
                  </Link>
                  <Link href="/mandi" className="py-2 text-sm font-medium hover:text-teal">
                    {t("mandiRates")}
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-2.5 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
