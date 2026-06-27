import React from "react";
import { CartItem } from "@/types/payment";

interface OrderSummaryProps {
  cartItems: CartItem[];
  isCartLoading: boolean;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
}

export function OrderSummary({
  cartItems,
  isCartLoading,
  subtotal,
  shippingFee,
  totalAmount,
}: OrderSummaryProps) {
  return (
    <aside className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-10 w-full">
      <h3 className="text-lg font-bold text-[#4E0707] border-b border-gray-100 pb-2 mb-6">
        สรุปรายการสั่งซื้อ (Order Summary)
      </h3>

      <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-1">
        {isCartLoading ? (
          <p className="text-sm text-gray-400 text-center py-6">
            กำลังโหลดข้อมูลสินค้า...
          </p>
        ) : cartItems.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            ไม่มีสินค้าในตะกร้า
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 bg-[#f7f5f2] rounded-xl gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    จำนวน: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold text-[#4E0707] flex-shrink-0">
                ฿{(item.unitPrice * item.quantity).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100 space-y-3 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>ยอดรวม (Subtotal)</span>
          <span className="font-medium text-gray-800">
            ฿{subtotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>ค่าจัดส่ง (Shipping)</span>
          <span className="font-medium text-green-600">
            {shippingFee === 0 ? "ฟรี" : `฿${shippingFee}`}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
        <span className="text-base font-bold text-gray-800">ยอดชำระสุทธิ</span>
        <span className="text-2xl font-black text-[#4E0707]">
          ฿{totalAmount.toLocaleString()}
        </span>
      </div>
    </aside>
  );
}
