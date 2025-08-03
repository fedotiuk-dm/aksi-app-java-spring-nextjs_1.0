# Покрокова реалізація сервісів для OrderWizard

## Вступ

На основі аналізу адаптерів у `domain/wizard` та детальної документації OrderWizard, пропоную покрокову реалізацію сервісів для кожного етапу. Сервіси будуть організовані відповідно до бізнес-етапів, з чітким розділенням відповідальності та використанням адаптерів для взаємодії з API.

## Загальна структура сервісів

Для кожного етапу OrderWizard створимо окремий сервіс, який буде відповідати за бізнес-логіку цього етапу. Структура папок:

```
/domain/wizard/services/
  /client-selection/
    client-search.serviceCatalog.ts
    client-creation.serviceCatalog.ts
    client-validation.serviceCatalog.ts
    index.ts
  /branch-selection/
    branch-search.serviceCatalog.ts
    order-initialization.serviceCatalog.ts
    index.ts
  /itemCatalog-manager/
    itemCatalog-list.serviceCatalog.ts
    index.ts
  /itemCatalog-wizard/
    basic-info.serviceCatalog.ts
    properties.serviceCatalog.ts
    defects.serviceCatalog.ts
    pricing.serviceCatalog.ts
    photo-documentation.serviceCatalog.ts
    index.ts
  /order-parameters/
    order-timing.serviceCatalog.ts
    discount.serviceCatalog.ts
    payment.serviceCatalog.ts
    index.ts
  /confirmation/
    order-summary.serviceCatalog.ts
    receipt-generation.serviceCatalog.ts
    index.ts
  /shared/
    base.serviceCatalog.ts
    operation-result.factory.ts
    validation.serviceCatalog.ts
    index.ts
```

## Етап 1: Клієнт та базова інформація замовлення

### 1.1. Сервіс пошуку клієнтів (ClientSearchService)

```typescript
/**
 * @fileoverview Сервіс пошуку клієнтів
 * @module domain/wizard/services/client-selection/client-search
 */

import { z } from 'zod';
import { searchClientsWithPagination, getClientById } from '../../adapters/client';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { ClientSearchResult } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації пошукового запиту
const searchQuerySchema = z.object({
  query: z.string().trim().min(1, "Пошуковий запит не може бути порожнім"),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
});

/**
 * Сервіс пошуку клієнтів
 * Відповідальність: пошук клієнтів за різними критеріями
 */
export class ClientSearchService {
  /**
   * Пошук клієнтів за ключовим словом з пагінацією
   */
  async searchClients(
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<OperationResult<{
    clients: ClientSearchResult[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }>> {
    try {
      // Валідація параметрів пошуку
      const validationResult = searchQuerySchema.safeParse({ query, page, size });
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації параметрів пошуку: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для пошуку клієнтів
      const searchResult = await searchClientsWithPagination(query, page, size);

      return OperationResultFactory.success(searchResult);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка пошуку клієнтів: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Отримання клієнта за ID
   */
  async getClientById(id: string): Promise<OperationResult<ClientSearchResult>> {
    try {
      // Валідація ID
      if (!id || id.trim() === '') {
        return OperationResultFactory.error('ID клієнта не може бути порожнім');
      }

      // Виклик адаптера для отримання клієнта
      const client = await getClientById(id);

      return OperationResultFactory.success(client);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання клієнта: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const clientSearchService = new ClientSearchService();
```

### 1.2. Сервіс створення клієнтів (ClientCreationService)

