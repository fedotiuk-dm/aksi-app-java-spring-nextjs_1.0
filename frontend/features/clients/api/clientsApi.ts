// клієнтське API для роботи з бекендом
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import {
  ClientResponse,
  ClientStatus,
  LoyaltyLevel,
  ClientSource,
} from '@/features/clients/types';

// Обираємо правильний шлях до API
const apiBasePath = '/clients';

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

// Функція для логування помилок API
const logApiError = (operation: string, error: any) => {
  console.error(`[clientsApi] Помилка при ${operation}:`, error);

  if (error.response) {
    // Помилка відповіді сервера (статус < 200 або >= 300)
    console.error(`Статус: ${error.response.status}`);
    console.error(`Дані помилки:`, error.response.data);

    // Показуємо детальне повідомлення з сервера, якщо воно є
    const errorMessage =
      error.response.data?.message || `Помилка при ${operation}`;
    toast.error(errorMessage);
  } else if (error.request) {
    // Запит був зроблений, але відповіді не отримано
    console.error('Немає відповіді від сервера');
    toast.error("Немає з'єднання з сервером. Перевірте підключення до мережі.");
  } else {
    // Щось сталося під час налаштування запиту
    console.error('Помилка налаштування запиту:', error.message);
    toast.error(`Помилка запиту: ${error.message}`);
  }

  // Повертаємо відхилений проміс, щоб можна було обробити помилку вище
  return Promise.reject(error);
};

// Отримання списку всіх клієнтів
export const getClients = async (): Promise<ClientResponse[]> => {
  try {
    console.log('[clientsApi] Запит на отримання списку клієнтів');
    const { data } = await axios.get(apiBasePath);
    console.log(`[clientsApi] Отримано ${data.length} клієнтів`);
    return data;
  } catch (error) {
    return logApiError('отриманні списку клієнтів', error);
  }
};

// Отримання клієнта за ID
export const getClientById = async (id: string): Promise<ClientResponse> => {
  try {
    console.log(`[clientsApi] Запит на отримання клієнта з ID: ${id}`);
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
    await axios.delete(`${apiBasePath}/${id}`);
    toast.success('Клієнта успішно видалено');
    console.log('[clientsApi] Клієнта видалено');
  } catch (error) {
    return logApiError(`видаленні клієнта з ID ${id}`, error);
  }
};
