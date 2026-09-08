import { Badge } from "@/components/badge";
import { SeasonalStatus } from "@/components/seasonal-status";
import { isSeasonal, seasonWindowLabel, type Product } from "@/lib/catalog";

export function AvailabilityBadge({ product }: { product: Product }) {
  if (!isSeasonal(product)) {
    return <Badge tone="rose">Made all year</Badge>;
  }

  return (
    <SeasonalStatus
      product={product}
      windowLabel={seasonWindowLabel(product) ?? "selected months"}
    />
  );
}
