export type StoreProduct = {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string | null;
  badge: string | null;
};

export type Store = {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string | null;
  rating: number;
  reviewCount: number;
  productCount: number;
  joinedAt: string;
  taxId: string;
  location: string;
  responseTime: string;
  isVerified: boolean;
  tags: string[];
  products: StoreProduct[];
};