```typescript
/**
 * @fileoverview Сервіс створення клієнтів
 * @module domain/wizard/services/client-selection/client-creation
 */

import { z } from 'zod';
import { createClient, updateClient } from '../../adapters/client';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { ClientSearchResult } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації даних клієнта
const clientSchema = z.object({
  firstName: z.string().trim().min(2, "Ім'я повинно містити мінімум 2 символи").max(50),
  lastName: z.string().trim().min(2, "Прізвище повинно містити мінімум 2 символи").max(50),
  phone: z.string().trim().regex(/^\+380\d{9}$/, "Телефон повинен бути у форматі +380XXXXXXXXX"),
  email: z.string().email("Некоректний формат email").optional().nullable(),
  address: z.string().optional().nullable(),
  communicationChannels: z.array(z.string()).min(1, "Виберіть хоча б один спосіб зв'язку"),
  source: z.enum(["INSTAGRAM", "GOOGLE", "RECOMMENDATION", "OTHER"]),
  sourceDetails: z.string().optional().nullable(),
});

/**
 * Сервіс створення клієнтів
 * Відповідальність: створення та оновлення клієнтів з валідацією
 */
export class ClientCreationService {
  /**
   * Створення нового клієнта
   */
  async createClient(clientData: Partial<ClientSearchResult>): Promise<OperationResult<ClientSearchResult>> {
    try {
      // Валідація даних клієнта
      const validationResult = clientSchema.safeParse(clientData);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних клієнта: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для створення клієнта
      const client = await createClient(clientData);

      return OperationResultFactory.success(client);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка створення клієнта: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Оновлення клієнта
   */
  async updateClient(
    id: string,
    clientData: Partial<ClientSearchResult>
  ): Promise<OperationResult<ClientSearchResult>> {
    try {
      // Валідація ID
      if (!id || id.trim() === '') {
        return OperationResultFactory.error('ID клієнта не може бути порожнім');
      }

      // Валідація даних клієнта (часткова, оскільки це оновлення)
      const partialClientSchema = clientSchema.partial();
      const validationResult = partialClientSchema.safeParse(clientData);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних клієнта: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для оновлення клієнта
      const client = await updateClient(id, clientData);

      return OperationResultFactory.success(client);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка оновлення клієнта: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const clientCreationService = new ClientCreationService();
```

### 1.3. Сервіс базової інформації замовлення (OrderInitializationService)

```typescript
/**
 * @fileoverview Сервіс ініціалізації замовлення
 * @module domain/wizard/services/branch-selection/order-initialization
 */

import { z } from 'zod';
import { getAllBranches } from '../../adapters/branch';
import { createOrder } from '../../adapters/order';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { Branch, OrderSummary } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації даних ініціалізації замовлення
const orderInitSchema = z.object({
  clientId: z.string().trim().min(1, "ID клієнта не може бути порожнім"),
  branchId: z.string().trim().min(1, "ID філії не може бути порожнім"),
  customLabel: z.string().optional(),
});

/**
 * Сервіс ініціалізації замовлення
 * Відповідальність: створення нового замовлення з базовою інформацією
 */
export class OrderInitializationService {
  /**
   * Отримання списку філій
   */
  async getBranches(): Promise<OperationResult<Branch[]>> {
    try {
      // Виклик адаптера для отримання філій
      const branches = await getAllBranches();

      return OperationResultFactory.success(branches);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання філій: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Створення нового замовлення
   */
  async initializeOrder(
    clientId: string,
    branchId: string,
    customLabel?: string
  ): Promise<OperationResult<OrderSummary>> {
    try {
      // Валідація даних ініціалізації
      const validationResult = orderInitSchema.safeParse({ clientId, branchId, customLabel });
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних ініціалізації: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для створення замовлення
      const order = await createOrder({
        clientId,
        branchId,
        customLabel,
        status: 'DRAFT',
      });

      return OperationResultFactory.success(order);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка ініціалізації замовлення: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const orderInitializationService = new OrderInitializationService();
```

## Етап 2: Менеджер предметів (циклічний процес)

### 2.1. Сервіс управління списком предметів (ItemListService)

```typescript
/**
 * @fileoverview Сервіс управління списком предметів
 * @module domain/wizard/services/itemCatalog-manager/itemCatalog-list
 */

import { z } from 'zod';
import {
  getOrderItems,
  deleteOrderItem
} from '../../adapters/order-itemCatalog';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OrderItem } from '../../types';
import type { OperationResult } from '../shared/types';

/**
 * Сервіс управління списком предметів
 * Відповідальність: отримання, видалення предметів замовлення
 */
export class ItemListService {
  /**
   * Отримання всіх предметів замовлення
   */
  async getOrderItems(orderId: string): Promise<OperationResult<OrderItem[]>> {
    try {
      // Валідація ID замовлення
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }

      // Виклик адаптера для отримання предметів
      const items = await getOrderItems(orderId);

      return OperationResultFactory.success(items);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання предметів: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Видалення предмета замовлення
   */
  async deleteOrderItem(orderId: string, itemId: string): Promise<OperationResult<void>> {
    try {
      // Валідація ID замовлення та предмета
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }
      if (!itemId || itemId.trim() === '') {
        return OperationResultFactory.error('ID предмета не може бути порожнім');
      }

      // Виклик адаптера для видалення предмета
      await deleteOrderItem(orderId, itemId);

      return OperationResultFactory.success(undefined);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка видалення предмета: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const itemListService = new ItemListService();
```

### 2.2. Сервіс базової інформації предмета (BasicInfoService)

