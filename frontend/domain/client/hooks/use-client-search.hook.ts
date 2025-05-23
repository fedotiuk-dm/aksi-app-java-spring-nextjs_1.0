import { useCallback, useEffect } from 'react';

import { ClientResponse, ClientPageResponse } from '@/lib/api';

import { useDebounce } from './use-debounce.hook';
import { useClientSearchStore } from '../store/client-search.store';
import { CommunicationChannel, ClientSource } from '../types/client-enums';
import { Client } from '../types/client.types';


// 🔥 OpenAPI Integration: прямий імпорт як single source of truth

/**
 * Властивості хука пошуку клієнтів
 */
interface UseClientSearchProps {
  initialSearchTerm?: string;
  debounceDelay?: number;
  autoSearch?: boolean;
  onResultsChange?: (results: Client[]) => void;
  onApiResponse?: (response: ClientPageResponse) => void; // Використовуємо правильний тип з OpenAPI
}

/**
 * Хук для пошуку клієнтів
 *
 * DDD SOLID принципи:
 * - Single Responsibility: відповідає ТІЛЬКИ за пошук клієнтів
 * - Open/Closed: розширюється через props та параметри пошуку
 * - Dependency Inversion: залежить від абстракцій (store, debounce)
 * - Interface Segregation: мінімальний, спеціалізований інтерфейс
 *
 * 🔥 OpenAPI інтеграція як single source of truth:
 * - Всі дані з lib/api через ClientRepository
 * - ClientResponse → Client через ClientAdapter
 * - Type-safe пошукові запити з валідацією
 * - Правильна пагінація згідно API контракту
 * - Прямий доступ до raw API response для debugging
 */
