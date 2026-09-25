import type { Metadata } from "next";
import { Caveat, Karla, Lora } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

// Was Fraunces, which draws an f with a wide hooked terminal that reaches over
// the next letter. It is the typeface working as designed, not a rendering
// fault — disabling ligatures, optical sizing and the WONK axis all leave the
// glyph untouched — but it read as a mistake in "Beautiful". Lora keeps the
// warmth without the quirk.
const displayFont = Lora({
  variable: "--font-display-family",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Karla({
  variable: "--font-body-family",
  subsets: ["latin"],
  display: "swap",
});

// Only for the short handwritten asides on the homepage, the kind of thing Kim
// would write on a tag. Never for anything a visitor has to read carefully.
const handFont = Caveat({
  variable: "--font-hand-family",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${handFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
