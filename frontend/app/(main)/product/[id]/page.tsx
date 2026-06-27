import ProductClient from "./ProductClient";
import { API_URL } from "@/lib/api";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [productRes, reviewsRes] = await Promise.all([
    fetch(`${API_URL}/users/products/${id}`, { cache: "no-store" }),
    fetch(`${API_URL}/reviews/product/${id}`, { cache: "no-store" }),
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

  return <ProductClient product={productData} reviews={reviewsData} />;
}
