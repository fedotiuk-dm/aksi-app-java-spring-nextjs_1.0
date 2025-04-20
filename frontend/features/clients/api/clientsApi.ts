import axios from 'axios';
import { Client } from '../types/client.types';
import { ClientSource, ClientStatus, LoyaltyLevel } from '../types';
import { CLIENT_API_URL } from '@/constants/urls';

// Налаштування заголовків для всіх запитів
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export interface ClientSearchRequest {
  keyword?: string;
  status?: string;
  loyaltyLevel?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ClientsResponse {
  content: Client[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ClientCreateRequest {
  firstName: string;
  lastName: string;
  phone: string;
  additionalPhone?: string;
  email?: string;
  address?: string;
  notes?: string;
  source: ClientSource;
  birthDate?: string;
  status?: ClientStatus;
  loyaltyLevel?: LoyaltyLevel;
  tags?: string[];
}

// Глобальні налаштування Axios
axios.defaults.withCredentials = true; // Дозволяє передавати cookies з автентифікацією

// Налаштовуємо перехоплювач відповідей для логування помилок
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Детальна інформація про помилку:', error);
    if (error.response) {
      // Сервер відповів з кодом статусу, що виходить за межі 2xx
      console.error('Дані відповіді:', error.response.data);
      console.error('Статус:', error.response.status);
      console.error('Заголовки відповіді:', error.response.headers);
      
      // Додаткове логування для помилок валідації
      if (error.response.data && error.response.data.errors) {
        console.error('Деталі помилок валідації:', error.response.data.errors);
      }
      
      // Логування всіх полів в відповіді
      console.error('Весь об\'єкт відповіді:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // Запит було зроблено, але відповіді не отримано
      console.error('Запит виконано, але відповіді не отримано:', error.request);
    } else {
      // Щось сталося під час налаштування запиту, що викликало помилку
      console.error('Помилка під час налаштування запиту:', error.message);
    }
    return Promise.reject(error);
  }
);

export const clientsApi = {
  
  /**
   * Отримання списку клієнтів з пошуком, фільтрацією та пагінацією
   */
  async getClients(params: ClientSearchRequest = {}): Promise<ClientsResponse> {
    try {
      // Використовуємо відносний URL, який буде проксіюватися Next.js
      const url = `${CLIENT_API_URL}/clients/search`;
      const response = await axios.post<ClientsResponse>(url, {
        keyword: params.keyword || '',
        status: params.status,
        loyaltyLevel: params.loyaltyLevel,
        page: params.page || 0,
        size: params.size || 10,
        sortBy: params.sortBy || 'firstName',
        sortDir: params.sortDir || 'asc'
      }, {
        // Важливо передавати cookies з браузера до бекенду
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Помилка при завантаженні списку клієнтів:', error);
      throw error;
    }
  },

  /**
   * Отримання деталей клієнта за ID
   */
  async getClientById(id: string): Promise<Client> {
    try {
      // Використовуємо відносний URL, який буде проксіюватися Next.js
      const apiUrl = `${CLIENT_API_URL}/clients/${id}`;
      console.log(`Відправляємо запит на отримання клієнта: ${apiUrl}`);
      const response = await axios.get<Client>(apiUrl, {
        // Важливо передавати cookies з браузера до бекенду
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Помилка при завантаженні даних клієнта ${id}:`, error);
      throw error;
    }
  },

  /**
   * Створення нового клієнта
   */
  async createClient(clientData: ClientCreateRequest): Promise<Client> {
    try {
      console.log('Відправляємо дані клієнта на сервер:', JSON.stringify(clientData, null, 2));
      // Логуємо заголовки запиту
      console.log('Заголовки запиту:', axios.defaults.headers);
      
      // Створюємо чисту копію даних
      const preparedData = { ...clientData };
      
      // Видаляємо порожні рядки для необов'язкових полів, щоб вони не проходили валідацію
      // Типобезпечна версія
      if (preparedData.additionalPhone === '') preparedData.additionalPhone = undefined;
      if (preparedData.email === '') preparedData.email = undefined;
      if (preparedData.address === '') preparedData.address = undefined;
      if (preparedData.notes === '') preparedData.notes = undefined;
      
      // Перевірка кожного поля для діагностики
      console.log('firstName:', preparedData.firstName, typeof preparedData.firstName);
      console.log('lastName:', preparedData.lastName, typeof preparedData.lastName);
      console.log('phone:', preparedData.phone, typeof preparedData.phone);
      console.log('additionalPhone:', preparedData.additionalPhone, typeof preparedData.additionalPhone);
      console.log('source:', preparedData.source, typeof preparedData.source);
      console.log('status:', preparedData.status, typeof preparedData.status);
      console.log('loyaltyLevel:', preparedData.loyaltyLevel, typeof preparedData.loyaltyLevel);
      
      console.log('Дані після підготовки:', JSON.stringify(preparedData, null, 2));
      
      // Використовуємо відносний URL, який буде проксіюватися Next.js
      const apiUrl = `${CLIENT_API_URL}/clients`;
      console.log(`Відправляємо запит на створення клієнта: ${apiUrl}`);
      const response = await axios.post<Client>(apiUrl, preparedData, {
        withCredentials: true,
        headers: {
          // Додаткові заголовки для діагностики
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Помилка при створенні клієнта:', error);
      throw error;
    }
  },

  /**
   * Видалення клієнта за ID
   */
  async deleteClient(id: string): Promise<void> {
    try {
      console.log(`Видалення клієнта з ID: ${id}`);
      // Використовуємо відносний URL, який буде проксіюватися Next.js
      const apiUrl = `${CLIENT_API_URL}/clients/${id}`;
      await axios.delete(apiUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log(`Клієнта успішно видалено: ${id}`);
    } catch (error) {
      console.error(`Помилка при видаленні клієнта ${id}:`, error);
      throw error;
    }
  }
};
