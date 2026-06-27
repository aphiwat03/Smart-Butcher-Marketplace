export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  addressId?: number;
  receiverName?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  postalCode?: string;
}
