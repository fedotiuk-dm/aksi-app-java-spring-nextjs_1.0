export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED'
}

export enum LoyaltyLevel {
  STANDARD = 'STANDARD',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  VIP = 'VIP'
}

export enum ClientSource {
  REFERRAL = 'REFERRAL',             // Змінено з RECOMMENDATION
  ADVERTISEMENT = 'ADVERTISEMENT',   // Змінено з ADVERTISING
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',     // Без змін
  GOOGLE = 'GOOGLE',                // Змінено з WEBSITE
  OTHER = 'OTHER'                   // Без змін
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  additionalPhone?: string;
  email?: string;
  address?: string;
  notes?: string;
  source?: ClientSource;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
  status: ClientStatus;
  loyaltyLevel: LoyaltyLevel;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  tags?: string[];
}
