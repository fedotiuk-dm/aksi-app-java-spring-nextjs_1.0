import { useState } from 'react';
import { ClientsService, ClientResponse } from '@/lib/api';
import type { CreateClientRequest, UpdateClientRequest } from '@/lib/api';
import { Client, ClientSource } from '../model/types';
import type { UUID } from 'node:crypto';
import { useOrderWizardStatus } from '../model/store/store';

/**
 * Хук для роботи з API клієнтів в Order Wizard
 */
export const useClients = () => {
  const { withLoading } = useOrderWizardStatus();
  const [searchResults, setSearchResults] = useState<Client[]>([]);

  /**
   * Пошук клієнтів за ключовим словом
   */
  const searchClients = async (searchTerm: string) => {
    // Перевірка на мінімальну довжину пошукового запиту
    if (searchTerm.length < 3) {
      setSearchResults([]);
      return [];
    }

    return withLoading(async (): Promise<Client[]> => {
      try {
        // Викликаємо API пошуку клієнтів
        const response = await ClientsService.searchClients({
          keyword: searchTerm,
        });

        console.log('Результат пошуку клієнтів:', response);

        // Перевіряємо тип відповіді та обробляємо відповідно
        let clients: Client[] = [];

        if (Array.isArray(response)) {
          // Якщо відповідь - масив
          clients = response.map(mapApiClientToModelClient);
        } else if (response) {
          // Якщо відповідь - один об'єкт
          clients = [mapApiClientToModelClient(response)];
        }

        console.log('Оброблені результати:', clients);

        // Зберігаємо результати
        setSearchResults(clients);
        return clients;
      } catch (error) {
        console.error('Помилка при пошуку клієнтів:', error);
        setSearchResults([]);
        return [];
      }
    });
  };

  /**
   * Отримання клієнта за ID
   */
  const getClientById = async (clientId: string) => {
    return withLoading(async (): Promise<Client> => {
      const response = await ClientsService.getClientById({
        id: clientId,
      });

      return mapApiClientToModelClient(response);
    });
  };

  /**
   * Створення нового клієнта
   */
  const createClient = async (clientData: Omit<Client, 'id'>) => {
    return withLoading(async (): Promise<Client> => {
      // Перетворюємо наш формат даних у формат API
      const apiClientData: CreateClientRequest = {
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        phone: clientData.phone,
        email: clientData.email,
        address: formatAddress(clientData.address),
        communicationChannels: clientData.communicationChannels,
        source: clientData.source?.source
          ? mapSourceToApiSource(clientData.source.source)
          : undefined,
        sourceDetails: clientData.source?.details,
      };

      // Діагностичний лог для перевірки даних, які відправляються на бекенд
      console.log('Client data being sent to API:', JSON.stringify(apiClientData, null, 2));
      
      // Викликаємо API створення клієнта
      try {
        const response = await ClientsService.createClient({
          requestBody: apiClientData,
        });
        return mapApiClientToModelClient(response);
      } catch (error) {
        console.error('Error details from API:', error);
        throw error;
      }
    });
  };

  /**
   * Оновлення існуючого клієнта
   */
  const updateClient = async (
    clientId: string,
    clientData: Partial<Client>
  ) => {
    return withLoading(async (): Promise<Client> => {
      // Перетворюємо наш формат даних у формат API
      const apiClientData: UpdateClientRequest = {};

      if (clientData.firstName !== undefined)
        apiClientData.firstName = clientData.firstName;
      if (clientData.lastName !== undefined)
        apiClientData.lastName = clientData.lastName;
      if (clientData.phone !== undefined)
        apiClientData.phone = clientData.phone;
      if (clientData.email !== undefined)
        apiClientData.email = clientData.email;
      if (clientData.address !== undefined)
        apiClientData.address = formatAddress(clientData.address);
      if (clientData.communicationChannels !== undefined) {
        apiClientData.communicationChannels = clientData.communicationChannels;
      }
      if (clientData.source !== undefined && clientData.source.source) {
        apiClientData.source = mapSourceToApiSource(clientData.source.source);
        if (clientData.source.details) {
          apiClientData.sourceDetails = clientData.source.details;
        }
      }

      // Викликаємо API оновлення клієнта
      const response = await ClientsService.updateClient({
        id: clientId,
        requestBody: apiClientData,
      });

      return mapApiClientToModelClient(response);
    });
  };

  /**
   * Функція для форматування адреси
   */
  /**
   * Форматує об'єкт адреси в рядок для відправки на бекенд
   * Формат адреси: вулиця, місто, поштовий індекс, додаткова інформація
   */
  const formatAddress = (address?: Client['address']): string | undefined => {
    if (!address) return undefined;
    
    // Перевіряємо чи є взагалі якісь дані в адресі
    const hasAddressData = address.street || address.city || address.postalCode || address.additionalInfo;
    if (!hasAddressData) return undefined;

    if (typeof address === 'object') {
      // Формуємо масив всіх компонентів адреси
      const addressParts = [
        address.street || '',
        address.city || '',
        address.postalCode || '',
        address.additionalInfo || ''
      ];
      
      // Видаляємо порожні елементи та об'єднуємо в рядок
      return addressParts.filter(part => part.trim() !== '').join(', ');
    }
    
    return address;
  };

  /**
   * Функція для перетворення одного клієнта з API у наш формат
   */
  const mapApiClientToModelClient = (apiClient: ClientResponse): Client => {
    if (!apiClient) return {} as Client;

    return {
      id: apiClient.id ? (String(apiClient.id) as UUID) : undefined,
      firstName: apiClient.firstName || '',
      lastName: apiClient.lastName || '',
      phone: apiClient.phone || '',
      email: apiClient.email,
      address: apiClient.address ? parseAddress(apiClient.address) : undefined,
      communicationChannels: apiClient.communicationChannels || [],
      source: apiClient.source
        ? {
            source: mapApiSourceToModelSource(String(apiClient.source)),
            details: apiClient.sourceDetails,
          }
        : undefined,
    };
  };

  /**
   * Функція для розбору рядка адреси у структуру
   */
  const parseAddress = (addressString: string) => {
    const parts = addressString.split(',').map((part) => part.trim());

    return {
      street: parts[0] || '',
      city: parts[1] || '',
      postalCode: parts[2] || '',
    };
  };

  /**
   * Мапа відповідностей між моделлю і API
   */
  const SOURCE_MAPPING = {
    INSTAGRAM: ClientResponse.source.INSTAGRAM,
    GOOGLE: ClientResponse.source.GOOGLE,
    RECOMMENDATION: ClientResponse.source.RECOMMENDATION,
    OTHER: ClientResponse.source.OTHER,
  } as const;

  /**
   * Функція для перетворення джерела інформації з API у наш формат
   */
  const mapApiSourceToModelSource = (apiSource: string): ClientSource => {
    // Шукаємо відповідне значення в мапі
    const entry = Object.entries(SOURCE_MAPPING).find(
      ([, value]) => value === apiSource
    );
    return (entry ? entry[0] : 'OTHER') as ClientSource;
  };

  /**
   * Функція для перетворення нашого джерела інформації у формат API
   */
  const mapSourceToApiSource = (
    source: ClientSource
  ): ClientResponse.source => {
    // Використовуємо мапу відповідностей
    return SOURCE_MAPPING[source] || ClientResponse.source.OTHER;
  };

  return {
    searchResults,
    searchClients,
    getClientById,
    createClient,
    updateClient,
  };
};