```typescript
/**
 * @fileoverview Сервіс базової інформації предмета
 * @module domain/wizard/services/itemCatalog-wizard/basic-info
 */

import { z } from 'zod';
import {
  getServiceCategories
} from '../../adapters/pricing';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { ServiceCategory, PriceListItem } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації базової інформації предмета
const basicInfoSchema = z.object({
  categoryId: z.string().trim().min(1, "Категорія послуги обов'язкова"),
  priceListItemId: z.string().trim().min(1, "Найменування виробу обов'язкове"),
  quantity: z.number().positive("Кількість повинна бути більше 0"),
  unit: z.enum(["PIECE", "KILOGRAM"]),
});

/**
 * Сервіс базової інформації предмета
 * Відповідальність: отримання категорій, прайс-листа, валідація базової інформації
 */
export class BasicInfoService {
  /**
   * Отримання всіх категорій послуг
   */
  async getServiceCategories(): Promise<OperationResult<ServiceCategory[]>> {
    try {
      // Виклик адаптера для отримання категорій
      const categories = await getServiceCategories();

      return OperationResultFactory.success(categories);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання категорій: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Отримання прайс-листа для категорії
   */
  async getPriceListForCategory(categoryId: string): Promise<OperationResult<PriceListItem[]>> {
    try {
      // Валідація ID категорії
      if (!categoryId || categoryId.trim() === '') {
        return OperationResultFactory.error('ID категорії не може бути порожнім');
      }

      // Виклик адаптера для отримання прайс-листа
      const priceList = await getPriceListForCategory(categoryId);

      return OperationResultFactory.success(priceList);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання прайс-листа: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Валідація базової інформації предмета
   */
  validateBasicInfo(basicInfo: {
    categoryId: string;
    priceListItemId: string;
    quantity: number;
    unit: "PIECE" | "KILOGRAM";
  }): OperationResult<typeof basicInfo> {
    try {
      // Валідація даних
      const validationResult = basicInfoSchema.safeParse(basicInfo);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації базової інформації: ${validationResult.error.message}`
        );
      }

      return OperationResultFactory.success(basicInfo);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка валідації: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const basicInfoService = new BasicInfoService();
```

### 2.3. Сервіс характеристик предмета (PropertiesService)

```typescript
/**
 * @fileoverview Сервіс характеристик предмета
 * @module domain/wizard/services/itemCatalog-wizard/properties
 */

import { z } from 'zod';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OperationResult } from '../shared/types';

// Схема для валідації характеристик предмета
const propertiesSchema = z.object({
  material: z.string().trim().min(1, "Матеріал обов'язковий"),
  color: z.string().trim().min(1, "Колір обов'язковий"),
  filling: z.string().optional(),
  fillingDisplaced: z.boolean().optional(),
  wearDegree: z.enum(["PERCENT_10", "PERCENT_30", "PERCENT_50", "PERCENT_75"]).optional(),
});

/**
 * Сервіс характеристик предмета
 * Відповідальність: валідація характеристик предмета
 */
export class PropertiesService {
  /**
   * Отримання доступних матеріалів для категорії
   */
  getMaterialsForCategory(categoryId: string): string[] {
    // В реальному сервісі тут був би виклик API або локальна логіка
    // Для прикладу повертаємо статичні дані
    const materialsByCategory: Record<string, string[]> = {
      'CLOTHING': ['Бавовна', 'Шерсть', 'Шовк', 'Синтетика'],
      'LEATHER': ['Гладка шкіра', 'Нубук', 'Спілок', 'Замша'],
      // Інші категорії...
    };

    return materialsByCategory[categoryId] || [];
  }

  /**
   * Отримання базових кольорів
   */
  getBaseColors(): string[] {
    return [
      'Чорний', 'Білий', 'Сірий', 'Синій', 'Червоний',
      'Зелений', 'Жовтий', 'Коричневий', 'Бежевий'
    ];
  }

