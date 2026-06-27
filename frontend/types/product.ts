export interface ProductDetailProps {
  product: {
    id: number;
    storeId: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    status: string;
    category: {
      name: string;
      description: string;
    };
    store: {
      id: number;
      name: string;
    };
  };
}
