import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { ClientsService } from '@/lib/api';

// Використовуємо тільки схему і створюємо власний тип
// щоб уникнути невідповідності типів після регенерації API
import { useClientStore } from '../model/store';
import { clientSearchSchema } from '../schemas';
import { useDebounceSearch } from './use-debounce-search';

/**
 * Альтернативні формати запиту для тестування API
 * @param query Пошуковий запит
 * @param page Номер сторінки
 * @param size Розмір сторінки
 */
const getRequestVariants = (query: string, page: number, size: number) => {
  return [
    // Стандартний формат
    {
      query: query.trim(),
      page,
      size,
    },
    // Рядкові значення для page і size
    {
      query: query.trim(),
      page: String(page),
      size: String(size),
    },
    // Тільки запит (без пагінації)
    {
      query: query.trim(),
    },
    // Без page, з size
    {
      query: query.trim(),
      size,
    },
    // З page, без size
    {
      query: query.trim(),
      page,
    },
  ];
};

/**
 * Хук для пошуку клієнтів
 * Інкапсулює логіку пошуку клієнтів та валідацію пошукових параметрів
 */
export const useClientSearch = () => {
  const {
    search,
    clients,
    setSearchQuery,
    searchClients: storeSearchClients,
    setPage,
  } = useClientStore();

  /**
   * Тип, відповідний до Zod схеми clientSearchSchema
   */
  type ClientSearchFormType = {
    query: string;
    page?: string | number; // Допускає як рядок, так і число
    size?: string | number; // Допускає як рядок, так і число
  };

  // Форма для валідації пошукових параметрів
  const form = useForm<ClientSearchFormType>({
    resolver: zodResolver(clientSearchSchema),
    defaultValues: {
      query: search.query,
      // Задаємо значення але не зобов'язуємо поля бути обов'язковими
      page: search.page,
      size: search.size,
    },
  });

  // Функція пошуку для передачі в useDebounceSearch
  const performSearch = async (query: string): Promise<void> => {
    setSearchQuery(query);
    await storeSearchClients();
  };

  // Використовуємо хук для debounce пошуку
  const { query, setQuery, isSearching, validationMessage, executeSearchNow, clearSearch } =
    useDebounceSearch(performSearch);

  // Ініціалізуємо query з форми
  const watchedQuery = form.watch('query');
  if (watchedQuery !== query) {
    setQuery(watchedQuery);
  }

  // Запит на пошук клієнтів з TanStack Query
  const searchQuery = useQuery({
    queryKey: ['clients', 'search', search.query, search.page, search.size],
    queryFn: async () => {
      // Мінімальна перевірка довжини запиту
      if (!search.query || search.query.length < 2) {
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          pageNumber: 0,
          pageSize: 10,
          hasPrevious: false,
          hasNext: false,
        };
      }

      // Виклик OpenAPI напряму
      try {
        console.log(`TANSACK QUERY - Пошук клієнтів:`, {
          query: search.query,
          page: search.page,
          size: search.size,
        });

        // Отримуємо різні варіанти форматів запиту
        const requestVariants = getRequestVariants(
          search.query,
          search.page ?? 0,
          search.size ?? 10
        );

        // Спробуємо різні формати запиту, доки не отримаємо успішну відповідь
        let lastError = null;

        for (let i = 0; i < requestVariants.length; i++) {
          const variant = requestVariants[i];
          console.log(`TANSACK QUERY - Спроба ${i + 1}/${requestVariants.length}:`, variant);

          try {
            const response = await ClientsService.searchClientsWithPagination({
              // @ts-ignore - ігноруємо помилки типів для тестування
              requestBody: variant,
            });

            console.log(`TANSACK QUERY - Успішно! Знайдено ${response.totalElements} клієнтів`);
            return response;
          } catch (err) {
            console.error(`TANSACK QUERY - Помилка у спробі ${i + 1}:`, err);
            lastError = err;
          }
        }

        // Якщо всі спроби невдалі, викидаємо останню помилку
        throw lastError || new Error('Всі спроби пошуку клієнтів невдалі');
      } catch (error) {
        console.error('Помилка при TanStack Query пошуку:', error);
        throw error;
      }
    },
    enabled: search.query.length >= 2, // Запит активується тільки якщо довжина запиту >= 2 символів
    retry: 1, // Спробуємо перезапитати лише один раз
  });

  // Обробник відправки форми
  const handleSearch = form.handleSubmit(async () => {
    await executeSearchNow();
  });

  // Обробник зміни пошукового запиту
  const handleQueryChange = (value: string) => {
    form.setValue('query', value);
    setQuery(value);
  };

  // Обробник очищення пошукового запиту
  const handleClearSearch = async () => {
    form.setValue('query', '');
    await clearSearch();
  };

  // Обробник зміни сторінки
  const handlePageChange = (page: number) => {
    // Оновлюємо значення сторінки в формі (для валідації)
    form.setValue('page', page);

    console.log(`ДІАГНОСТИКА ПАГІНАЦІЇ: Зміна сторінки на ${page}`);
    console.log(`- Поточний запит: "${search.query}"`);
    console.log(`- Поточний стан пошуку:`, {
      page: search.page,
      size: search.size,
      totalElements: search.totalElements,
      totalPages: search.totalPages,
    });

    // Змінюємо сторінку в стані та виконуємо пошук
    setPage(page);
  };

  // Повертаємо все необхідне для компонентів
  return {
    form,
    search,
    clients,
    isLoading: search.isLoading || searchQuery.isLoading,
    isSearching,
    error: search.error,
    validationMessage,
    totalPages: search.totalPages,
    hasNext: search.hasNext,
    hasPrevious: search.hasPrevious,
    handleSearch,
    handleQueryChange,
    handleClearSearch,
    handlePageChange,
    searchClients: storeSearchClients,
  };
};