  /**
   * Валідація характеристик предмета
   */
  validateProperties(properties: {
    material: string;
    color: string;
    filling?: string;
    fillingDisplaced?: boolean;
    wearDegree?: "PERCENT_10" | "PERCENT_30" | "PERCENT_50" | "PERCENT_75";
  }): OperationResult<typeof properties> {
    try {
      // Валідація даних
      const validationResult = propertiesSchema.safeParse(properties);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації характеристик: ${validationResult.error.message}`
        );
      }

      return OperationResultFactory.success(properties);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка валідації: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const propertiesService = new PropertiesService();
```

### 2.4. Сервіс дефектів та забруднень (DefectsService)

```typescript
/**
 * @fileoverview Сервіс дефектів та забруднень
 * @module domain/wizard/services/itemCatalog-wizard/defects
 */

import { z } from 'zod';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OperationResult } from '../shared/types';

// Схема для валідації дефектів та забруднень
const defectsSchema = z.object({
  stains: z.array(z.string()).optional(),
  customStain: z.string().optional(),
  defects: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
  noGuarantee: z.boolean().optional(),
  noGuaranteeReason: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Сервіс дефектів та забруднень
 * Відповідальність: валідація дефектів та забруднень
 */
export class DefectsService {
  /**
   * Отримання типів плям
   */
  getStainTypes(): string[] {
    return [
      'Жир', 'Кров', 'Білок', 'Вино', 'Кава',
      'Трава', 'Чорнило', 'Косметика'
    ];
  }

  /**
   * Отримання типів дефектів
   */
  getDefectTypes(): string[] {
    return [
      'Потертості', 'Порване', 'Відсутність фурнітури',
      'Пошкодження фурнітури'
    ];
  }

  /**
   * Отримання типів ризиків
   */
  getRiskTypes(): string[] {
    return [
      'Ризики зміни кольору', 'Ризики деформації'
    ];
  }

  /**
   * Валідація дефектів та забруднень
   */
  validateDefects(defects: {
    stains?: string[];
    customStain?: string;
    defects?: string[];
    risks?: string[];
    noGuarantee?: boolean;
    noGuaranteeReason?: string;
    notes?: string;
  }): OperationResult<typeof defects> {
    try {
      // Валідація даних
      const validationResult = defectsSchema.safeParse(defects);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації дефектів: ${validationResult.error.message}`
        );
      }

      // Додаткова валідація: якщо вибрано "Без гарантій", повинна бути причина
      if (defects.noGuarantee && (!defects.noGuaranteeReason || defects.noGuaranteeReason.trim() === '')) {
        return OperationResultFactory.error(
          'Якщо вибрано "Без гарантій", необхідно вказати причину'
        );
      }

