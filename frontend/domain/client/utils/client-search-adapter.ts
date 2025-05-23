import { ClientEntity } from '../entities';
import { ClientSearchParams, ClientSearchResult } from '../types';

/**
 * Адаптер для обробки результатів пошуку клієнтів
 */
export class ClientSearchAdapter {
  /**
   * Форматування відображення клієнта в результатах пошуку
   */
  static formatClientDisplay(client: ClientEntity): string {
    const parts = [];
    
    if (client.fullName) {
      parts.push(client.fullName);
    } else if (client.lastName || client.firstName) {
      const name = [client.firstName, client.lastName].filter(Boolean).join(' ');
      if (name) parts.push(name);
    }
    
    if (client.phone) {
      parts.push(client.phone);
    }
    
    return parts.join(' - ') || 'Клієнт без імені';
  }

  /**
   * Отримання основної контактної інформації
   */
  static getPrimaryContact(client: ClientEntity): string {
    return client.phone || client.email || '';
  }

  /**
   * Перевірка, чи клієнт відповідає пошуковому запиту
   */
  static matchesKeyword(client: ClientEntity, keyword: string): boolean {
    if (!keyword) return true;
    
    const lowerKeyword = keyword.toLowerCase();
    
    return (
      (client.firstName?.toLowerCase().includes(lowerKeyword) || false) ||
      (client.lastName?.toLowerCase().includes(lowerKeyword) || false) ||
      (client.fullName?.toLowerCase().includes(lowerKeyword) || false) ||
      (client.phone?.includes(lowerKeyword) || false) ||
      (client.email?.toLowerCase().includes(lowerKeyword) || false)
    );
  }

  /**
   * Сортування клієнтів за іменем
   */
  static sortByName(clients: ClientEntity[]): ClientEntity[] {
    return [...clients].sort((a, b) => {
      const nameA = [a.lastName, a.firstName].filter(Boolean).join(' ').toLowerCase();
      const nameB = [b.lastName, b.firstName].filter(Boolean).join(' ').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }
}
