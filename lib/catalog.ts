import productsData from "@/data/products.json";
import { site } from "@/lib/site";

export type Category = "handbags" | "soft-toys" | "bookish-bundles";

export type Availability =
  | { kind: "regular" }
  | { kind: "seasonal"; months: number[] };

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  blurb: string;
  description: string[];
  details: string[];
  images: ProductImage[];
  availability: Availability;
  featured?: boolean;
};

export type CategoryInfo = {
  slug: Category;
  label: string;
  blurb: string;
};

const CATEGORIES: readonly CategoryInfo[] = [
  {
    slug: "handbags",
    label: "Handbags",
    blurb:
      "Totes, slings and pouches in linen, canvas and batik, cut and stitched to be carried every day.",
  },
  {
    slug: "soft-toys",
    label: "Soft Toys",
    blurb:
      "Bunnies, elephants and festival characters with embroidered faces and nothing that can work loose.",
  },
  {
    slug: "bookish-bundles",
    label: "Bookish Bundles",
    blurb:
      "Padded book sleeves, bookmarks and gift sets for people who read on buses and in bed.",
  },
];

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

const products = productsData as readonly Product[];

export function getAllProducts(): readonly Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: Category): readonly Product[] {
  return products.filter((product) => product.category === category);
}

export function getFeaturedProducts(): readonly Product[] {
  return products.filter((product) => product.featured === true);
}

export function getCategories(): readonly CategoryInfo[] {
  return CATEGORIES;
}

export function getCategory(slug: Category): CategoryInfo {
  const category = CATEGORIES.find((entry) => entry.slug === slug);
  if (!category) {
    throw new Error(`Unknown category: ${slug}`);
  }
  return category;
}

export function formatPrice(price: number): string {
  return `${site.currencySymbol}${price}`;
}

export function isSeasonal(product: Product): boolean {
  return product.availability.kind === "seasonal";
}

export function isInSeason(product: Product, on: Date = new Date()): boolean {
  if (product.availability.kind === "regular") {
    return true;
  }
  return product.availability.months.includes(on.getMonth() + 1);
}

/** "October to December", or null for products made all year round. */
export function seasonWindowLabel(product: Product): string | null {
  if (product.availability.kind === "regular") {
    return null;
  }
  const months = [...product.availability.months].sort((a, b) => a - b);
  if (months.length === 0) {
    return null;
  }
  const first = MONTH_NAMES[months[0] - 1];
  if (months.length === 1) {
    return first;
  }
  return `${first} to ${MONTH_NAMES[months[months.length - 1] - 1]}`;
}

/** "Available now" or "Back in November", based on the given date. */
export function availabilityLabel(
  product: Product,
  on: Date = new Date(),
): string {
  if (isInSeason(product, on)) {
    return "Available now";
  }
  if (product.availability.kind === "regular") {
    return "Available now";
  }
  const months = [...product.availability.months].sort((a, b) => a - b);
  const current = on.getMonth() + 1;
  const next = months.find((month) => month > current) ?? months[0];
  return `Back in ${MONTH_NAMES[next - 1]}`;
}
