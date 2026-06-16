"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/components/locale-toggle";
import type { ApprovalStatus, Vendor } from "@/types/database";

interface AdminVendorsTableProps {
  initialVendors: Vendor[];
}

const statusVariant: Record<ApprovalStatus, "default" | "secondary" | "outline"> = {
  approved: "default",
  pending: "secondary",
  rejected: "outline",
};

export function AdminVendorsTable({ initialVendors }: AdminVendorsTableProps) {
  const { t } = useTranslation();
  const [vendors, setVendors] = useState(initialVendors);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function patchVendor(
    vendorId: string,
    patch: Partial<Pick<Vendor, "is_verified" | "approval_status">>
  ) {
    setUpdatingId(vendorId);
    setError(null);

    const response = await fetch(`/api/admin/vendors/${vendorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    const payload = (await response.json()) as { vendor?: Vendor; error?: string };

    setUpdatingId(null);

    if (!response.ok || !payload.vendor) {
      setError(payload.error ?? "Update failed. Check SUPABASE_SERVICE_ROLE_KEY.");
      return;
    }

    setVendors((current) =>
      current.map((vendor) => (vendor.id === vendorId ? payload.vendor! : vendor))
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No vendors found.
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => {
                const busy = updatingId === vendor.id;

                return (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-xs text-muted-foreground">/{vendor.slug}</div>
                    </TableCell>
                    <TableCell>{vendor.area}</TableCell>
                    <TableCell className="capitalize">{vendor.type}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[vendor.approval_status]}>
                        {vendor.approval_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={vendor.is_verified}
                        disabled={busy}
                        onCheckedChange={(checked) =>
                          patchVendor(vendor.id, { is_verified: checked })
                        }
                        aria-label={`Verified toggle for ${vendor.name}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" asChild>
                          <Link href={`/admin/vendors/${vendor.id}`}>{t("manageBusiness")}</Link>
                        </Button>
                        {vendor.approval_status !== "approved" && (
                          <Button
                            size="sm"
                            disabled={busy}
                            onClick={() => patchVendor(vendor.id, { approval_status: "approved" })}
                          >
                            Approve
                          </Button>
                        )}
                        {vendor.approval_status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => patchVendor(vendor.id, { approval_status: "rejected" })}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
