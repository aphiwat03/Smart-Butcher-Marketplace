export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: {
    name: string;
  };
  status: string;
  createdAt: string;
}

export interface ProductTableProps {
  products: AdminProduct[];
  onDelete?: (id: string) => Promise<void>;
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
