"use client";

import { useSyncExternalStore } from "react";
import { Badge } from "@/components/badge";
import { availabilityLabel, isInSeason, type Product } from "@/lib/catalog";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * Seasonal availability depends on today's date, which would otherwise be
 * frozen at build time by static prerendering. The season window renders on
 * the server and during hydration, then the live status takes over.
 */
export function SeasonalStatus({
  product,
  windowLabel,
}: {
  product: Product;
  windowLabel: string;
}) {
  const hydrated = useSyncExternalStore(subscribe, onClient, onServer);

  if (!hydrated) {
    return <Badge tone="gold">Seasonal &middot; {windowLabel}</Badge>;
  }

  const now = new Date();
  const inSeason = isInSeason(product, now);
  const label = availabilityLabel(product, now);

  return (
    <Badge tone={inSeason ? "sage" : "gold"}>
      {inSeason ? `${label} \u00b7 seasonal` : label}
    </Badge>
  );
}
