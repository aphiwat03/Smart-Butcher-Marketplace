export type CheckoutStep = "details" | "shipping" | "payment" | "upload" | "success";

export interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    store?: {
      name: string;
    };
    category?: {
      name: string;
    };
  };
}

export interface UserAddressData {
  id: number;
  title: string | null;
  receiverName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
}