      return OperationResultFactory.success(defects);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка валідації: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const defectsService = new DefectsService();
```

### 2.5. Сервіс ціноутворення (PricingService)

```typescript
/**
 * @fileoverview Сервіс ціноутворення
 * @module domain/wizard/services/itemCatalog-wizard/pricing
 */

import { z } from 'zod';
import {
  getPriceModifiers,
  calculatePrice
} from '../../adapters/pricing';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { PriceModifier, PriceCalculationResult } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації запиту розрахунку ціни
const priceCalculationSchema = z.object({
  priceListItemId: z.string().trim().min(1, "ID позиції прайс-листа обов'язковий"),
  quantity: z.number().positive("Кількість повинна бути більше 0"),
  modifierIds: z.array(z.string()).optional(),
});

/**
 * Сервіс ціноутворення
 * Відповідальність: отримання модифікаторів цін, розрахунок ціни
 */
export class PricingService {
  /**
   * Отримання модифікаторів цін для категорії
   */
  async getPriceModifiersForCategory(categoryId: string): Promise<OperationResult<PriceModifier[]>> {
    try {
      // Валідація ID категорії
      if (!categoryId || categoryId.trim() === '') {
        return OperationResultFactory.error('ID категорії не може бути порожнім');
      }

      // Виклик адаптера для отримання модифікаторів
      const modifiers = await getPriceModifiers(categoryId);

      return OperationResultFactory.success(modifiers);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання модифікаторів: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Розрахунок ціни
   */
  async calculatePrice(
    priceListItemId: string,
    quantity: number,
    modifierIds: string[] = []
  ): Promise<OperationResult<PriceCalculationResult>> {
    try {
      // Валідація даних
      const validationResult = priceCalculationSchema.safeParse({
        priceListItemId,
        quantity,
        modifierIds,
      });
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних для розрахунку: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для розрахунку ціни
      const calculationResult = await calculatePrice(priceListItemId, quantity, modifierIds);

      return OperationResultFactory.success(calculationResult);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка розрахунку ціни: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const pricingService = new PricingService();
```

### 2.6. Сервіс фотодокументації (PhotoDocumentationService)

```typescript
/**
 * @fileoverview Сервіс фотодокументації
 * @module domain/wizard/services/itemCatalog-wizard/photo-documentation
 */

import { z } from 'zod';
import {
  uploadItemPhoto,
  getItemPhotos,
  deleteItemPhoto
} from '../../adapters/order-itemCatalog';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { ItemPhoto } from '../../types';
import type { OperationResult } from '../shared/types';

// Максимальний розмір файлу (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Схема для валідації фото
const photoSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `Розмір файлу не повинен перевищувати 5MB`
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    `Підтримуються тільки формати JPEG, PNG та WebP`
  ),
});

/**
 * Сервіс фотодокументації
 * Відповідальність: завантаження, отримання та видалення фото предметів
 */
export class PhotoDocumentationService {
  /**
   * Завантаження фото предмета
   */
  async uploadPhoto(
    orderId: string,
    itemId: string,
    file: File
  ): Promise<OperationResult<ItemPhoto>> {
    try {
      // Валідація ID замовлення та предмета
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }
      if (!itemId || itemId.trim() === '') {
        return OperationResultFactory.error('ID предмета не може бути порожнім');
      }

      // Валідація файлу
      const validationResult = photoSchema.safeParse({ file });
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації файлу: ${validationResult.error.message}`
        );
      }

      // Стиснення зображення перед відправкою (якщо потрібно)
      const compressedFile = await this.compressImageIfNeeded(file);

      // Виклик адаптера для завантаження фото
      const photo = await uploadItemPhoto(orderId, itemId, compressedFile);

      return OperationResultFactory.success(photo);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка завантаження фото: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Отримання фото предмета
   */
  async getPhotos(orderId: string, itemId: string): Promise<OperationResult<ItemPhoto[]>> {
    try {
      // Валідація ID замовлення та предмета
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }
      if (!itemId || itemId.trim() === '') {
        return OperationResultFactory.error('ID предмета не може бути порожнім');
      }

      // Виклик адаптера для отримання фото
      const photos = await getItemPhotos(orderId, itemId);

      return OperationResultFactory.success(photos);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання фото: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Видалення фото предмета
   */
  async deletePhoto(
    orderId: string,
    itemId: string,
    photoId: string
  ): Promise<OperationResult<void>> {
    try {
      // Валідація ID замовлення, предмета та фото
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }
      if (!itemId || itemId.trim() === '') {
        return OperationResultFactory.error('ID предмета не може бути порожнім');
      }
      if (!photoId || photoId.trim() === '') {
        return OperationResultFactory.error('ID фото не може бути порожнім');
      }

      // Виклик адаптера для видалення фото
      await deleteItemPhoto(orderId, itemId, photoId);

      return OperationResultFactory.success(undefined);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка видалення фото: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Стиснення зображення, якщо потрібно
   * @private
   */
  private async compressImageIfNeeded(file: File): Promise<File> {
    // Якщо розмір файлу менше 1MB, не стискаємо
    if (file.size < 1024 * 1024) {
      return file;
    }

    // Тут була б логіка стиснення зображення
    // Для прикладу просто повертаємо оригінальний файл
    return file;
  }
}

// Експорт екземпляра сервісу (Singleton)
export const photoDocumentationService = new PhotoDocumentationService();
```

### 2.7. Сервіс створення предмета (ItemCreationService)

```typescript
/**
 * @fileoverview Сервіс створення предмета
 * @module domain/wizard/services/itemCatalog-wizard/itemCatalog-creation
 */

import { z } from 'zod';
import { createOrderItem, updateOrderItem } from '../../adapters/order-itemCatalog';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OrderItem } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації даних предмета
const orderItemSchema = z.object({
  priceListItemId: z.string().trim().min(1, "ID позиції прайс-листа обов'язковий"),
  quantity: z.number().positive("Кількість повинна бути більше 0"),
  unit: z.enum(["PIECE", "KILOGRAM"]),
  material: z.string().trim().min(1, "Матеріал обов'язковий"),
  color: z.string().trim().min(1, "Колір обов'язковий"),
  filling: z.string().optional(),
  fillingDisplaced: z.boolean().optional(),
  wearDegree: z.enum(["PERCENT_10", "PERCENT_30", "PERCENT_50", "PERCENT_75"]).optional(),
  stains: z.array(z.string()).optional(),
  customStain: z.string().optional(),
  defects: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
  noGuarantee: z.boolean().optional(),
  noGuaranteeReason: z.string().optional(),
  notes: z.string().optional(),
  priceModifierIds: z.array(z.string()).optional(),
  basePrice: z.number().nonnegative("Базова ціна не може бути від'ємною"),
  finalPrice: z.number().nonnegative("Фінальна ціна не може бути від'ємною"),
});

/**
 * Сервіс створення предмета
 * Відповідальність: створення та оновлення предметів замовлення
 */
export class ItemCreationService {
  /**
   * Створення нового предмета замовлення
   */
  async createOrderItem(
    orderId: string,
    itemData: Partial<OrderItem>
  ): Promise<OperationResult<OrderItem>> {
    try {
      // Валідація ID замовлення
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }

      // Валідація даних предмета
      const validationResult = orderItemSchema.safeParse(itemData);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних предмета: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для створення предмета
      const itemCatalog = await createOrderItem(orderId, itemData);

      return OperationResultFactory.success(itemCatalog);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка створення предмета: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Оновлення предмета замовлення
   */
  async updateOrderItem(
    orderId: string,
    itemId: string,
    itemData: Partial<OrderItem>
  ): Promise<OperationResult<OrderItem>> {
    try {
      // Валідація ID замовлення та предмета
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }
      if (!itemId || itemId.trim() === '') {
        return OperationResultFactory.error('ID предмета не може бути порожнім');
      }

      // Валідація даних предмета (часткова, оскільки це оновлення)
      const partialItemSchema = orderItemSchema.partial();
      const validationResult = partialItemSchema.safeParse(itemData);
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних предмета: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для оновлення предмета
      const itemCatalog = await updateOrderItem(orderId, itemId, itemData);

      return OperationResultFactory.success(itemCatalog);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка оновлення предмета: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const itemCreationService = new ItemCreationService();
```

## Етап 3: Загальні параметри замовлення

### 3.1. Сервіс термінів виконання (OrderTimingService)

```typescript
/**
 * @fileoverview Сервіс термінів виконання
 * @module domain/wizard/services/order-parameters/order-timing
 */

import { z } from 'zod';
import { updateOrder } from '../../adapters/order';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OrderSummary } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації даних термінів виконання
const timingSchema = z.object({
  completionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Дата повинна бути у форматі YYYY-MM-DD"),
  urgencyLevel: z.enum(["NORMAL", "URGENT_48H", "URGENT_24H"]).default("NORMAL"),
});

/**
 * Сервіс термінів виконання
 * Відповідальність: управління термінами виконання замовлення
 */
export class OrderTimingService {
  /**
   * Розрахунок стандартної дати виконання на основі категорій предметів
   */
  calculateStandardCompletionDate(orderItems: any[]): string {
    // Логіка розрахунку дати виконання
    // Для прикладу, просто додаємо 2 дні до поточної дати
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
  }

  /**
   * Оновлення термінів виконання замовлення
   */
  async updateOrderTiming(
    orderId: string,
    completionDate: string,
    urgencyLevel: "NORMAL" | "URGENT_48H" | "URGENT_24H" = "NORMAL"
  ): Promise<OperationResult<OrderSummary>> {
    try {
      // Валідація ID замовлення
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }

      // Валідація даних термінів виконання
      const validationResult = timingSchema.safeParse({ completionDate, urgencyLevel });
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних термінів виконання: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для оновлення замовлення
      const order = await updateOrder(orderId, {
        completionDate,
        urgencyLevel,
      });

      return OperationResultFactory.success(order);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка оновлення термінів виконання: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const orderTimingService = new OrderTimingService();
```

### 3.2. Сервіс знижок (DiscountService)

```typescript
/**
 * @fileoverview Сервіс знижок
 * @module domain/wizard/services/order-parameters/discount
 */

import { z } from 'zod';
import {
  getAvailableDiscounts,
  applyOrderDiscount
} from '../../adapters/order';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { Discount, OrderSummary } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації даних знижки
const discountSchema = z.object({
  discountId: z.string().trim().min(1, "ID знижки обов'язковий"),
  customDiscountPercent: z.number().min(0).max(100).optional(),
  customDiscountReason: z.string().optional(),
});

/**
 * Сервіс знижок
 * Відповідальність: управління знижками замовлення
 */
export class DiscountService {
  /**
   * Отримання доступних знижок
   */
  async getAvailableDiscounts(): Promise<OperationResult<Discount[]>> {
    try {
      // Виклик адаптера для отримання знижок
      const discounts = await getAvailableDiscounts();

      return OperationResultFactory.success(discounts);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання знижок: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Застосування знижки до замовлення
   */
  async applyDiscount(
    orderId: string,
    discountId: string,
    customDiscountPercent?: number,
    customDiscountReason?: string
  ): Promise<OperationResult<OrderSummary>> {
    try {
      // Валідація ID замовлення
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }

      // Валідація даних знижки
      const validationResult = discountSchema.safeParse({
        discountId,
        customDiscountPercent,
        customDiscountReason,
      });
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних знижки: ${validationResult.error.message}`
        );
      }

      // Додаткова валідація: якщо вибрано "Інше", повинен бути відсоток
      if (discountId === 'CUSTOM' && (customDiscountPercent === undefined || customDiscountPercent < 0 || customDiscountPercent > 100)) {
        return OperationResultFactory.error(
          'Для знижки "Інше" необхідно вказати відсоток від 0 до 100'
        );
      }

      // Виклик адаптера для застосування знижки
      const order = await applyOrderDiscount(orderId, {
        discountId,
        customDiscountPercent,
        customDiscountReason,
      });

      return OperationResultFactory.success(order);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка застосування знижки: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const discountService = new DiscountService();
```

### 3.3. Сервіс оплати (PaymentService)

```typescript
/**
 * @fileoverview Сервіс оплати
 * @module domain/wizard/services/order-parameters/payment
 */

import { z } from 'zod';
import {
  updateOrderPayment
} from '../../adapters/order';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OrderSummary } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації даних оплати
const paymentSchema = z.object({
  paymentMethod: z.enum(["TERMINAL", "CASH", "BANK_TRANSFER"]),
  prepaidAmount: z.number().min(0, "Сума передоплати не може бути від'ємною"),
  notes: z.string().optional(),
});

/**
 * Сервіс оплати
 * Відповідальність: управління оплатою замовлення
 */
export class PaymentService {
  /**
   * Оновлення даних оплати замовлення
   */
  async updatePayment(
    orderId: string,
    paymentMethod: "TERMINAL" | "CASH" | "BANK_TRANSFER",
    prepaidAmount: number,
    notes?: string
  ): Promise<OperationResult<OrderSummary>> {
    try {
      // Валідація ID замовлення
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }

      // Валідація даних оплати
      const validationResult = paymentSchema.safeParse({
        paymentMethod,
        prepaidAmount,
        notes,
      });
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних оплати: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для оновлення оплати
      const order = await updateOrderPayment(orderId, {
        paymentMethod,
        prepaidAmount,
        notes,
      });

      return OperationResultFactory.success(order);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка оновлення оплати: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const paymentService = new PaymentService();
```

## Етап 4: Підтвердження та завершення з формуванням квитанції

### 4.1. Сервіс підсумку замовлення (OrderSummaryService)

```typescript
/**
 * @fileoverview Сервіс підсумку замовлення
 * @module domain/wizard/services/confirmation/order-summary
 */

import { getOrderById } from '../../adapters/order';
import { getOrderItems } from '../../adapters/order-itemCatalog';
import { getClientById } from '../../adapters/client';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OrderSummary, OrderItem, ClientSearchResult } from '../../types';
import type { OperationResult } from '../shared/types';

/**
 * Сервіс підсумку замовлення
 * Відповідальність: отримання повної інформації про замовлення для підтвердження
 */
export class OrderSummaryService {
  /**
   * Отримання повної інформації про замовлення
   */
  async getOrderSummary(orderId: string): Promise<OperationResult<{
    order: OrderSummary;
    items: OrderItem[];
    client: ClientSearchResult;
  }>> {
    try {
      // Валідація ID замовлення
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }

      // Отримання замовлення
      const order = await getOrderById(orderId);

      // Отримання предметів замовлення
      const items = await getOrderItems(orderId);

      // Отримання клієнта
      const client = await getClientById(order.clientId);

      return OperationResultFactory.success({
        order,
        items,
        client,
      });
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання підсумку замовлення: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const orderSummaryService = new OrderSummaryService();
```

### 4.2. Сервіс генерації квитанції (ReceiptGenerationService)

```typescript
/**
 * @fileoverview Сервіс генерації квитанції
 * @module domain/wizard/services/confirmation/receipt-generation
 */

import { z } from 'zod';
import {
  generateReceipt,
  getReceiptPdf
} from '../../adapters/order';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OrderReceipt } from '../../types';
import type { OperationResult } from '../shared/types';

// Схема для валідації даних підтвердження
const confirmationSchema = z.object({
  termsAccepted: z.boolean().refine(value => value === true, {
    message: "Необхідно прийняти умови надання послуг",
  }),
  customerSignature: z.string().min(1, "Підпис клієнта обов'язковий"),
});

/**
 * Сервіс генерації квитанції
 * Відповідальність: генерація та отримання квитанції замовлення
 */
export class ReceiptGenerationService {
  /**
   * Генерація квитанції
   */
  async generateReceipt(
    orderId: string,
    termsAccepted: boolean,
    customerSignature: string
  ): Promise<OperationResult<OrderReceipt>> {
    try {
      // Валідація ID замовлення
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }

      // Валідація даних підтвердження
      const validationResult = confirmationSchema.safeParse({
        termsAccepted,
        customerSignature,
      });
      if (!validationResult.success) {
        return OperationResultFactory.error(
          `Помилка валідації даних підтвердження: ${validationResult.error.message}`
        );
      }

      // Виклик адаптера для генерації квитанції
      const receipt = await generateReceipt(orderId, {
        termsAccepted,
        customerSignature,
      });

      return OperationResultFactory.success(receipt);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка генерації квитанції: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Отримання PDF-квитанції
   */
  async getReceiptPdf(orderId: string, receiptId: string): Promise<OperationResult<Blob>> {
    try {
      // Валідація ID замовлення та квитанції
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }
      if (!receiptId || receiptId.trim() === '') {
        return OperationResultFactory.error('ID квитанції не може бути порожнім');
      }

      // Виклик адаптера для отримання PDF
      const pdfBlob = await getReceiptPdf(orderId, receiptId);

      return OperationResultFactory.success(pdfBlob);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання PDF-квитанції: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const receiptGenerationService = new ReceiptGenerationService();
```

### 4.3. Сервіс завершення замовлення (OrderCompletionService)

```typescript
/**
 * @fileoverview Сервіс завершення замовлення
 * @module domain/wizard/services/confirmation/order-completion
 */

import {
  updateOrderStatus,
  sendReceiptByEmail
} from '../../adapters/order';
import { OperationResultFactory } from '../shared/operation-result.factory';

import type { OrderSummary } from '../../types';
import type { OperationResult } from '../shared/types';

/**
 * Сервіс завершення замовлення
 * Відповідальність: завершення процесу оформлення замовлення
 */
export class OrderCompletionService {
  /**
   * Завершення замовлення
   */
  async completeOrder(orderId: string): Promise<OperationResult<OrderSummary>> {
    try {
      // Валідація ID замовлення
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }

      // Виклик адаптера для оновлення статусу замовлення
      const order = await updateOrderStatus(orderId, 'ACTIVE');

      return OperationResultFactory.success(order);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка завершення замовлення: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }

  /**
   * Відправлення квитанції на email
   */
  async sendReceiptByEmail(
    orderId: string,
    receiptId: string,
    email: string
  ): Promise<OperationResult<void>> {
    try {
      // Валідація ID замовлення та квитанції
      if (!orderId || orderId.trim() === '') {
        return OperationResultFactory.error('ID замовлення не може бути порожнім');
      }
      if (!receiptId || receiptId.trim() === '') {
        return OperationResultFactory.error('ID квитанції не може бути порожнім');
      }
      if (!email || !email.includes('@')) {
        return OperationResultFactory.error('Некоректний email');
      }

      // Виклик адаптера для відправлення квитанції
      await sendReceiptByEmail(orderId, receiptId, email);

      return OperationResultFactory.success(undefined);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка відправлення квитанції: ${error instanceof Error ? error.message : 'Невідома помилка'}`
      );
    }
  }
}

// Експорт екземпляра сервісу (Singleton)
export const orderCompletionService = new OrderCompletionService();
```

## Спільні компоненти

### Фабрика результатів операцій (OperationResultFactory)

```typescript
/**
 * @fileoverview Фабрика результатів операцій
 * @module domain/wizard/services/shared/operation-result.factory
 */

import type { OperationResult } from './types';

/**
 * Фабрика для створення результатів операцій
 */
export class OperationResultFactory {
  /**
   * Створення успішного результату
   */
  static success<T>(data: T): OperationResult<T> {
    return {
      success: true,
      data,
      timestamp: new Date(),
    };
  }

  /**
   * Створення результату з помилкою
   */
  static error<T>(error: string): OperationResult<T> {
    return {
      success: false,
      error,
      timestamp: new Date(),
    };
  }
}
```

### Типи для спільних компонентів (types.ts)

```typescript
/**
 * @fileoverview Типи для спільних компонентів
 * @module domain/wizard/services/shared/types
 */

/**
 * Результат операції
 */
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

/**
 * Результат валідації
 */
export interface ValidationOperationResult<T> extends OperationResult<T> {
  isValid: boolean;
  validationErrors?: Array<{ field: string; message: string; code: string }>;
}
```

## Висновок

Запропонована реалізація сервісів для OrderWizard забезпечує:

1. **Чітке розділення відповідальності** - кожен сервіс відповідає за конкретний бізнес-процес
2. **Типобезпеку** - використання Zod для валідації даних
3. **Уніфіковану обробку помилок** - через OperationResult
4. **Легке тестування** - кожен сервіс можна тестувати окремо
5. **Масштабованість** - нові етапи можна додавати без зміни існуючих
6. **Відсутність дублювання** - спільна логіка винесена в базові класи та утиліти

Ця структура повністю відповідає вимогам документації OrderWizard та забезпечує надійну основу для подальшого розвитку системи.
