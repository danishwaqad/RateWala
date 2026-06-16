"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, BadgeCheck, MessageCircle, Phone } from "lucide-react";
import type { VendorWithProducts } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VendorImage } from "@/components/vendor-image";
import { StarRatingDisplay } from "@/components/star-rating-input";
import { useTranslation } from "@/components/locale-toggle";
import { formatPrice, getWhatsAppUrl, cn } from "@/lib/utils";

interface VendorCardProps {
  vendor: VendorWithProducts;
  variant?: "featured" | "listing";
  className?: string;
}

export function VendorCard({ vendor, variant = "listing", className }: VendorCardProps) {
  const { t } = useTranslation();
  const [btnLoading, setBtnLoading] = useState(false);

  const isSupplier = vendor.type === "supplier";
  const topProduct = vendor.products[0];
  const reviewCount = vendor.review_count ?? 0;
  const hasReviews = reviewCount > 0;  const whatsappMessage = isSupplier
    ? `Hi, I'd like to confirm the price for ${topProduct?.name ?? "your products"}.`
    : `Hi, I'd like to place an order from ${vendor.name}.`;

  const handleAction = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 300);
  };

  return (
    <Card className={cn("group overflow-hidden transition-all hover:shadow-md", className)}>
      <Link href={`/vendor/${vendor.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <VendorImage
            src={vendor.image_url}
            alt={vendor.name}
            className="transition-transform group-hover:scale-105"
          />
          {vendor.is_verified && (
            <Badge variant="verified" className="absolute top-2 right-2 gap-1">
              <BadgeCheck className="h-3 w-3" />
              {t("verified")}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link href={`/vendor/${vendor.slug}`}>
              <h3 className="font-semibold truncate hover:text-teal transition-colors">
                {vendor.name}
              </h3>
            </Link>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={isSupplier ? "secondary" : "default"} className="text-xs">
                {isSupplier ? t("supplier") : t("restaurant")}
              </Badge>
              <span className="flex items-center gap-0.5">
                {hasReviews ? (
                  <StarRatingDisplay rating={vendor.rating} size="sm" />
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {t("newBusiness")}
                  </Badge>
                )}
              </span>            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              {vendor.area}
            </p>
          </div>
        </div>

        {variant === "listing" && (
          <div className="mt-3">
            {isSupplier && topProduct ? (
              <p className="text-sm font-medium text-teal">
                {topProduct.name} — {formatPrice(topProduct.price)}/{topProduct.unit}
              </p>
            ) : vendor.min_price ? (
              <p className="text-sm text-muted-foreground">
                {t("startingFrom")}{" "}
                <span className="font-semibold text-foreground">
                  {formatPrice(vendor.min_price)}
                </span>
              </p>
            ) : null}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {variant === "featured" ? (
            <Button asChild className="w-full" size="sm">
              <Link href={`/vendor/${vendor.slug}`}>{t("viewRateList")}</Link>
            </Button>
          ) : isSupplier ? (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              asChild
              onClick={handleAction}
            >
              <a href={`tel:+92${vendor.phone.replace(/^0/, "")}`}>
                {btnLoading ? null : <Phone className="h-4 w-4" />}
                {t("callNow")}
              </a>
            </Button>
          ) : (
            <Button
              variant="whatsapp"
              size="sm"
              className="flex-1"
              asChild
              onClick={handleAction}
            >
              <a
                href={getWhatsAppUrl(vendor.whatsapp, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {btnLoading ? null : <MessageCircle className="h-4 w-4" />}
                WhatsApp
              </a>
            </Button>
          )}

          {variant === "listing" && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/vendor/${vendor.slug}`}>
                <span className="text-xs">{t("viewRateList")}</span>
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
