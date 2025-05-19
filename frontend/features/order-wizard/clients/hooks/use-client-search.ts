import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClientsService } from '@/lib/api';
import { Client } from '@/features/order-wizard/model/types/types';
import { mapApiClientToModelClient } from '../utils/client.mappers';
import { useDebounce } from '@/features/order-wizard/shared/hooks/useDebounce';

const QUERY_KEYS = {
  search: (keyword: string) => ['clients', 'search', keyword] as const,
};

export const useClientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults, isLoading } = useQuery<Client[]>({
    queryKey: QUERY_KEYS.search(debouncedSearchTerm),
    queryFn: async () => {
      if (!debouncedSearchTerm) return [];
      const response = await ClientsService.searchClients({
        keyword: debouncedSearchTerm,
      });
      return Array.isArray(response)
        ? response.map(mapApiClientToModelClient)
        : [];
    },
    enabled: !!debouncedSearchTerm,
  });

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    searchResults,
    isLoading,
  };
};

interface UseSearchResultsProps {
  clients: Client[];
}

export const useSearchResults = ({ clients }: UseSearchResultsProps) => {
  const hasResults = clients.length > 0;

  const handleClientSelect = useCallback(
    (client: Client, onSelect: (client: Client) => void) => {
      onSelect(client);
    },
    []
  );

  const handleClientEdit = useCallback(
    (client: Client, onEdit: (client: Client) => void) => {
      onEdit(client);
    },
    []
  );

  const getChannelLabel = useCallback((channel: string) => {
    switch (channel) {
      case 'PHONE':
        return 'Телефон';
      case 'SMS':
        return 'SMS';
      case 'VIBER':
        return 'Viber';
      default:
        return channel;
    }
  }, []);

  return {
    hasResults,
    handleClientSelect,
    handleClientEdit,
    getChannelLabel,
  };
};
