import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { t } from "@/lib/i18n";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-navy-900 text-slate-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo href="/" size="md" variant="light" />
            <p className="text-sm leading-relaxed text-slate-400">
              From restaurant menus to wholesale markets — every price in one place.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/menu" className="transition-colors hover:text-teal-300">
                  Restaurant Menus
                </Link>
              </li>
              <li>
                <Link href="/mandi" className="transition-colors hover:text-teal-300">
                  Wholesale Rates
                </Link>
              </li>
              <li>
                <Link href="/add-shop" className="transition-colors hover:text-teal-300">
                  List Your Business
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-teal-300">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-teal-300">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{t("contact")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-teal-400" />
                <a href="tel:+923001234567" className="transition-colors hover:text-white">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-teal-400" />
                <a href="mailto:hello@ratewala.pk" className="transition-colors hover:text-white">
                  hello@ratewala.pk
                </a>
              </li>
              <li className="text-slate-400">Pakistan</li>
            </ul>

            <div className="mt-5 flex gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition-colors hover:bg-teal-600 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition-colors hover:bg-teal-600 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>RateWala © 2026. All rights reserved.</p>
          <p>Built for transparent pricing across Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
