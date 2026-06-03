"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      setError("");

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("quantity", formData.quantity);
      submitData.append("categoryId", formData.categoryId);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการแก้ไขสินค้า");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !product) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin mr-2" />
        <span className="text-muted-foreground">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">แก้ไขสินค้า</h1>
        <p className="text-muted-foreground">อัพเดตข้อมูลสินค้า</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialData={product}
          isEditing={true}
        />
      </div>
    </div>
  );
}
