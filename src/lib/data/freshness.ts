import type { Product } from "@/types/database";

export const STALE_RATE_DAYS = 7;

export type ProductTimestamps = Pick<Product, "updated_at">;

export function getLatestProductUpdate(products: ProductTimestamps[]): Date | null {
  if (products.length === 0) return null;

  const latestMs = Math.max(...products.map((product) => new Date(product.updated_at).getTime()));
  return new Date(latestMs);
}

export function isRatesStale(products: ProductTimestamps[], staleDays = STALE_RATE_DAYS): boolean {
  if (products.length === 0) return false;

  const latest = getLatestProductUpdate(products);
  if (!latest) return false;

  const diffMs = Date.now() - latest.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= staleDays;
}

export function daysSinceLastUpdate(products: ProductTimestamps[]): number {
  const latest = getLatestProductUpdate(products);
  if (!latest) return 0;

  return Math.floor((Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24));
}
