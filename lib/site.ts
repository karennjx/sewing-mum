export const site = {
  name: "Sewing Mums",
  founder: "Kim",
  // Canonical links, the sitemap and link previews are all built from this,
  // so it has to be an address that actually resolves. The domain we own is
  // sewingmums.com, plural, at GoDaddy — but it still serves a different
  // site, so this stays on the Vercel address until that is settled. The
  // singular sewingmum.com is someone else's and is parked for sale.
  url: "https://sewing-mum.vercel.app",
  tagline: "Handmade by single mothers in Singapore",
  description:
    "Sewing Mums is a social enterprise run by Kim, helping single mothers in Singapore earn a livelihood through sewing. Fabric crafts, toys, games and good-to-haves, made at home.",
  currency: "SGD",
  currencySymbol: "S$",
  // PayNow is collected against the business UEN, not a personal proxy, so a
  // payer's bank app shows the registered entity rather than anyone's name or
  // mobile number.
  paynowUen: "53221430K",
  // Karen's number, standing in while the site is being built so enquiries
  // reach a real person. Swap for Kim's before this is promoted anywhere.
  // International format, digits only, no "+".
  whatsappNumber: "6598250998",
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
