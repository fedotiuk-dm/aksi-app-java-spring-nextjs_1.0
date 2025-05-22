import { StateCreator } from 'zustand';

import { ClientsService } from '@/lib/api';

import { NavigationActions } from '../../../wizard/store/navigation';
import { ClientStore } from '../types';

/**
 * Слайс стору для функціональності пошуку клієнтів
 * @template State - тип стану стору
 * @template Middlewares - тип middleware для Zustand
 * @template Extenders - тип екстендерів для Zustand
 * @template Selection - тип вибраних методів та властивостей
 */
export const createClientSearchSlice: StateCreator<
  ClientStore,
  [],
  [],
  Pick<ClientStore, 'setSearchQuery' | 'searchClients' | 'setPage'>
> = (set, get, store) => ({
  setSearchQuery: (query: string) => {
    set((state) => ({
      search: {
        ...state.search,
        query,
        // Скидаємо пагінацію при новому пошуковому запиті
        page: query !== state.search.query ? 0 : state.search.page,
        // Зберігаємо інші поля стану пошуку для коректної роботи з persist
        size: state.search.size,
        totalElements: state.search.totalElements,
        totalPages: state.search.totalPages,
        isLoading: state.search.isLoading,
        error: state.search.error,
        hasNext: state.search.hasNext,
        hasPrevious: state.search.hasPrevious,
      },
    }));

    // Автоматично запускаємо пошук після оновлення query, якщо довжина >= 2 символів
    if (query.length >= 2) {
      // Затримка для уникнення частих запитів під час введення
      setTimeout(() => {
        get().searchClients();
      }, 300);
    } else if (query.length === 0) {
      // Якщо пошук очищено, очищаємо і результати
      set((state) => ({
        clients: [],
        // Оновлюємо стан пошуку для узгодженості
        search: {
          ...state.search,
          totalElements: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
          error: null,
        },
      }));
    }
  },

  searchClients: async () => {
    const { search, clients } = get();
    const { query, page = 0, size = 10 } = search;

    // Не виконуємо пошук, якщо запит порожній
    if (!query || query.length < 2) {
      clearClientsIfNeeded(clients, set);
      return null;
    }

    setLoadingState(set);

    try {
      logSearchDiagnostics(query, page, size);
      return await executeSearch(query, page, size, set, store);
    } catch (error) {
      handleSearchError(error, set);
      return null;
    }
  },

  setPage: (pageNumber: number) => {
    set((state) => ({
      search: {
        ...state.search,
        page: pageNumber,
        // Зберігаємо інші поля стану пошуку для коректної роботи з persist
        query: state.search.query,
        size: state.search.size,
        totalElements: state.search.totalElements,
        totalPages: state.search.totalPages,
        isLoading: state.search.isLoading,
        error: state.search.error,
        hasNext: state.search.hasNext,
        hasPrevious: state.search.hasPrevious,
      },
    }));

    // Перевіряємо, чи є дійсний пошуковий запит, перед виконанням пошуку
    const currentQuery = get().search.query;
    if (currentQuery && currentQuery.length >= 2) {
      // Автоматично оновлюємо результати пошуку при зміні сторінки
      get().searchClients();
    }
  },
});

// Допоміжні функції для зменшення складності

// Очищення списку клієнтів, якщо він не порожній
const clearClientsIfNeeded = (clients: any[], set: any): void => {
  if (clients.length > 0) {
    set((state: any) => ({
      clients: [],
      search: {
        ...state.search,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        error: null,
      },
    }));
  }
};

// Встановлення стану завантаження
const setLoadingState = (set: any): void => {
  set((state: any) => ({
    search: {
      ...state.search,
      isLoading: true,
      error: null,
    },
  }));
};

// Логування діагностичної інформації
const logSearchDiagnostics = (
  query: string,
  page: number | string,
  size: number | string
): void => {
  console.log(`ДІАГНОСТИКА ПОШУКУ КЛІЄНТІВ:`);
  console.log(`- Пошуковий запит: "${query}"`);
  console.log(`- Сторінка: ${page}`);
  console.log(`- Розмір сторінки: ${size}`);

  const requestBody = { query: query.trim(), page, size };
  console.log(`- Дані запиту:`, JSON.stringify(requestBody, null, 2));
};

// Константа для повторюваного повідомлення
const DEFAULT_ERROR_MESSAGE = 'Помилка пошуку клієнтів';

