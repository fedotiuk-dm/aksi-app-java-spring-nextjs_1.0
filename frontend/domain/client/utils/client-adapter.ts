import { ClientResponse, CreateClientRequest, UpdateClientRequest } from '@/lib/api';

import { ClientEntity } from '../entities';
import { Client, CreateClientFormData, UpdateClientFormData } from '../types';
import { CommunicationChannel, ClientSource } from '../types/client-enums';

/**
 * Адаптер для перетворення між API типами та доменними типами
 * Реалізує Adapter Pattern та Dependency Inversion Principle
 * Вирішує проблему конфлікту типів між API та доменом
 */
export class ClientAdapter {
  /**
   * Перетворює ClientResponse з API на доменну сутність ClientEntity
   */
  static toDomainEntity(apiResponse: ClientResponse): ClientEntity {
    return new ClientEntity({
      id: apiResponse.id,
      firstName: apiResponse.firstName,
      lastName: apiResponse.lastName,
      phone: apiResponse.phone,
      email: apiResponse.email || undefined,
      address: apiResponse.address || undefined,
      source: this.adaptSourceToDomain(apiResponse.source),
      sourceDetails: apiResponse.sourceDetails || undefined,
      communicationChannels: this.adaptChannelsToDomain(apiResponse.communicationChannels),
      createdAt: apiResponse.createdAt ? new Date(apiResponse.createdAt) : undefined,
      updatedAt: apiResponse.updatedAt ? new Date(apiResponse.updatedAt) : undefined,
    });
  }

  /**
   * Перетворює ClientResponse з API на доменний інтерфейс Client
   */
  static toDomain(apiResponse: ClientResponse): Client {
    return {
      id: apiResponse.id,
      firstName: apiResponse.firstName,
      lastName: apiResponse.lastName,
      fullName: `${apiResponse.firstName || ''} ${apiResponse.lastName || ''}`.trim(),
      phone: apiResponse.phone,
      email: apiResponse.email || undefined,
      address: apiResponse.address || undefined,
      source: this.adaptSourceToDomain(apiResponse.source),
      sourceDetails: apiResponse.sourceDetails || undefined,
      communicationChannels: this.adaptChannelsToDomain(apiResponse.communicationChannels),
      createdAt: apiResponse.createdAt ? new Date(apiResponse.createdAt) : undefined,
      updatedAt: apiResponse.updatedAt ? new Date(apiResponse.updatedAt) : undefined,
    };
  }

  /**
   * Перетворює доменну сутність ClientEntity на ClientResponse для API
   */
  static toApiResponse(entity: ClientEntity): Partial<ClientResponse> {
    return {
      id: entity.id || '',
      firstName: entity.firstName || '',
      lastName: entity.lastName || '',
      phone: entity.phone || '',
      email: entity.email,
      address: entity.address,
      source: this.adaptSourceToApi(entity.source),
      sourceDetails: entity.sourceDetails,
      communicationChannels: this.adaptChannelsToApi(entity.communicationChannels),
      createdAt: entity.createdAt ? String(entity.createdAt) : undefined,
      updatedAt: entity.updatedAt ? String(entity.updatedAt) : undefined,
    };
  }

  /**
   * Адаптує source з API до доменного типу
   * Вирішує проблему конфлікту типів енумів
   */
  private static adaptSourceToDomain(apiSource: any): ClientSource | undefined {
    if (!apiSource) return undefined;

    // Безпечний мапінг між API значеннями та доменними enum
    const sourceMap: Record<string, ClientSource> = {
      INSTAGRAM: ClientSource.INSTAGRAM,
      FACEBOOK: ClientSource.FACEBOOK,
      GOOGLE: ClientSource.GOOGLE,
      RECOMMENDATION: ClientSource.RECOMMENDATION,
      PASSING_BY: ClientSource.PASSING_BY,
      OTHER: ClientSource.OTHER,
    };

    return sourceMap[String(apiSource)] || ClientSource.OTHER;
  }

  /**
   * Адаптує source з доменного типу до API
   */
  private static adaptSourceToApi(domainSource: ClientSource | undefined): any {
    if (!domainSource) return undefined;
    return domainSource; // API очікує той самий string
  }

