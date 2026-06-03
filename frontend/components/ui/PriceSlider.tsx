"use client";
import { useState } from "react";

interface PriceSliderProps {
  maxLimit: number;
  initialValue: number;
}

export default function PriceSlider({
  maxLimit,
  initialValue,
}: PriceSliderProps) {
  const [currentPrice, setCurrentPrice] = useState(initialValue);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label htmlFor="maxPrice" className="font-semibold text-[#4E0707]">
          ราคาสูงสุด
        </label>
        {/* show number when scroll variable changes */}
        <span className="text-sm font-bold text-[#B4915B]">
          ฿{currentPrice.toLocaleString()}
        </span>
      </div>
      <input
        id="maxPrice"
        name="maxPrice"
        type="range"
        min="0"
        max={maxLimit}
        step="100"
        value={currentPrice}
        onChange={(e) => setCurrentPrice(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#B4915B]"
      />
      <div className="mt-2 flex justify-between text-xs text-[#4E0707]">
        <span>฿0</span>
        <span>฿{maxLimit.toLocaleString()}</span>
      </div>
    </div>
  );
}
