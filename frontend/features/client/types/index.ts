export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum ClientSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  DIRECT = 'DIRECT',
  OTHER = 'OTHER',
}

export enum LoyaltyLevel {
  STANDARD = 'STANDARD',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  VIP = 'VIP',
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  source: ClientSource;
  birthDate?: string;
  lastOrderDate?: string;
  totalSpent: number;
  orderCount: number;
  status: ClientStatus;
  loyaltyPoints: number;
  loyaltyLevel: LoyaltyLevel;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  source: ClientSource;
  birthDate?: string;
  tags?: string[];
}

export interface UpdateClientDto {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  source?: ClientSource;
  birthDate?: string;
  status?: ClientStatus;
  tags?: string[];
}
