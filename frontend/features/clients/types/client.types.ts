export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type LoyaltyLevel = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: ClientStatus;
  loyaltyLevel: LoyaltyLevel;
  createdAt: string;
  notes?: string;
}

export interface ClientListResponse {
  content: Client[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
