import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/shop", "/product/*", "/store/*", "/contact"],
      disallow: [
        "/admin/*",
        "/seller/*",
        "/cart",
        "/orders",
        "/profile",
        "/payment/*",
        "/create-store",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
