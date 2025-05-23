import { Client } from '../types';

/**
 * Базовий інтерфейс для всіх доменних подій
 */
interface DomainEvent {
  readonly eventType: string;
  readonly aggregateId: string;
  readonly timestamp: Date;
  readonly version: number;
}

/**
 * Подія створення клієнта
 */
export interface ClientCreatedEvent extends DomainEvent {
  readonly eventType: 'ClientCreated';
  readonly client: Client;
}

/**
 * Подія оновлення клієнта
 */
export interface ClientUpdatedEvent extends DomainEvent {
  readonly eventType: 'ClientUpdated';
  readonly client: Client;
  readonly previousData?: Partial<Client>;
}

/**
 * Подія видалення клієнта
 */
export interface ClientDeletedEvent extends DomainEvent {
  readonly eventType: 'ClientDeleted';
  readonly clientId: string;
}

/**
 * Подія вибору клієнта
 */
export interface ClientSelectedEvent extends DomainEvent {
  readonly eventType: 'ClientSelected';
  readonly client: Client;
}

/**
 * Подія очищення вибору клієнта
 */
export interface ClientSelectionClearedEvent extends DomainEvent {
  readonly eventType: 'ClientSelectionCleared';
}

/**
 * Об'єднаний тип всіх клієнтських подій
 */
export type ClientEvent =
  | ClientCreatedEvent
  | ClientUpdatedEvent
  | ClientDeletedEvent
  | ClientSelectedEvent
  | ClientSelectionClearedEvent;

/**
 * Фабрика для створення доменних подій
 * Реалізує Factory Pattern
 */
export class ClientEventFactory {
  private static eventVersion = 1;

  static createClientCreatedEvent(client: Client): ClientCreatedEvent {
    return {
      eventType: 'ClientCreated',
      aggregateId: client.id || '',
      timestamp: new Date(),
      version: this.eventVersion,
      client,
    };
  }

  static createClientUpdatedEvent(
    client: Client,
    previousData?: Partial<Client>
  ): ClientUpdatedEvent {
    return {
      eventType: 'ClientUpdated',
      aggregateId: client.id || '',
      timestamp: new Date(),
      version: this.eventVersion,
      client,
      previousData,
    };
  }

  static createClientDeletedEvent(clientId: string): ClientDeletedEvent {
    return {
      eventType: 'ClientDeleted',
      aggregateId: clientId,
      timestamp: new Date(),
      version: this.eventVersion,
      clientId,
    };
  }

  static createClientSelectedEvent(client: Client): ClientSelectedEvent {
    return {
      eventType: 'ClientSelected',
      aggregateId: client.id || '',
      timestamp: new Date(),
      version: this.eventVersion,
      client,
    };
  }

  static createClientSelectionClearedEvent(): ClientSelectionClearedEvent {
    return {
      eventType: 'ClientSelectionCleared',
      aggregateId: '',
      timestamp: new Date(),
      version: this.eventVersion,
    };
  }
}
