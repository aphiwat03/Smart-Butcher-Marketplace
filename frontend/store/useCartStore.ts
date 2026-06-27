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
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch("http://localhost:3001/cart/count/total", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
