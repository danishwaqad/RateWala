import type { Product } from "@/types/database";
import { formatPrice, formatRelativeDate } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  labels: {
    item: string;
    rate: string;
    lastUpdated: string;
  };
  showImages?: boolean;
}

export function ProductTable({ products, labels, showImages = true }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">No rates available yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {showImages && (
              <th className="px-4 py-3 text-left font-semibold w-16">Photo</th>
            )}
            <th className="px-4 py-3 text-left font-semibold">{labels.item}</th>
            <th className="px-4 py-3 text-left font-semibold">{labels.rate}</th>
            <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">
              {labels.lastUpdated}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
            >
              {showImages && (
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover border bg-muted"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </td>
              )}
              <td className="px-4 py-3 font-medium">{product.name}</td>
              <td className="px-4 py-3 text-teal font-semibold">
                {formatPrice(product.price)}
                <span className="text-muted-foreground font-normal"> / {product.unit}</span>
              </td>
              <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                {formatRelativeDate(product.updated_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
