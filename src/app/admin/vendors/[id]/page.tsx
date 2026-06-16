import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BusinessDashboard } from "@/components/dashboard/business-dashboard";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllVendorsForAdmin } from "@/lib/data/admin";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface AdminVendorPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Manage Business — Admin | RateWala",
  robots: { index: false, follow: false },
};

export default async function AdminVendorPage({ params }: AdminVendorPageProps) {
  await requireAdmin();
  const { id } = await params;
  const vendors = await getAllVendorsForAdmin();
  const vendor = vendors.find((entry) => entry.id === id);

  if (!vendor) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 md:py-8">
      <Link
        href="/admin"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-teal"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin Panel
      </Link>
      <BusinessDashboard adminVendorId={id} isAdminMode />
    </div>
  );
}
