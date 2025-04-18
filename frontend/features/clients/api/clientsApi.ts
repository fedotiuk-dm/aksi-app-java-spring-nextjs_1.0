// клієнтське API для роботи з бекендом
import axios from '@/lib/axios';
import { AxiosError, isAxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import {
  ClientResponse,
  ClientStatus,
  LoyaltyLevel,
  ClientSource,
} from '@/features/clients/types';
import { Page } from '@/types';
import { authTokens } from '@/features/auth/api/authApi';

// Обираємо правильний шлях до API
const apiBasePath = '/v1/clients';

// Типи для створення/оновлення клієнта
export interface ClientCreateRequest {
  fullName: string;
  phone: string;
  additionalPhone?: string;
  email?: string;
  address?: string;
  notes?: string;
  status: ClientStatus;
  loyaltyLevel: LoyaltyLevel;
  source?: ClientSource;
  birthDate?: string;
  tags?: string[];
}

export type ClientUpdateRequest = Partial<ClientCreateRequest>;

// Запит на пошук клієнтів
export interface ClientSearchRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  status?: ClientStatus;
  loyaltyLevel?: LoyaltyLevel;
  source?: ClientSource;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
  tags?: string[];
}

// Функція для додавання токена до заголовків
const addAuthHeaders = () => {
  const token = authTokens.getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Функція для логування помилок API
const logApiError = (operation: string, error: unknown) => {
  console.error(`[clientsApi] Помилка при ${operation}:`, error);

  if (error instanceof Error) {
    if (isAxiosError(error)) {
      // Помилка відповіді сервера (статус < 200 або >= 300)
      const axiosError = error as AxiosError;
      console.error(`Статус: ${axiosError.response?.status}`);
      console.error(`Дані помилки:`, axiosError.response?.data);

      // Перевіряємо помилки авторизації
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        toast.error(
          'Помилка авторизації. Будь ласка, увійдіть в систему знову.'
        );
        return Promise.reject(
          new Error(
            `Помилка авторизації (${axiosError.response.status}): Необхідно увійти знову`
          )
        );
      }

      // Показуємо детальне повідомлення з сервера, якщо воно є
      const errorMessage =
        (
          axiosError.response?.data as Record<string, unknown>
        )?.message?.toString() || `Помилка при ${operation}`;
      toast.error(errorMessage);
    } else {
      // Запит був зроблений, але відповіді не отримано
      console.error('Помилка запиту:', error.message);
      toast.error(`Помилка запиту: ${error.message}`);
    }
  } else {
    // Щось сталося під час налаштування запиту
    console.error('Невідома помилка:', error);
    toast.error(`Невідома помилка при ${operation}`);
  }

  // Повертаємо відхилений проміс, щоб можна було обробити помилку вище
  return Promise.reject(error);
};

// Отримання списку всіх клієнтів
export const getClients = async (): Promise<ClientResponse[]> => {
  try {
    console.log('[clientsApi] Запит на отримання списку клієнтів');
    addAuthHeaders();

    // Примітка: фактично такий ендпоінт не існує на бекенді,
    // використовуємо searchClients з порожнім запитом
    const response = await searchClients({
      pageSize: 1000, // Встановлюємо великий розмір, щоб отримати всі дані
    });

    return response.content || [];
  } catch (error) {
    return logApiError('отриманні списку клієнтів', error);
  }
};

// Пошук клієнтів з пагінацією та фільтрацією
export const searchClients = async (
  request: ClientSearchRequest
): Promise<Page<ClientResponse>> => {
  try {
    console.log('[clientsApi] Запит на пошук клієнтів:', request);
    addAuthHeaders();

    const { data } = await axios.post(`${apiBasePath}/search`, request);
    console.log(
      `[clientsApi] Отримано ${data.content?.length || 0} клієнтів з ${
        data.totalElements
      } загальних`
    );
    return data;
  } catch (error) {
    return logApiError('пошуку клієнтів', error);
  }
};

// Отримання клієнта за ID
export const getClientById = async (id: string): Promise<ClientResponse> => {
  try {
    console.log(`[clientsApi] Запит на отримання клієнта з ID: ${id}`);
    addAuthHeaders();

    const { data } = await axios.get(`${apiBasePath}/${id}`);
    console.log(`[clientsApi] Отримано клієнта:`, data);
    return data;
  } catch (error) {
    return logApiError(`отриманні клієнта з ID ${id}`, error);
  }
};

// Створення нового клієнта
export const createClient = async (
  clientData: ClientCreateRequest
): Promise<ClientResponse> => {
  try {
    console.log('[clientsApi] Запит на створення клієнта:', clientData);
    addAuthHeaders();

    const { data } = await axios.post(apiBasePath, clientData);
    toast.success('Клієнта успішно створено');
    console.log('[clientsApi] Клієнта створено:', data);
    return data;
  } catch (error) {
    return logApiError('створенні клієнта', error);
  }
};

// Оновлення існуючого клієнта
export const updateClient = async (
  id: string,
  clientData: ClientUpdateRequest
): Promise<ClientResponse> => {
  try {
    console.log(
      `[clientsApi] Запит на оновлення клієнта з ID ${id}:`,
      clientData
    );
    addAuthHeaders();

    const { data } = await axios.put(`${apiBasePath}/${id}`, clientData);
    toast.success('Клієнта успішно оновлено');
    console.log('[clientsApi] Клієнта оновлено:', data);
    return data;
  } catch (error) {
    return logApiError(`оновленні клієнта з ID ${id}`, error);
  }
};

// Видалення клієнта
export const deleteClient = async (id: string): Promise<void> => {
  try {
    console.log(`[clientsApi] Запит на видалення клієнта з ID ${id}`);
    addAuthHeaders();

    await axios.delete(`${apiBasePath}/${id}`);
    toast.success('Клієнта успішно видалено');
    console.log('[clientsApi] Клієнта видалено');
  } catch (error) {
    return logApiError(`видаленні клієнта з ID ${id}`, error);
  }
};

// Отримання топ лояльних клієнтів
export const getTopLoyalClients = async (
  limit: number = 10
): Promise<ClientResponse[]> => {
  try {
    console.log(
      `[clientsApi] Запит на отримання топ ${limit} лояльних клієнтів`
    );
    addAuthHeaders();

    const { data } = await axios.get(`${apiBasePath}/top/loyal`, {
      params: { limit },
    });
    console.log(`[clientsApi] Отримано ${data.length} лояльних клієнтів`);
    return data;
  } catch (error) {
    return logApiError('отриманні лояльних клієнтів', error);
  }
};

// Отримання клієнтів з найбільшими витратами
export const getTopSpendingClients = async (
  limit: number = 10
): Promise<ClientResponse[]> => {
  try {
    console.log(
      `[clientsApi] Запит на отримання топ ${limit} клієнтів за витратами`
    );
    addAuthHeaders();

    const { data } = await axios.get(`${apiBasePath}/top/spending`, {
      params: { limit },
    });
    console.log(`[clientsApi] Отримано ${data.length} клієнтів за витратами`);
    return data;
  } catch (error) {
    return logApiError('отриманні клієнтів за витратами', error);
  }
};
