"use client";
import { useState, useEffect } from "react";

interface PriceSliderProps {
  maxLimit: number;
  initialMaxValue: number;
  initialMinValue: number;
}

export default function PriceSlider({
  maxLimit,
  initialMaxValue,
  initialMinValue,
}: PriceSliderProps) {
  const [minPrice, setMinPrice] = useState(initialMinValue);
  const [maxPrice, setMaxPrice] = useState(initialMaxValue);

  useEffect(() => {
    setMinPrice(initialMinValue);
    setMaxPrice(initialMaxValue);
  }, [initialMinValue, initialMaxValue]);

  return (
    <div>
      <div className="mb-4">
        <label className="font-semibold text-[#4E0707] block mb-2">
          ช่วงราคา
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">฿</span>
            <input
              type="number"
              name="minPrice"
              min="0"
              max={maxLimit}
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-[#B4915B] focus:border-[#B4915B] outline-none"
              placeholder="ต่ำสุด"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">฿</span>
            <input
              type="number"
              name="maxPrice"
              min="0"
              max={maxLimit}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-[#B4915B] focus:border-[#B4915B] outline-none"
              placeholder="สูงสุด"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <input
          type="range"
          min="0"
          max={maxLimit}
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#B4915B]"
        />
        <div className="mt-2 flex justify-between text-xs text-[#4E0707]">
          <span>฿0</span>
          <span>฿{maxLimit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
