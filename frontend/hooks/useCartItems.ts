import { useState, useEffect } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  store: string;
  category: string;
};

export const useCartItems = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndTransformCart = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("http://localhost:3001/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const rawData = await response.json();

          const formattedCart = rawData.map((item: any) => ({
            id: item.id,
            name: item.product.name,
            price: item.unitPrice,
            quantity: item.quantity,
            imageUrl: item.product.imageUrl || "/mock/default.png",
            store: item.product.store.name,
            category: item.product.category.name,
          }));

          setCartItems(formattedCart);
        }
      } catch (error) {
        console.error("ดึงข้อมูลตะกร้าพลาด:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndTransformCart();
  }, []);

  return { cartItems, isLoading, setCartItems };
};
