/**
 * Адаптери для конвертації даних клієнта між UI та API
 */

import { ClientDTO } from '@/lib/api';
import { ClientResponse } from '@/lib/api';
import { ClientCreateRequest } from '@/lib/api';
import { ClientSearchRequest } from '@/lib/api';
import { PageClientResponse } from '@/lib/api';
import { CreateClientFormValues, SearchClientFormValues } from '../schema/client.schema';
import { ClientUI } from '../types/wizard.types';

/**
 * Конвертує дані форми пошуку клієнта у формат для API
 */
export const formValuesToClientSearchRequest = (formValues: SearchClientFormValues): ClientSearchRequest => {
  return {
    // API очікує query, а не searchQuery
    searchText: formValues.searchQuery
  } as unknown as ClientSearchRequest; // Використовуємо типізацію для сумісності
};

/**
 * Конвертує відповідь пошуку клієнтів у масив ClientDTO
 */
export const pageResponseToClientDTOArray = (response: PageClientResponse): ClientDTO[] => {
  return response.content?.map(client => {
    // Конвертуємо ClientResponse у ClientDTO
    // Типи майже однакові, за винятком поля loyaltyLevel
    return {
      ...client,
      loyaltyLevel: typeof client.loyaltyLevel === 'number' ? client.loyaltyLevel : 0
    } as ClientDTO;
  }) || [];
};

/**
 * Конвертує дані форми створення клієнта у формат для API
 */
export const formValuesToApiClient = (formValues: CreateClientFormValues): ClientCreateRequest => {
  // Використовуємо окремі поля для імені та прізвища
  const firstName = formValues.firstName.trim();
  const lastName = formValues.lastName.trim();
  
  // Визначаємо джерело інформації відповідно до enum
  let sourceValue: ClientCreateRequest.source | undefined;
  switch(formValues.informationSource) {
    case 'instagram':
      sourceValue = ClientCreateRequest.source.INSTAGRAM;
      break;
    case 'google':
      sourceValue = ClientCreateRequest.source.GOOGLE;
      break;
    case 'recommendation':
      sourceValue = ClientCreateRequest.source.REFERRAL;
      break;
    case 'other':
      sourceValue = ClientCreateRequest.source.OTHER;
      break;
    default:
      sourceValue = undefined;
  }

  // Формуємо масив каналів комунікації
  const communicationChannels: Array<'PHONE' | 'SMS' | 'VIBER'> = [];
  if (formValues.contactMethods?.phone) communicationChannels.push('PHONE');
  if (formValues.contactMethods?.sms) communicationChannels.push('SMS');
  if (formValues.contactMethods?.viber) communicationChannels.push('VIBER');

  // Повертаємо об'єкт, який відповідає інтерфейсу ClientCreateRequest
  return {
    firstName,
    lastName,
    phone: formValues.phone,
    email: formValues.email || '',
    address: formValues.address || '',
    communicationChannels: communicationChannels.length > 0 ? communicationChannels : undefined,
    // Джерело інформації
    source: sourceValue,
    // Якщо форма містить додаткову інформацію про джерело, додаємо її до поля sourceDetails
    sourceDetails: formValues.informationSource === 'other' 
      ? formValues.otherSourceInfo || ''
      : ''
  };
};

/**
 * Конвертує дані форми створення клієнта у запит на створення клієнта
 */
export const formValuesToClientCreateRequest = (formValues: CreateClientFormValues): ClientCreateRequest => {
  return formValuesToApiClient(formValues);
};

/**
 * Конвертує ClientResponse у ClientDTO
 */
export const clientResponseToDTO = (clientResponse: ClientResponse): ClientDTO => {
  return {
    ...clientResponse,
    loyaltyLevel: typeof clientResponse.loyaltyLevel === 'number' ? clientResponse.loyaltyLevel : 0
  } as ClientDTO;
};

/**
 * Конвертує дані з API у формат для форми
 */
