"use client";

import Link from "next/link";
import { MapPin, Phone, BadgeCheck, MessageCircle, Settings } from "lucide-react";
import type { VendorReview, VendorWithProducts } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductTable } from "@/components/product-table";
import { VendorReviews } from "@/components/vendor-reviews";
import { StarRatingDisplay } from "@/components/star-rating-input";
import { StaleRatesBadge } from "@/components/stale-rates-badge";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { useTranslation } from "@/components/locale-toggle";
import { useOwnerVendor } from "@/lib/hooks/use-owner-vendor";
import { getWhatsAppUrl } from "@/lib/utils";
import { useState } from "react";

interface VendorDetailProps {
  vendor: VendorWithProducts;
  reviews: VendorReview[];
  ratesStale?: boolean;
  showPendingBanner?: boolean;
}

export function VendorDetail({
  vendor,
  reviews,
  ratesStale = false,
  showPendingBanner = false,
}: VendorDetailProps) {
  const { t } = useTranslation();
  const { vendor: ownerVendor } = useOwnerVendor();
  const [loading, setLoading] = useState(false);
  const isOwner = ownerVendor?.id === vendor.id;
  const reviewCount = vendor.review_count ?? 0;
  const hasReviews = reviewCount > 0;
  const whatsappMessage = `Hi, I'd like to inquire about prices at ${vendor.name}.`;
  const whatsappUrl = getWhatsAppUrl(vendor.whatsapp, whatsappMessage);

  if (vendor.approval_status === "rejected" && !isOwner) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">This listing is not available.</p>
      </div>
    );
  }

  return (
    <div>
      {showPendingBanner && isOwner && (
        <div className="border-b bg-amber-50">
          <div className="container mx-auto px-4 py-2.5 text-sm text-amber-900">{t("pendingApproval")}</div>
        </div>
      )}

      {isOwner && (
        <div className="border-b bg-teal/5">
          <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
            <span className="text-muted-foreground">{t("ownerBanner")}</span>
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard">
                <Settings className="h-4 w-4" />
                {t("manageListing")}
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={vendor.image_url || "/placeholder.svg"}
          alt={vendor.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={vendor.type === "supplier" ? "secondary" : "default"}>
              {vendor.type === "supplier" ? t("supplier") : t("restaurant")}
            </Badge>
            {vendor.is_verified && (
              <Badge variant="verified" className="gap-1 bg-white/20 text-white border-white/30">
                <BadgeCheck className="h-3 w-3" />
                {t("verified")}
              </Badge>
            )}
            {ratesStale && <StaleRatesBadge className="border-amber-200/60 bg-amber-500/20 text-amber-50" />}
            {hasReviews ? (
              <StarRatingDisplay rating={vendor.rating} className="text-sm text-white" size="sm" />
            ) : (
              <Badge className="bg-white/20 text-white border-white/30">{t("newBusiness")}</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">{vendor.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal shrink-0" />
              {vendor.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-teal shrink-0" />
              <a href={`tel:+92${vendor.phone.replace(/^0/, "")}`} className="hover:text-teal">
                {vendor.phone}
              </a>
            </p>
          </div>

          <Button variant="whatsapp" size="lg" className="shrink-0 w-full sm:w-auto" loading={loading} asChild>
            <WhatsAppLink
              vendorId={vendor.id}
              href={whatsappUrl}
              onNavigate={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 400);
              }}
            >
              <MessageCircle className="h-5 w-5" />
              {t("orderWhatsApp")}
            </WhatsAppLink>
          </Button>
        </div>

        <Tabs defaultValue="rates">
          <TabsList>
            <TabsTrigger value="rates">{t("rateList")}</TabsTrigger>
            <TabsTrigger value="about">{t("about")}</TabsTrigger>
            <TabsTrigger value="reviews">
              {t("reviews")}
              {reviewCount > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground">({reviewCount})</span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rates">
            <ProductTable
              products={vendor.products}
              ratesStale={ratesStale}
              labels={{
                item: t("item"),
                rate: t("rate"),
                lastUpdated: t("lastUpdated"),
              }}
            />
          </TabsContent>

          <TabsContent value="about">
            <div className="rounded-lg border p-6">
              <p className="text-muted-foreground leading-relaxed">
                {vendor.description ?? "No description available."}
              </p>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <span className="font-medium">Area:</span> {vendor.area}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {vendor.type === "supplier" ? "Wholesale Supplier" : "Restaurant"}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <VendorReviews
              vendorId={vendor.id}
              vendorSlug={vendor.slug}
              averageRating={vendor.rating}
              reviewCount={reviewCount}
              isOwner={isOwner}
              initialReviews={reviews}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
