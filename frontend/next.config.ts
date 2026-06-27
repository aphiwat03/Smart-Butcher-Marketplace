import type { NextConfig } from "next";
// test
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gfvlzoewacvhlkdiyprp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
