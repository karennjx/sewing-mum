import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Kim renamed this product, so the old URL is permanently the new one.
      {
        source: "/products/wallet-bundle",
        destination: "/products/trio-bundle",
        permanent: true,
      },
      // Both were moved to Archive in Drive. Kept as temporary redirects
      // rather than permanent ones: if either comes back, deleting the entry
      // here is all it takes to restore the page.
      {
        source: "/products/fabric-face-mask",
        destination: "/products",
        permanent: false,
      },
      {
        source: "/products/cup-sleeve",
        destination: "/products",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