export const useClientSearch = (props: UseClientSearchProps = {}) => {
  const {
    initialSearchTerm = '',
    debounceDelay = 500,
    autoSearch = true,
    onResultsChange,
    onApiResponse,
  } = props;

  const {
    searchTerm,
    results,
    isLoading,
    error,
    pagination,
    setSearchTerm,
    search,
    loadMore,
    clearSearch,
  } = useClientSearchStore();

  /**
   * Функція для виконання пошуку
   * Domain validation + OpenAPI integration
   */
  const performSearch = useCallback(
    async (query: string): Promise<void> => {
      const trimmedQuery = query.trim();

      // Domain validation rule: мінімум 2 символи для пошуку
      if (trimmedQuery.length < 2) {
        clearSearch();
        return;
      }

      setSearchTerm(trimmedQuery);

      // 🔥 OpenAPI Integration: виконуємо пошук через store
      // Store внутрішньо використовує ClientRepository → lib/api
      await search({ keyword: trimmedQuery, page: 0 });
    },
    [setSearchTerm, search, clearSearch]
  );

  /**
   * Відкладений пошук з використанням дебаунсу
   * Performance optimization для UX
   */
  const {
    value: searchQuery,
    handleChange: setSearchQuery,
    isProcessing: isDebouncing,
  } = useDebounce(performSearch, debounceDelay);

  /**
   * Ініціалізація початкового пошукового терміну
   * Lifecycle management
   */
  useEffect(() => {
    if (initialSearchTerm && autoSearch) {
      setSearchQuery(initialSearchTerm);
    }
  }, [initialSearchTerm, autoSearch, setSearchQuery]);

  /**
   * Виклик callback при зміні результатів
   * Event notification pattern
   */
  useEffect(() => {
    if (onResultsChange) {
      onResultsChange(results);
    }
  }, [results, onResultsChange]);

  /**
   * 🔥 OpenAPI Integration: конвертація доменних результатів назад в API формат
   * Це потрібно для callback onApiResponse
   */
  const getApiResponseFormat = useCallback((): ClientPageResponse | null => {
    if (results.length === 0 && pagination.totalElements === 0) return null;

    // Мапінг доменних каналів в API формат
    const mapCommunicationChannelsToApi = (
      channels: CommunicationChannel[]
    ): ('PHONE' | 'SMS' | 'VIBER')[] => {
      const apiChannelMap: Record<CommunicationChannel, 'PHONE' | 'SMS' | 'VIBER' | null> = {
        [CommunicationChannel.PHONE]: 'PHONE',
        [CommunicationChannel.SMS]: 'SMS',
        [CommunicationChannel.VIBER]: 'VIBER',
        [CommunicationChannel.EMAIL]: null, // EMAIL не підтримується в API
        [CommunicationChannel.TELEGRAM]: null, // TELEGRAM не підтримується в API
      };

      return channels
        .map((channel) => apiChannelMap[channel])
        .filter((channel): channel is 'PHONE' | 'SMS' | 'VIBER' => channel !== null);
    };

    // Мапінг доменного ClientSource в API ClientResponse.source формат
    const mapClientSourceToApi = (
      domainSource: ClientSource | undefined
    ): ClientResponse.source | undefined => {
      if (!domainSource) return undefined;

      const apiSourceMap: Record<ClientSource, ClientResponse.source> = {
        [ClientSource.INSTAGRAM]: ClientResponse.source.INSTAGRAM,
        [ClientSource.GOOGLE]: ClientResponse.source.GOOGLE,
        [ClientSource.RECOMMENDATION]: ClientResponse.source.RECOMMENDATION,
        [ClientSource.FACEBOOK]: ClientResponse.source.OTHER, // FACEBOOK мапимо в OTHER
        [ClientSource.PASSING_BY]: ClientResponse.source.OTHER, // PASSING_BY мапимо в OTHER
        [ClientSource.OTHER]: ClientResponse.source.OTHER,
      };

      return apiSourceMap[domainSource];
    };

    // Конвертуємо доменні Client[] назад в ClientResponse[] для API сумісності
    const clientResponses: ClientResponse[] = results.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      email: client.email || undefined,
      address: client.address || undefined,
      source: mapClientSourceToApi(client.source) || ClientResponse.source.OTHER,
      sourceDetails: client.sourceDetails || undefined,
      communicationChannels: mapCommunicationChannelsToApi(client.communicationChannels || []),
      createdAt: client.createdAt ? client.createdAt.toISOString() : undefined,
      updatedAt: client.updatedAt ? client.updatedAt.toISOString() : undefined,
    }));

    // Структура згідно ClientPageResponse
    return {
      content: clientResponses,
      totalElements: pagination.totalElements,
      totalPages: pagination.totalPages,
      pageNumber: pagination.page, // Використовуємо pageNumber замість number
      pageSize: pagination.size,
      hasPrevious: pagination.page > 0,
      hasNext: pagination.hasMore,
    };
  }, [results, pagination]);

  /**
   * Виклик callback для OpenAPI відповіді
   */
  useEffect(() => {
    if (onApiResponse && results.length > 0) {
      const apiResponse = getApiResponseFormat();
      if (apiResponse) {
        onApiResponse(apiResponse);
      }
    }
  }, [results, onApiResponse, getApiResponseFormat]);

  /**
   * Обробник зміни сторінки
   * Pagination handling через OpenAPI
   */
  const handlePageChange = useCallback(
    async (page: number) => {
      await search({ keyword: searchTerm, page });
    },
    [search, searchTerm]
  );

  /**
   * Обробник завантаження більше результатів
   * Infinite scroll pattern з OpenAPI пагінацією
   */
  const handleLoadMore = useCallback(async () => {
    await loadMore();
  }, [loadMore]);

  /**
   * Обробник очищення пошуку
   * State reset operation
   */
  const handleClear = useCallback(() => {
    clearSearch();
    setSearchQuery('');
  }, [clearSearch, setSearchQuery]);

  /**
   * Обробник прямого пошуку (без дебаунсу)
   * Immediate search for user actions
   */
  const handleDirectSearch = useCallback(
    async (query?: string) => {
      const searchKeyword = query !== undefined ? query : searchQuery;
      await performSearch(searchKeyword);
    },
    [performSearch, searchQuery]
  );

  return {
    // Дані пошуку (Read-only для UI)
    searchQuery,
    searchTerm,
    results, // Domain Client[] objects
    pagination,

    // Стан (Computed properties)
    isLoading: isLoading || isDebouncing,
    isDebouncing,
    error,
    isEmpty: results.length === 0 && !isLoading && searchTerm.length > 0,
    hasResults: results.length > 0,
    hasMore: pagination.hasMore,

    // Методи (Write operations)
    setSearchQuery,
    handleDirectSearch,
    handlePageChange,
    handleLoadMore,
    handleClear,

    // 🔥 OpenAPI Integration: додаткові методи
    getApiResponseFormat, // Конвертація в API формат
    getRawResults: () => results, // Прямий доступ до доменних об'єктів

    // Додаткові утилітарні властивості
    canLoadMore: pagination.hasMore && !isLoading,
    totalResults: pagination.totalElements,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,

    // Metadata
    searchType: 'client' as const,
    apiIntegration: 'lib/api' as const, // Позначка інтеграції з OpenAPI
  };
};
