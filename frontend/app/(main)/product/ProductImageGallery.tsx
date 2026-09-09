"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  mainImage?: string | string[];
  productName: string;
}

export default function ProductImageGallery({
  mainImage,
  productName,
}: ProductImageProps) {
  const images: string[] =
    Array.isArray(mainImage) && mainImage.length > 0
      ? mainImage.filter(
          (img) => typeof img === "string" && img.trim().length > 0,
        )
      : typeof mainImage === "string" && mainImage.trim()
        ? [mainImage.trim()]
        : [];

  const [selectedImage, setSelectedImage] = useState<string>(images[0] || "");
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [mainImage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePos({ x, y });
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-4/3 w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-6 select-none">
        <ImageOff className="w-12 h-12 text-gray-300 mb-2" />
        <p className="text-base font-semibold text-gray-500">
          ไม่มีรูปภาพสินค้า
        </p>
        <p className="text-xs text-gray-400 mt-1">{productName}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-4/3 w-full bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden cursor-crosshair select-none"
      >
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover pointer-events-none"
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isHovering ? "scale(1.5)" : "scale(1)",
            transition: isHovering ? "none" : "transform 0.25s ease-out",
          }}
        />
      </div>

       {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((imgUrl, index) => {
            const isSelected = (selectedImage || images[0]) === imgUrl;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(imgUrl)}
                onMouseEnter={() => setSelectedImage(imgUrl)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-gray-50 cursor-pointer ${
                  isSelected
                    ? "border-[#B4915B] ring-2 ring-[#B4915B]/30 scale-95"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
