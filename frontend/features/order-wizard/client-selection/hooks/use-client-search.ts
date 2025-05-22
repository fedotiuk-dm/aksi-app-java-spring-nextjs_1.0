import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { ClientsService } from '@/lib/api';

// Використовуємо тільки схему і створюємо власний тип
// щоб уникнути невідповідності типів після регенерації API
import { clientSearchSchema } from '../schemas';
import { useClientStore } from '../store';

/**
 * Хук для пошуку клієнтів
 * Інкапсулює логіку пошуку клієнтів та валідацію пошукових параметрів
 */
export const useClientSearch = () => {
  const {
    search,
    clients,
    setSearchQuery,
    searchClients,
    setPage
  } = useClientStore();

  /**
   * Тип, відповідний до Zod схеми clientSearchSchema
   */
  type ClientSearchFormType = {
    query: string;
    pageNumber?: number; // Опціональне поле відповідно до Zod схеми з дефолтним значенням
    pageSize?: number; // Опціональне поле відповідно до Zod схеми з дефолтним значенням
  };
  
  // Форма для валідації пошукових параметрів
  const form = useForm<ClientSearchFormType>({
    resolver: zodResolver(clientSearchSchema),
    defaultValues: {
      query: search.query,
      // Задаємо значення але не зобов'язуємо поля бути обов'язковими
      pageNumber: search.pageNumber,
      pageSize: search.pageSize
    }
  });

  // Запит на пошук клієнтів з TanStack Query
  const searchQuery = useQuery({
    queryKey: ['clients', 'search', search.query, search.pageNumber, search.pageSize],
    queryFn: () => ClientsService.searchClientsWithPagination({
      requestBody: {
        query: search.query,
        pageNumber: search.pageNumber,
        pageSize: search.pageSize
      }
    }),
    enabled: search.query.length >= 2 // Запит активується тільки якщо довжина запиту >= 2 символів
  });

  // Обробник відправки форми
  const handleSearch = form.handleSubmit(async (data) => {
    // Використовуємо тільки query, оскільки пагінація керується окремо
    setSearchQuery(data.query);
    await searchClients();
  });

  // Обробник зміни сторінки
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Повертаємо все необхідне для компонентів
  return {
    form,
    search,
    clients,
    isLoading: search.isLoading || searchQuery.isLoading,
    error: search.error,
    totalPages: search.totalPages,
    hasNext: search.hasNext,
    hasPrevious: search.hasPrevious,
    handleSearch,
    handlePageChange,
    searchClients
  };
};
