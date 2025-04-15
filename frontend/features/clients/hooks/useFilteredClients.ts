'use client';

import { useState, useMemo } from 'react';
import { useClients } from './useClients';
import {
  ClientResponse,
  ClientStatus,
  LoyaltyLevel,
  ClientSource,
} from '../types';

interface FilterOptions {
  status?: ClientStatus | 'ALL';
  loyaltyLevel?: LoyaltyLevel | 'ALL';
  source?: ClientSource | 'ALL';
  search?: string;
  tags?: string[];
  daysAgo?: number;
}

interface UseFilteredClientsResult {
  filteredClients: ClientResponse[];
  isLoading: boolean;
  error: unknown;
  totalClients: number;
  setFilters: (filters: FilterOptions) => void;
  filters: FilterOptions;
}

export const useFilteredClients = (
  initialFilters: FilterOptions = {}
): UseFilteredClientsResult => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const { data: clients = [], isLoading, error } = useClients();

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Фільтр за статусом
      if (
        filters.status &&
        filters.status !== 'ALL' &&
        client.status !== filters.status
      ) {
        return false;
      }

      // Фільтр за рівнем лояльності
      if (
        filters.loyaltyLevel &&
        filters.loyaltyLevel !== 'ALL' &&
        client.loyaltyLevel !== filters.loyaltyLevel
      ) {
        return false;
      }

      // Фільтр за джерелом
      if (
        filters.source &&
        filters.source !== 'ALL' &&
        client.source !== filters.source
      ) {
        return false;
      }

      // Фільтр за пошуком
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = client.fullName?.toLowerCase().includes(searchLower);
        const phoneMatch = client.phone?.toLowerCase().includes(searchLower);
        const emailMatch = client.email?.toLowerCase().includes(searchLower);

        if (!nameMatch && !phoneMatch && !emailMatch) {
          return false;
        }
      }

      // Фільтр за тегами
      if (filters.tags && filters.tags.length > 0) {
        if (!client.tags) return false;

        for (const tag of filters.tags) {
          if (!client.tags.includes(tag)) {
            return false;
          }
        }
      }

      // Фільтр за к-стю днів (нові клієнти)
      if (filters.daysAgo && client.createdAt) {
        const daysAgoDate = new Date();
        daysAgoDate.setDate(daysAgoDate.getDate() - filters.daysAgo);
        if (new Date(client.createdAt) < daysAgoDate) {
          return false;
        }
      }

      return true;
    });
  }, [clients, filters]);

  return {
    filteredClients,
    isLoading,
    error,
    totalClients: clients.length,
    setFilters,
    filters,
  };
};
