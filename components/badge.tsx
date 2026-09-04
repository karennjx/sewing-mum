import type { ReactNode } from "react";

type BadgeTone = "sage" | "gold" | "berry" | "neutral";

const TONE_CLASSES: Record<BadgeTone, string> = {
  sage: "bg-sage/15 text-sage",
  gold: "bg-gold/15 text-gold",
  berry: "bg-berry/10 text-berry",
  neutral: "bg-linen text-muted",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
