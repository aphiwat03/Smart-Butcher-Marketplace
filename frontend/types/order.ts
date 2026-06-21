export type OrderStatus =
  | "All"
  | "PENDING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderProduct {
  id: number;
  name: string;
  imageUrl: string;
  store: {
    name: string;
  };
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: OrderProduct;
}

export interface Order {
  id: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface OrderApiResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
