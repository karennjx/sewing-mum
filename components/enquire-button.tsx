import { type Product } from "@/lib/catalog";
import { site, whatsappLink } from "@/lib/site";

const SIZE_CLASSES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
} as const;

const VARIANT_CLASSES = {
  solid: "bg-berry text-cream hover:bg-berry-dark",
  /** For the maroon band. A berry fill all but vanishes on maroon — they are
   *  the same hue two steps of lightness apart — so this outlines in rose
   *  instead, matching the buttons the other maroon bands already carry. */
  onMaroon:
    "border border-rose/50 text-cream hover:border-cream hover:bg-cream/10",
} as const;

export type EnquireButtonSize = keyof typeof SIZE_CLASSES;
export type EnquireButtonVariant = keyof typeof VARIANT_CLASSES;

export function EnquireButton({
  product,
  size = "md",
  variant = "solid",
  label = "Enquire on WhatsApp",
  message: customMessage,
  className = "",
}: {
  product?: Product;
  size?: EnquireButtonSize;
  variant?: EnquireButtonVariant;
  label?: string;
  /** Overrides the pre-filled WhatsApp text, for pages that open a different
   *  conversation from the usual "tell me about this piece". */
  message?: string;
  className?: string;
}) {
  const message =
    customMessage ??
    (product
      ? `Hi ${site.name}! I would like to enquire about the ${product.name}. Could you tell me the price and what you have ready?`
      : `Hi ${site.name}! I came from your website and would like to ask about your handmade pieces.`);

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {label}
    </a>
  );
}
