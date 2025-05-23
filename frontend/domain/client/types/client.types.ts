import { CommunicationChannel, ClientSource } from './client-enums';

import type { AddressDTO } from '@/lib/api';
import type { ClientCategoryDTO } from '@/lib/api';
import type { ClientPreferenceDTO } from '@/lib/api';
import type { OrderSummaryDTO } from '@/lib/api';

/**
 * Доменний тип для адреси (базується на AddressDTO з API)
 */
export type Address = AddressDTO;

/**
 * Інтерфейс для представлення клієнта в домені
 */
export interface Client {
  id?: string;
  lastName?: string;
  firstName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  structuredAddress?: Address;
  communicationChannels?: CommunicationChannel[];
  source?: ClientSource;
  sourceDetails?: string;
  discountPercentage?: number;
  createdAt?: Date;
  updatedAt?: Date;
  category?: ClientCategoryDTO;
  preferences?: ClientPreferenceDTO[];
  recentOrders?: OrderSummaryDTO[];
  orderCount?: number;
}
