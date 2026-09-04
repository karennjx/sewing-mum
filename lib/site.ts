export const site = {
  name: "Sewing Mum",
  url: "https://sewingmum.com",
  tagline: "Handmade, one stitch at a time",
  description:
    "Sewing Mum makes handbags, soft toys and bookish bundles by hand, in small batches. Some pieces are made all year round, others only in their season.",
  currency: "SGD",
  currencySymbol: "S$",
  // PLACEHOLDER: replace with the real WhatsApp number in international
  // format, digits only, no "+" or spaces.
  whatsappNumber: "6591234567",
  // PLACEHOLDER: paste the "Write a review" short link from the Google
  // Business Profile. An empty string hides the Google review prompt.
  googleReviewUrl: "",
  instagramUrl: "https://instagram.com/sewingmum",
  email: "hello@sewingmum.com",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
