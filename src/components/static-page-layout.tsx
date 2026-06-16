import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StaticPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showCta?: boolean;
}

export function StaticPageLayout({
  title,
  subtitle,
  children,
  showCta = false,
}: StaticPageLayoutProps) {
  return (
    <div className="border-b">
      <div className="relative overflow-hidden mesh-hero border-b">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container relative mx-auto max-w-3xl px-4 py-12 md:py-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal">RateWala</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground md:text-base">
          {children}
        </div>

        {showCta && (
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild className="rounded-xl">
              <Link href="/menu">Browse Menus</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-xl bg-white">
              <Link href="/add-shop">List Your Business</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export { Section };
