import type { ReactNode } from "react";

type BadgeTone = "rose" | "spool" | "berry" | "neutral";

const TONE_CLASSES: Record<BadgeTone, string> = {
  rose: "bg-rose/15 text-berry",
  spool: "bg-spool/15 text-spool",
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
