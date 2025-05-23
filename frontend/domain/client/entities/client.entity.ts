
import { AddressDTO } from '@/lib/api';
import { ClientCategoryDTO } from '@/lib/api';
import { ClientPreferenceDTO } from '@/lib/api';
import { OrderSummaryDTO } from '@/lib/api';

import { Client } from '../types';
import { ClientSource, CommunicationChannel } from '../types/client-enums';

/**
 * Клас сутності Client, що представляє клієнта у домені
 */
export class ClientEntity implements Client {
  readonly id?: string;
  readonly lastName?: string;
  readonly firstName?: string;
  readonly fullName?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly address?: string;
  readonly structuredAddress?: AddressDTO;
  readonly communicationChannels?: CommunicationChannel[];
  readonly source?: ClientSource;
  readonly sourceDetails?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly category?: ClientCategoryDTO;
  readonly preferences?: ClientPreferenceDTO[];
  readonly recentOrders?: OrderSummaryDTO[];
  readonly orderCount?: number;

  constructor(props: Client) {
    this.id = props.id;
    this.lastName = props.lastName;
    this.firstName = props.firstName;
    this.fullName = props.fullName || this.createFullName(props.firstName, props.lastName);
    this.phone = props.phone;
    this.email = props.email;
    this.address = props.address;
    this.structuredAddress = props.structuredAddress;
    this.communicationChannels = props.communicationChannels;
    this.source = props.source;
    this.sourceDetails = props.sourceDetails;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.category = props.category;
    this.preferences = props.preferences;
    this.recentOrders = props.recentOrders;
    this.orderCount = props.orderCount;
  }

  /**
   * Створення повного імені з імені та прізвища
   */
  private createFullName(firstName?: string, lastName?: string): string | undefined {
    if (!firstName && !lastName) return undefined;

    return [firstName, lastName].filter(Boolean).join(' ');
  }

  /**
   * Перевірка чи є у клієнта комунікаційний канал
   */
  hasCommunicationChannel(channel: CommunicationChannel): boolean {
    return !!this.communicationChannels?.includes(channel);
  }

  /**
   * Перевірка чи є у клієнта хоча б один із комунікаційних каналів
   */
  hasAnyCommunicationChannel(channels: CommunicationChannel[]): boolean {
    if (!this.communicationChannels || this.communicationChannels.length === 0) {
      return false;
    }

    return channels.some((channel) => this.hasCommunicationChannel(channel));
  }

  /**
   * Перевірка чи має клієнт вказану категорію
   */
  hasCategory(categoryCode: string): boolean {
    return this.category?.code === categoryCode;
  }

  /**
   * Отримання основного способу зв'язку з клієнтом
   */
  getPrimaryContactMethod(): string | undefined {
    if (this.phone) return this.phone;
    if (this.email) return this.email;
    return undefined;
  }

  /**
   * Створення нової сутності з оновленими даними
   */
  update(props: Partial<Client>): ClientEntity {
    return new ClientEntity({ ...this, ...props });
  }
}
