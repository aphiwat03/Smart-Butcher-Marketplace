import { fetchApi } from "@/lib/api";
import ProductClient from "./ProductClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetchApi(`/users/products/${id}`, { cache: "no-store" });
    if (!res.ok) {
      return {
        title: "ไม่พบสินค้า",
        description: "ขออภัย ไม่พบข้อมูลสินค้าที่คุณกำลังค้นหา",
      };
    }

    const product = await res.json();
    const storeName = product.store?.name || "Smart Butcher";
    const categoryName = product.category?.name || "เนื้อพรีเมียม";
    const title = `${product.name} (฿${Number(product.price).toLocaleString("th-TH")}) - ${storeName}`;
    const description =
      product.description?.slice(0, 160) ||
      `ซื้อ ${product.name} หมวดหมู่ ${categoryName} ราคาพิเศษ ฿${product.price} จากร้าน ${storeName} สด สะอาด ปลอดภัย จัดส่งรวดเร็วที่ Smart Butcher Marketplace`;

    const images = product.imageUrl
      ? [
          {
            url: product.imageUrl,
            alt: product.name,
          },
        ]
      : [];

    return {
      title,
      description,
      alternates: {
        canonical: `${siteUrl}/product/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `${siteUrl}/product/${id}`,
        type: "website",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "รายละเอียดสินค้า",
      description: "เลือกซื้อเนื้อคุณภาพสูงที่ Smart Butcher Marketplace",
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [productRes, reviewsRes] = await Promise.all([
    fetchApi(`/users/products/${id}`, {
      cache: "no-store",
    }),
    fetchApi(`/reviews/product/${id}`, {
      cache: "no-store",
    }),
  ]);

  if (!productRes.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
        ไม่พบข้อมูลสินค้า
      </div>
    );
  }

  const productData = await productRes.json();
  const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];

  const totalReviews = reviewsData.length;
  const avgRating =
    totalReviews > 0
      ? reviewsData.reduce((sum: number, r: any) => sum + (r.point || 0), 0) /
        totalReviews
      : 0;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productData.name,
    image: productData.imageUrl ? [productData.imageUrl] : undefined,
    description:
      productData.description ||
      `${productData.name} คุณภาพดี สด สะอาด จาก ${productData.store?.name || "Smart Butcher"}`,
    sku: `PROD-${productData.id}`,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${productData.id}`,
      priceCurrency: "THB",
      price: productData.price,
      availability:
        productData.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: productData.store?.name || "Smart Butcher Marketplace",
      },
    },
    category: productData.category?.name,
    ...(totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount: totalReviews,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductClient product={productData} reviews={reviewsData} />
    </>
  );
}
