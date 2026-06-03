"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export default function CreateProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch("/api/products", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          เพิ่มสินค้าใหม่
        </h1>
        <p className="text-muted-foreground">
          กรอกข้อมูลเพื่อเพิ่มสินค้าใหม่ลงในระบบ
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mt-6">
          {error}
        </div>
      )}
    </div>
  );
}
