export const site = {
  name: "Sewing Mums",
  founder: "Kim",
  url: "https://sewingmum.com",
  tagline: "Handmade by single mothers in Singapore",
  description:
    "Sewing Mums is a social enterprise run by Kim, helping single mothers in Singapore earn a livelihood through sewing. Fabric crafts, toys, games and good-to-haves, made at home.",
  currency: "SGD",
  currencySymbol: "S$",
  // PLACEHOLDER: Kim's card and the EDM both show +65 9739 0123. Confirm
  // before swapping it in. International format, digits only, no "+".
  whatsappNumber: "6591234567",
  // PLACEHOLDER: paste the "Write a review" short link from the Google
  // Business Profile. An empty string hides the Google review prompt.
  googleReviewUrl: "",
  instagramUrl: "https://instagram.com/sewingmums",
  facebookUrl: "https://facebook.com/sewingmums",
  email: "kim@kimunderhill.com",
} as const;

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
