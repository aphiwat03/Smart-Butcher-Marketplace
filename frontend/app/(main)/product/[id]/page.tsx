import ProductClient from "./ProductClient";
import { API_URL } from "@/lib/api";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`${API_URL}/users/products/${id}`);

  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
        ไม่พบข้อมูลสินค้า
      </div>
    );
  }

  const productData = await res.json();
  console.log(productData);
  return <ProductClient product={productData} />;
}