export const apiClientToFormValues = (clientDto: ClientDTO): CreateClientFormValues => {
  // Для методів контакту встановлюємо за замовчуванням телефон
  const contactMethods = {
    phone: true, // За замовчуванням телефон включений
    sms: false,
    viber: false,
  };

  // Визначаємо джерело інформації
  let informationSource: 'instagram' | 'google' | 'recommendation' | 'other' | undefined;
  
  // Проста конвертація строкових значень джерела
  if (clientDto.source === 'INSTAGRAM') {
    informationSource = 'instagram';
  } else if (clientDto.source === 'GOOGLE') {
    informationSource = 'google';
  } else if (clientDto.source === 'REFERRAL') {
    informationSource = 'recommendation';
  } else if (clientDto.source === 'OTHER') {
    informationSource = 'other';
  } else {
    informationSource = undefined;
  }
  
  // Нотатки використовуємо як otherSourceInfo якщо джерело 'інше'
  const otherSourceInfo = informationSource === 'other' ? clientDto.notes || '' : '';

  return {
    firstName: clientDto.firstName || '',
    lastName: clientDto.lastName || '',
    phone: clientDto.phone || '',
    email: clientDto.email || '',
    address: clientDto.address || '',
    contactMethods,
    informationSource,
    otherSourceInfo,
  };
};

/**
 * Конвертує ClientDTO у об'єкт для відображення в UI
 */
/**
 * Конвертує ClientDTO в ClientUI - інтерфейс для відображення у UI
 */
export const clientDtoToUI = (clientDto: ClientDTO): ClientUI => {
  // Формуємо повне ім'я з наявних полів
  const fullName = 
    clientDto.firstName && clientDto.lastName
      ? `${clientDto.lastName} ${clientDto.firstName}`.trim()
      : ''; // Якщо ім'я або прізвище відсутнє, повертаємо порожній рядок
  
  // Перетворюємо id у рядок, оскільки в UI він має бути string
  const clientId = clientDto.id ? String(clientDto.id) : '';
  
  return {
    id: clientId,
    fullName,
    firstName: clientDto.firstName || '',
    lastName: clientDto.lastName || '',
    phone: clientDto.phone || '',
    email: clientDto.email,
    address: clientDto.address,
    loyaltyLevel: clientDto.loyaltyLevel,
    // Додаємо властивість, яка вимагається у wizard.types.ts
    isSelected: false
  };
};

/**
 * Конвертує відповідь на створення клієнта в ClientDTO
 */
export const clientResponseToClientDTO = (response: ClientResponse): ClientDTO => {
  // Створюємо об'єкт тільки з тими полями, які є в ClientDTO
  return {
    id: response.id,
    firstName: response.firstName || '',
    lastName: response.lastName || '',
    phone: response.phone || '',
    email: response.email,
    address: response.address,
    notes: response.notes,
    source: response.source, // Це буде строкове значення enum
    loyaltyLevel: typeof response.loyaltyLevel === 'string' 
      ? convertLoyaltyLevelToNumber(response.loyaltyLevel) 
      : undefined,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    fullName: response.fullName,
    // Додаткові поля, які можуть бути в ClientDTO
    loyaltyPoints: response.loyaltyPoints,
    orderCount: response.orderCount,
    totalSpent: response.totalSpent,
    birthDate: response.birthDate,
    lastOrderDate: response.lastOrderDate,
  };
};

// Допоміжна функція для конвертації рівня лояльності з енумерації в число
function convertLoyaltyLevelToNumber(level: ClientResponse.loyaltyLevel): number {
  switch(level) {
    case ClientResponse.loyaltyLevel.STANDARD:
      return 0;
    case ClientResponse.loyaltyLevel.BRONZE:
      return 1;
    case ClientResponse.loyaltyLevel.SILVER:
      return 2;
    case ClientResponse.loyaltyLevel.GOLD:
      return 3;
    case ClientResponse.loyaltyLevel.PLATINUM:
      return 4;
    default:
      return 0; // За замовчуванням STANDARD
  }
}

/**
 * Перетворює пошуковий запит на параметри API
 */
export const searchFormToClientSearchRequest = (formData: SearchClientFormValues): ClientSearchRequest => {
  return {
    search: formData.searchQuery,  // для API це поле називається search, а не searchQuery
    page: 0,      // за замовчуванням перша сторінка результатів
    size: 20      // розмір сторінки
  };
};

/**
 * Перетворює масив клієнтів з API у масив UI-представлень
 */
export const clientDtosToUIs = (clients: ClientDTO[]): ClientUI[] => {
  return clients.map(client => clientDtoToUI(client));
};
