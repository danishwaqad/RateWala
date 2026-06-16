import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorDetail } from "@/components/vendor-detail";
import { getVendorBySlug } from "@/lib/data/vendors";
import { getVendorReviews } from "@/lib/data/reviews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface VendorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) return { title: "Vendor Not Found — RateWala" };
  return {
    title: `${vendor.name} — RateWala`,
    description: `View rates from ${vendor.name} in ${vendor.area}.`,
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const reviews = await getVendorReviews(vendor.id);

  return <VendorDetail vendor={vendor} reviews={reviews} />;}
