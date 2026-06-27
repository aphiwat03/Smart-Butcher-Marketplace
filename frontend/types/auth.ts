export interface AuthMeResponse {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  store?: {
    id: number;
    ownerUserId: number;
    [key: string]: unknown;
  };
}
