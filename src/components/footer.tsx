import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { t } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold text-teal">
              RateWala
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              From restaurant menus to wholesale markets — every price in one place.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/menu" className="hover:text-teal transition-colors">
                  Restaurant Menus
                </Link>
              </li>
              <li>
                <Link href="/mandi" className="hover:text-teal transition-colors">
                  Wholesale Rates
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-teal transition-colors">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("contact")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal" />
                <a href="tel:+923001234567" className="hover:text-teal transition-colors">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal" />
                <a href="mailto:hello@ratewala.pk" className="hover:text-teal transition-colors">
                  hello@ratewala.pk
                </a>
              </li>
              <li>Pakistan</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold">{t("followUs")}</h4>
            <div className="flex gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-teal hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-teal hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-muted-foreground">
          RateWala © 2026. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
