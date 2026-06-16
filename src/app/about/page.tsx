import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout, Section } from "@/components/static-page-layout";

export const metadata: Metadata = {
  title: "About Us — RateWala",
  description:
    "Learn about RateWala — Pakistan's platform to compare restaurant menu prices and wholesale supplier rates.",
};

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="About RateWala"
      subtitle="Every price. One platform. Built for customers and local businesses across Pakistan."
      showCta
    >
      <p className="text-foreground">
        RateWala helps people discover what restaurants and wholesale suppliers charge — before they
        order, call, or visit. We bring menu prices and mandi rates into one simple, searchable
        place.
      </p>

      <Section title="Our mission">
        <p>
          Price information in Pakistan is often scattered across WhatsApp groups, paper menus, and
          word of mouth. RateWala makes it easier to compare rates, find businesses near you, and
          make informed decisions — whether you are ordering biryani for dinner or sourcing oil and
          rice for your shop.
        </p>
      </Section>

      <Section title="What you can do on RateWala">
        <ul className="list-disc space-y-2 pl-5">
          <li>Browse restaurant menus and live price lists</li>
          <li>Compare wholesale supplier rates for groceries and essentials</li>
          <li>Search by food item, category, or business name</li>
          <li>Read reviews and ratings from signed-in users</li>
          <li>Contact businesses directly via phone or WhatsApp</li>
        </ul>
      </Section>

      <Section title="For business owners">
        <p>
          Restaurants and suppliers can list their business for free, upload menu photos, manage
          prices from a personal dashboard, and reach customers looking for transparent rates.
        </p>
        <p>
          Ready to get started?{" "}
          <Link href="/add-shop" className="font-medium text-teal hover:underline">
            List your business on RateWala
          </Link>
          .
        </p>
      </Section>

      <Section title="Transparency & trust">
        <p>
          Prices on RateWala are added and updated by business owners. We encourage accurate,
          up-to-date listings and verified reviews from real customers. If you spot incorrect
          information, please contact the business directly or reach out to us.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions, feedback, or partnership ideas? Email us at{" "}
          <a href="mailto:hello@ratewala.pk" className="font-medium text-teal hover:underline">
            hello@ratewala.pk
          </a>
          .
        </p>
      </Section>
    </StaticPageLayout>
  );
}
