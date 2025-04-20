import axios from 'axios';
import { Client, ClientSource, ClientStatus, LoyaltyLevel } from '../types/client.types';
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
   * Отримання списку клієнтів з пагінацією та фільтрацією
   */
  async getClients(params: ClientSearchRequest = {}): Promise<ClientsResponse> {
    try {
      const response = await axios.post<ClientsResponse>(`${CLIENT_API_URL}/clients/search`, {
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
      const response = await axios.get<Client>(`${CLIENT_API_URL}/clients/${id}`, {
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
      
      // Додаємо явно withCredentials для цього запиту
      // Для діагностики конвертуємо enum значення у рядки, щоб переконатися,
      // що вони правильно серіалізуються
      const preparedData = {
        ...clientData,
        source: clientData.source.toString(),
        status: clientData.status ? clientData.status.toString() : undefined,
        loyaltyLevel: clientData.loyaltyLevel ? clientData.loyaltyLevel.toString() : undefined,
      };
      
      console.log('Дані після підготовки:', JSON.stringify(preparedData, null, 2));
      
      const response = await axios.post<Client>(`${CLIENT_API_URL}/clients`, preparedData, {
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
  }
};
