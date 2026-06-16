import type { Metadata } from "next";
import { AdminVendorsTable } from "@/components/admin/admin-vendors-table";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllVendorsForAdmin } from "@/lib/data/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — RateWala",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await requireAdmin();
  const vendors = await getAllVendorsForAdmin();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve new listings and manage verified badges.
        </p>
      </div>

      <h2 className="mb-3 text-lg font-semibold">All Vendors</h2>
      <AdminVendorsTable initialVendors={vendors} />
    </div>
  );
}
