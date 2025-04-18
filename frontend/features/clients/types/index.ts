export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
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

export enum LoyaltyLevel {
  STANDARD = 'STANDARD',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  VIP = 'VIP',
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  additionalPhone?: string;
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
  gender?: string;
  allowSMS?: boolean;
  allowEmail?: boolean;
  allowCalls?: boolean;
  nextContactAt?: string;
  lastContactAt?: string;
  frequencyScore?: number;
  monetaryScore?: number;
  recencyScore?: number;
  deletedAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  fullName: string;
  phone: string;
  additionalPhone?: string;
  email?: string;
  address?: string;
  notes?: string;
  source: ClientSource;
  birthDate?: string;
  gender?: string;
  allowSMS?: boolean;
  allowEmail?: boolean;
  allowCalls?: boolean;
  tags?: string[];
}

export interface UpdateClientDto {
  fullName?: string;
  phone?: string;
  additionalPhone?: string;
  email?: string;
  address?: string;
  notes?: string;
  source?: ClientSource;
  birthDate?: string;
  status?: ClientStatus;
  loyaltyLevel?: LoyaltyLevel;
  loyaltyPoints?: number;
  gender?: string;
  allowSMS?: boolean;
  allowEmail?: boolean;
  allowCalls?: boolean;
  nextContactAt?: string;
  lastContactAt?: string;
  tags?: string[];
}