// Виконання пошуку та обробка результатів
const executeSearch = async (
  query: string,
  page: number | string,
  size: number | string,
  set: any,
  store: any
) => {
  const requestBody = {
    query: query.trim(),
    page: typeof page === 'string' ? parseInt(page, 10) : page,
    size: typeof size === 'string' ? parseInt(size, 10) : size,
  };

  console.log(`ДІАГНОСТИКА ПАГІНАЦІЇ при пошуку:`);
  console.log(`- Запит: "${query}"`);
  console.log(`- Сторінка: ${page}, перетворено в ${requestBody.page}`);
  console.log(`- Розмір: ${size}, перетворено в ${requestBody.size}`);

  try {
    const response = await ClientsService.searchClientsWithPagination({ requestBody });

    console.log(`ДІАГНОСТИКА ПАГІНАЦІЇ результати:`);
    console.log(`- Сторінка в результаті: ${response.pageNumber}`);
    console.log(`- Всього сторінок: ${response.totalPages}`);
    console.log(`- Всього елементів: ${response.totalElements}`);
    console.log(`- hasNext: ${response.hasNext}, hasPrevious: ${response.hasPrevious}`);

    updateStateWithResults(response, page, set);
    checkEmptyResults(response, store);
    return response;
  } catch (apiError: any) {
    return await handleApiError(apiError, query, page, size);
  }
};

// Оновлення стану з результатами пошуку
const updateStateWithResults = (response: any, page: number | string, set: any): void => {
  console.log(
    `- Успішна відповідь:`,
    JSON.stringify(
      {
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        content: response.content?.length || 0,
      },
      null,
      2
    )
  );

  const totalPages = response.totalPages || 0;
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
  const hasNextPage = response.hasNext || pageNum < totalPages - 1;
  const hasPreviousPage = response.hasPrevious || pageNum > 0;

  set((state: any) => ({
    clients: response.content || [],
    search: {
      ...state.search,
      isLoading: false,
      totalElements: response.totalElements || 0,
      totalPages,
      hasNext: hasNextPage,
      hasPrevious: hasPreviousPage,
      error: null,
    },
  }));
};

// Перевірка порожніх результатів
const checkEmptyResults = (response: any, store: any): void => {
  const wizardStore = store as unknown as { navigation?: NavigationActions };
  if (wizardStore.navigation && (!response.content || response.content.length === 0)) {
    console.log('Клієнтів не знайдено. Можна запропонувати створення нового клієнта.');
  }
};

// Обробка помилок API
const handleApiError = async (
  apiError: any,
  query: string,
  page: number | string,
  size: number | string
) => {
  console.error('- Помилка при виклику API:', apiError);

  if (apiError.response?.status === 400) {
    console.error('- Деталі помилки 400:', apiError.response.data);
    return await tryAlternativeRequest(query, page, size, apiError);
  }

  throw apiError;
};

// Спроба альтернативного запиту з рядковими типами
const tryAlternativeRequest = async (
  query: string,
  page: number | string,
  size: number | string,
  originalError: any
) => {
  console.log('- Спроба альтернативного запиту з рядковими типами');

  try {
    // Конвертуємо рядки в числа перед створенням запиту, але надсилаємо як @ts-ignore
    // оскільки це спроба обійти можливі проблеми на бекенді
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const sizeNum = typeof size === 'string' ? parseInt(size, 10) : size;

    // @ts-ignore - навмисне тестування альтернативного формату
    const stringResponse = await ClientsService.searchClientsWithPagination({
      requestBody: {
        query: query.trim(),
        // @ts-ignore - навмисне тестуємо рядкові значення
        page: String(pageNum),
        // @ts-ignore - навмисне тестуємо рядкові значення
        size: String(sizeNum),
      },
    });

    console.log('- Альтернативний запит успішний!');
    return stringResponse;
  } catch (altError) {
    console.error('- Альтернативний запит також не вдався:', altError);
    throw originalError;
  }
};

// Обробка загальних помилок пошуку
const handleSearchError = (error: unknown, set: any): void => {
  console.error('Помилка пошуку клієнтів:', error);

  let errorMessage = DEFAULT_ERROR_MESSAGE;

  if (isAxiosError(error)) {
    errorMessage = extractAxiosErrorMessage(error);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  setErrorState(errorMessage, set);
};

// Перевірка, чи є помилка помилкою axios
const isAxiosError = (error: unknown): boolean => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    error.response !== undefined
  );
};

// Вилучення повідомлення про помилку з відповіді axios
const extractAxiosErrorMessage = (error: any): string => {
  const responseData = error.response?.data;

  if (responseData) {
    logBadRequestDetails(error);
    return responseData.message || responseData.error || DEFAULT_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
};

// Логування деталей помилки 400 Bad Request
const logBadRequestDetails = (error: any): void => {
  console.error('Деталі API помилки:', error.response?.data);

  if (error.response?.status === 400) {
    console.error('Помилка 400 Bad Request - можливо невалідні параметри запиту:');
    console.error('- URL:', error.config?.url);
    console.error('- Метод:', error.config?.method);
    console.error('- Дані запиту:', error.config?.data);
    console.error('- Заголовки:', error.config?.headers);
  }
};

// Встановлення стану помилки
const setErrorState = (errorMessage: string, set: any): void => {
  set((state: any) => ({
    clients: [],
    search: {
      ...state.search,
      isLoading: false,
      error: errorMessage,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
    },
  }));
};
