import productsData from "@/data/products.json";
import { site } from "@/lib/site";

export type Category = "sewing-mums" | "bookish-bundles" | "festive-specials";

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
  /** null until Kim confirms a price; the page then asks people to enquire. */
  price: number | null;
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
  /** One line, short enough for the header dropdown. */
  short: string;
  blurb: string;
};

const CATEGORIES: readonly CategoryInfo[] = [
  {
    slug: "sewing-mums",
    label: "Sewing Mums",
    short: "Plushies, pouches, placemats and more",
    blurb:
      "The core handmade line. Fabric crafts, toys and good-to-haves, sewn at home by the mothers themselves.",
  },
  {
    slug: "bookish-bundles",
    label: "Bookish Bundles",
    short: "Reading and stationery gift sets",
    blurb:
      "Curated reading and stationery sets, put together as ready-to-give gifts.",
  },
  {
    slug: "festive-specials",
    label: "Festive Specials",
    short: "Christmas and Chinese New Year",
    blurb:
      "Made for the season and then put away. Christmas decorations and placemats, Chinese New Year treats.",
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

/** "S$48", or "Price on enquiry" where no price has been set yet. */
export function priceLabel(product: Product): string {
  return product.price === null
    ? "Price on enquiry"
    : formatPrice(product.price);
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
