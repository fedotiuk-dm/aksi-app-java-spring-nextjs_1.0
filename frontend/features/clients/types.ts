export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum LoyaltyLevel {
  STANDARD = 'STANDARD',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  VIP = 'VIP',
}

export enum ClientSource {
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  GOOGLE = 'GOOGLE',
  ADVERTISEMENT = 'ADVERTISEMENT',
  RETURNING = 'RETURNING',
  WALK_IN = 'WALK_IN',
  OTHER = 'OTHER',
}

export interface ClientResponse {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  status: ClientStatus;
  loyaltyLevel: LoyaltyLevel;
  source?: ClientSource;
  birthDate?: string;
  totalSpent?: number;
  loyaltyPoints?: number;
  lastOrderDate?: string;
  orderCount?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientFilter {
  status?: ClientStatus;
  loyaltyLevel?: LoyaltyLevel;
  source?: ClientSource;
  search?: string;
  page?: number;
  size?: number;
}
