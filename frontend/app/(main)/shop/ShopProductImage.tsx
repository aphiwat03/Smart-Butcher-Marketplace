"use client";

import { useState } from "react";
import Image from "next/image";

export default function ShopProductImage({
  src,
  alt,
}: {
  src?: string | string[] | null;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const displaySrc = Array.isArray(src) ? src[0] : src;

  if (!displaySrc || hasError) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-4xl select-none">
        🥩
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={displaySrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={[
          "object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
