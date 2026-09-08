import { type Product } from "@/lib/catalog";
import { site, whatsappLink } from "@/lib/site";

const SIZE_CLASSES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
} as const;

export function EnquireButton({
  product,
  size = "md",
  label = "Enquire on WhatsApp",
  className = "",
}: {
  product?: Product;
  size?: keyof typeof SIZE_CLASSES;
  label?: string;
  className?: string;
}) {
  const message = product
    ? `Hi ${site.name}! I would like to enquire about the ${product.name}. Could you tell me the price and what you have ready?`
    : `Hi ${site.name}! I came from your website and would like to ask about your handmade pieces.`;

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-berry font-medium text-cream transition-colors hover:bg-berry-dark ${SIZE_CLASSES[size]} ${className}`}
    >
      {label}
    </a>
  );
}