  /**
   * Адаптує канали комунікації з API до доменного типу
   * Вирішує проблему конфлікту типів енумів
   */
  private static adaptChannelsToDomain(apiChannels: any[] | undefined): CommunicationChannel[] {
    if (!apiChannels || !Array.isArray(apiChannels)) return [];

    const channelMap: Record<string, CommunicationChannel> = {
      PHONE: CommunicationChannel.PHONE,
      EMAIL: CommunicationChannel.EMAIL,
      SMS: CommunicationChannel.SMS,
      VIBER: CommunicationChannel.VIBER,
      TELEGRAM: CommunicationChannel.TELEGRAM,
    };

    return apiChannels
      .map((channel) => channelMap[String(channel)])
      .filter((channel): channel is CommunicationChannel => channel !== undefined);
  }

  /**
   * Адаптує канали комунікації з доменного типу до API
   */
  private static adaptChannelsToApi(domainChannels: CommunicationChannel[] | undefined): any[] {
    if (!domainChannels) return [];
    return domainChannels.map((channel) => channel);
  }

  /**
   * Перетворює масив ClientResponse на масив ClientEntity
   */
  static toDomainEntities(apiResponses: ClientResponse[]): ClientEntity[] {
    return apiResponses.map((response) => this.toDomainEntity(response));
  }

  /**
   * Перетворює масив ClientResponse на масив доменних інтерфейсів Client
   */
  static toDomainClients(apiResponses: ClientResponse[]): Client[] {
    return apiResponses.map((response) => this.toDomain(response));
  }

  /**
   * Перетворює CreateClientFormData в CreateClientRequest для API
   */
  static toCreateRequest(formData: CreateClientFormData): CreateClientRequest {
    return {
      lastName: formData.lastName,
      firstName: formData.firstName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      communicationChannels: this.adaptChannelsToApiFormat(formData.communicationChannels),
      source: this.adaptSourceToApiFormat(formData.source),
      sourceDetails: formData.sourceDetails,
    };
  }

  /**
   * Перетворює UpdateClientFormData в UpdateClientRequest для API
   */
  static toUpdateRequest(formData: UpdateClientFormData): UpdateClientRequest {
    // Використовуємо базовий метод і адаптуємо тип
    return this.toCreateRequest(formData) as UpdateClientRequest;
  }

  /**
   * Адаптує доменні комунікаційні канали до API формату
   */
  private static adaptChannelsToApiFormat(
    domainChannels: CommunicationChannel[] | undefined
  ): Array<'PHONE' | 'SMS' | 'VIBER'> | undefined {
    if (!domainChannels) return undefined;

    return domainChannels
      .filter(
        (channel): channel is CommunicationChannel =>
          channel === CommunicationChannel.PHONE ||
          channel === CommunicationChannel.SMS ||
          channel === CommunicationChannel.VIBER
      )
      .map((channel) => channel as 'PHONE' | 'SMS' | 'VIBER');
  }

  /**
   * Адаптує доменне джерело до API формату
   */
  private static adaptSourceToApiFormat(
    domainSource: ClientSource | undefined
  ): CreateClientRequest.source | UpdateClientRequest.source | undefined {
    if (!domainSource) return undefined;

    // Мапимо доменні enum значення в API enum значення
    const sourceApiMap: Record<ClientSource, CreateClientRequest.source> = {
      [ClientSource.INSTAGRAM]: CreateClientRequest.source.INSTAGRAM,
      [ClientSource.GOOGLE]: CreateClientRequest.source.GOOGLE,
      [ClientSource.RECOMMENDATION]: CreateClientRequest.source.RECOMMENDATION,
      [ClientSource.FACEBOOK]: CreateClientRequest.source.OTHER, // FACEBOOK -> OTHER
      [ClientSource.PASSING_BY]: CreateClientRequest.source.OTHER, // PASSING_BY -> OTHER
      [ClientSource.OTHER]: CreateClientRequest.source.OTHER,
    };

    return sourceApiMap[domainSource];
  }
}
