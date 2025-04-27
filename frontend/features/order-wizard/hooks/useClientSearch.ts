import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClientsService, ClientResponse } from '@/lib/api';
import { Client, ClientSource, ClientAddress, CommunicationChannel } from '../model/types/types';
import { UUID } from 'node:crypto';

interface UseClientSearchProps {
  initialQuery?: string;
  debounceTime?: number;
  enabled?: boolean;
  minQueryLength?: number;
  onClientSelect?: (client: Client) => void;
}

interface ClientSearchState {
  searchTerm: string;               // Замість searchQuery
  setSearchTerm: (query: string) => void; // Замість setSearchQuery
  isSearching: boolean;            // Замість isLoading
  searchResults: Client[];         // Замість clients
  handleClearSearch: () => void;   // Нова функція для очищення пошуку
  handleClientSelect: (client: Client) => void; // Нова функція для вибору клієнта
}

/**
 * Hook for searching clients with debounce functionality
 * @param initialQuery - Initial search query
 * @param debounceTime - Debounce time in milliseconds (default: 500ms)
 * @param enabled - Whether the query is enabled (default: true)
 * @param minQueryLength - Minimum query length to trigger search (default: 3)
 */
export const useClientSearch = ({
  initialQuery = '',
  debounceTime = 500,
  enabled = true,
  minQueryLength = 3,
  onClientSelect,
}: UseClientSearchProps = {}): ClientSearchState => {
  // Search query state
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  // Debounced query state
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQuery);
  // Timer reference for debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Apply debounce to search query
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceTime);

    // Cleanup function to clear the timer if the component unmounts
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, debounceTime]);

  // Convert API source to model ClientSourceInfo
  const convertSource = (apiSource?: ClientResponse.source, details?: string): { source: ClientSource; details?: string } => {
    let source: ClientSource = 'OTHER';
    
    if (apiSource) {
      switch(apiSource) {
        case ClientResponse.source.INSTAGRAM:
          source = 'INSTAGRAM';
          break;
        case ClientResponse.source.GOOGLE:
          source = 'GOOGLE';
          break;
        case ClientResponse.source.RECOMMENDATION:
          source = 'RECOMMENDATION';
          break;
        default:
          source = 'OTHER';
      }
    }
    
    return { source, details };
  };

  // Map API client to model client
  const mapApiClientToModelClient = useCallback((apiClient: ClientResponse): Client => {
    // Парсинг адреси - якщо адреса прийшла як рядок, формуємо об'єкт ClientAddress
    const address: ClientAddress | undefined = apiClient.address 
      ? typeof apiClient.address === 'string'
        ? { additionalInfo: apiClient.address }
        : apiClient.address as unknown as ClientAddress
      : undefined;
    
    // Конвертація типів комунікаційних каналів
    const communicationChannels: CommunicationChannel[] = 
      apiClient.communicationChannels as CommunicationChannel[] || [];
    
    return {
      id: apiClient.id as UUID | undefined,
      firstName: apiClient.firstName || '',
      lastName: apiClient.lastName || '',
      email: apiClient.email,
      phone: apiClient.phone || '',
      address,
      communicationChannels,
      source: convertSource(apiClient.source, apiClient.sourceDetails),
    };
  }, []);

  // Search clients query
  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['clients', 'search', debouncedQuery],
    queryFn: async () => {
      // Перевірка на мінімальну довжину пошукового запиту
      if (debouncedQuery.trim().length < minQueryLength) {
        return [];
      }
      
      try {
        const response = await ClientsService.searchClients({
          keyword: debouncedQuery.trim(),
        });
        
        // Обробка результатів запиту
        if (Array.isArray(response)) {
          return response.map(mapApiClientToModelClient);
        } else if (response) {
          return [mapApiClientToModelClient(response)];
        }
        
        return [];
      } catch (err) {
        console.error('Помилка при пошуку клієнтів:', err);
        throw err;
      }
    },
    enabled: enabled && (debouncedQuery.trim().length >= minQueryLength || debouncedQuery === initialQuery),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Функція для очищення пошуку
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  // Функція для вибору клієнта
  const handleClientSelect = useCallback((client: Client) => {
    if (onClientSelect) {
      onClientSelect(client);
    }
  }, [onClientSelect]);

  return {
    searchTerm: searchQuery,
    setSearchTerm: setSearchQuery,
    isSearching: isLoading,
    searchResults: data || [],
    handleClearSearch,
    handleClientSelect,
  };
};