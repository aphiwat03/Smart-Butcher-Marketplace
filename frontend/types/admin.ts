export interface AdminProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
  store: {
    id: number;
    name: string;
  };
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedProducts {
  data: AdminProduct[];
  meta: PaginatedMeta;
}

export interface ProductTableProps {
  products: AdminProduct[];
  onDelete?: (id: number) => Promise<void>;
  isLoading?: boolean;
}

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  quantity: string;
  categoryId: string;
};

export interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<ProductFormData>;
  isEditing?: boolean;
}

export interface AdminMenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface AdminProductFilters {
  q: string;
  category: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: string;
}
