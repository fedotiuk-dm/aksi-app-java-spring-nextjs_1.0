import axios from 'axios';
import { Client } from '../types';
import { CLIENT_API_URL } from '@/constants/urls';

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

export const clientsApi = {
  /**
   * Отримання списку клієнтів з пагінацією та фільтрацією
   */
  async getClients(params: ClientSearchRequest = {}): Promise<ClientsResponse> {
    try {
      const response = await axios.post<ClientsResponse>(`${CLIENT_API_URL}/v1/clients/search`, {
        keyword: params.keyword || '',
        status: params.status,
        loyaltyLevel: params.loyaltyLevel,
        page: params.page || 0,
        size: params.size || 10,
        sortBy: params.sortBy || 'fullName',
        sortDir: params.sortDir || 'asc'
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
      const response = await axios.get<Client>(`${CLIENT_API_URL}/v1/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Помилка при завантаженні даних клієнта ${id}:`, error);
      throw error;
    }
  }
};
