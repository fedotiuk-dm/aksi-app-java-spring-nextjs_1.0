'use client';

import { useState, useMemo, useEffect } from 'react';
import { useClients } from './useClients';
import { useSearchClients } from './useClients';
import {
  ClientResponse,
  ClientStatus,
  LoyaltyLevel,
  ClientSource,
} from '../types';
import { ClientSearchRequest } from '../api/clientsApi';

interface FilterOptions {
  status?: ClientStatus;
  loyaltyLevel?: LoyaltyLevel;
  source?: ClientSource;
  search?: string;
  tags?: string[];
  daysAgo?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

interface UseFilteredClientsResult {
  filteredClients: ClientResponse[];
  isLoading: boolean;
  error: Error | null;
  totalClients: number;
  setFilters: (filters: FilterOptions) => void;
  filters: FilterOptions;
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
  };
}

export const useFilteredClients = (
  initialFilters: FilterOptions = {}
): UseFilteredClientsResult => {
  const [filters, setFilters] = useState<FilterOptions>({
    page: 0,
    size: 10,
    sortBy: 'updatedAt',
    sortDirection: 'DESC',
    ...initialFilters,
  });

  const [searchRequest, setSearchRequest] = useState<ClientSearchRequest>({
    pageNumber: filters.page,
    pageSize: filters.size,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection as 'ASC' | 'DESC',
  });

  // Оновлюємо searchRequest при зміні фільтрів
  useEffect(() => {
    const newSearchRequest: ClientSearchRequest = {
      pageNumber: filters.page,
      pageSize: filters.size,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection as 'ASC' | 'DESC',
      status: filters.status,
      loyaltyLevel: filters.loyaltyLevel,
      source: filters.source,
      searchTerm: filters.search,
    };

    // Додаємо fromDate якщо вказано daysAgo
    if (filters.daysAgo) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - filters.daysAgo);
      newSearchRequest.fromDate = fromDate.toISOString().split('T')[0];
    }

    // Додаємо теги, якщо вони є
    if (filters.tags && filters.tags.length > 0) {
      newSearchRequest.tags = filters.tags;
    }

    setSearchRequest(newSearchRequest);
  }, [filters]);

  // Використовуємо новий хук для пошуку клієнтів з бекенду
  const {
    data: searchResults,
    isLoading,
    error,
  } = useSearchClients(searchRequest);

  // Резервний варіант - отримуємо всіх клієнтів без фільтрів
  const { data: allClients = [] } = useClients();

  // Клієнти з пошуку або всі клієнти, якщо пошук не працює
  const clients = useMemo(() => {
    return searchResults?.content || allClients;
  }, [searchResults, allClients]);

  // Інформація про пагінацію
  const pageInfo = useMemo(
    () => ({
      currentPage: searchResults?.number || 0,
      totalPages: searchResults?.totalPages || 1,
      totalElements: searchResults?.totalElements || clients.length,
    }),
    [searchResults, clients.length]
  );

  return {
    filteredClients: clients,
    isLoading,
    error,
    totalClients: pageInfo.totalElements,
    setFilters,
    filters,
    pageInfo,
  };
};
