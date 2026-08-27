import { fetchApi } from "@/lib/api";
import { create } from "zustand";

interface CartState {
  cartCount: number;
  fetchCartCount: () => Promise<void>;
  clearCartCount: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartCount: 0,

  fetchCartCount: async () => {
    try {
      const response = await fetchApi(`/cart/count/total`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        set({ cartCount: data.totalItem });
      }
    } catch (error) {
      console.error("ดึงข้อมูลตะกร้าไม่สำเร็จ", error);
    }
  },

  clearCartCount: () => set({ cartCount: 0 }),
}));
