import { ClientResponse } from '@/lib/api';

import { ClientRepository } from '../repositories';
import { CreateClientFormData } from '../types';
import { PhoneVO, EmailVO } from '../value-objects';


/**
 * Use Case для створення нового клієнта
 * Реалізує Single Responsibility Principle - відповідає тільки за створення клієнта
 */
export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  /**
   * Виконує створення клієнта з валідацією бізнес-правил
   */
  async execute(data: CreateClientFormData): Promise<ClientResponse> {
    // Валідація через Value Objects
    const phone = new PhoneVO(data.phone);
    const email = data.email ? new EmailVO(data.email) : undefined;

    // Бізнес-правило: перевірка на унікальність телефону
    await this.validateUniquePhone(phone.getInternational());

    // Підготовка даних для створення
    const clientData: CreateClientFormData = {
      ...data,
      phone: phone.getInternational(),
      email: email?.getValue(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
    };

    return await this.clientRepository.create(clientData);
  }

  /**
   * Перевіряє унікальність номера телефону
   */
  private async validateUniquePhone(phone: string): Promise<void> {
    try {
      const searchResult = await this.clientRepository.search({
        keyword: phone,
        page: 0,
        size: 1,
      });

      if (searchResult.content && searchResult.content.length > 0) {
        throw new Error('Клієнт з таким номером телефону вже існує');
      }
    } catch (error) {
      // Якщо помилка не про існування клієнта, ігноруємо (можливо, проблема з API)
      if (error instanceof Error && error.message.includes('вже існує')) {
        throw error;
      }
    }
  }
}
