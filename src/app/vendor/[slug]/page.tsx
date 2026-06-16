import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorDetail } from "@/components/vendor-detail";
import { getVendorBySlug } from "@/lib/data/vendors";
import { getVendorReviews } from "@/lib/data/reviews";
import { isRatesStale } from "@/lib/data/freshness";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

function getVendorSeoTitle(vendor: Awaited<ReturnType<typeof getVendorBySlug>>) {
  if (!vendor) return "RateWala";

  if (vendor.type === "restaurant") {
    return `${vendor.name} Menu - ${vendor.area} Multan | RateWala`;
  }

  return `${vendor.name} Wholesale Rates - ${vendor.area} | RateWala`;
}

function getVendorSeoDescription(vendor: NonNullable<Awaited<ReturnType<typeof getVendorBySlug>>>) {
  const minPrice =
    vendor.min_price != null ? ` Prices from ${formatPrice(vendor.min_price)}.` : "";

  if (vendor.description?.trim()) {
    return `${vendor.description.trim()}${minPrice} Contact on WhatsApp via RateWala.`;
  }

  return `View live rates from ${vendor.name} in ${vendor.area}, Multan.${minPrice} Compare prices and order on WhatsApp.`;
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor || vendor.approval_status !== "approved") {
    return { title: "Vendor Not Found — RateWala" };
  }

  const title = getVendorSeoTitle(vendor);
  const description = getVendorSeoDescription(vendor);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ratewala.vercel.app";
  const url = `${siteUrl}/vendor/${vendor.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "RateWala",
      type: "website",
      images: vendor.image_url?.startsWith("http") ? [{ url: vendor.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const reviews = await getVendorReviews(vendor.id);
  const ratesStale = isRatesStale(vendor.products);

  return (
    <VendorDetail
      vendor={vendor}
      reviews={reviews}
      ratesStale={ratesStale}
      showPendingBanner={vendor.approval_status === "pending"}
    />
  );
}
