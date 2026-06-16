import Link from "next/link";
import { t } from "@/lib/i18n";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-teal">404</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("notFoundTitle")}</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition-colors"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
