export type StoreProduct = {
  id: number;
  name: string;
  price: number;
  unit: string | null;
  image: string | null;
  badge: string | null;
  category?: string;
};

export type Store = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  rating: number;
  reviewCount: number;
  productCount: number;
  createdAt: string;
  products: StoreProduct[];
};
