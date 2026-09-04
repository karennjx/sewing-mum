import reviewsData from "@/data/reviews.json";

export type ReviewSource = "whatsapp" | "instagram" | "google";

export type Review = {
  id: string;
  name: string;
  location: string;
  rating: number;
  productSlug: string;
  quote: string;
  source: ReviewSource;
  date: string;
  featured?: boolean;
};

const reviews = reviewsData as readonly Review[];

export function getAllReviews(): readonly Review[] {
  return [...reviews].sort((a, b) => b.date.localeCompare(a.date));
}

export function getFeaturedReviews(): readonly Review[] {
  return getAllReviews().filter((review) => review.featured === true);
}

export function getReviewsForProduct(slug: string): readonly Review[] {
  return getAllReviews().filter((review) => review.productSlug === slug);
}

export function getAverageRating(): number {
  if (reviews.length === 0) {
    return 0;
  }
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function getReviewCount(): number {
  return reviews.length;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SOURCE_LABELS: Record<ReviewSource, string> = {
  whatsapp: "via WhatsApp",
  instagram: "via Instagram",
  google: "via Google",
};

export function formatReviewDate(date: string): string {
  const [year, month] = date.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

export function sourceLabel(source: ReviewSource): string {
  return SOURCE_LABELS[source];
}
