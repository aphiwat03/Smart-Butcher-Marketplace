export type ShopSearchParams = Promise<{
  q?: string;
  category?: string;
  maxPrice?: string;
}>;

export type Category = {
  id: number;
  name: string;
};

export type ShopProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  category: Category;
  store: {
    id: number;
    name: string;
  };
};
