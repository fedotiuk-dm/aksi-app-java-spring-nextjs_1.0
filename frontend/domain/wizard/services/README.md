# Сервіси Wizard Домену

Цей модуль містить всі сервіси для wizard домену, організовані за принципами DDD (Domain-Driven Design) та SOLID.

## Архітектурні принципи

### DDD inside, FSD outside

- **Вся функціональна логіка в доменному шарі**: Сервіси містять бізнес-логіку, валідацію, інтеграцію з API
- **UI компоненти максимально "тонкі"**: Компоненти лише відображають дані та викликають методи сервісів
- **Строга типізація**: Всі сервіси працюють з доменними типами, не з API типами

### SOLID принципи

- **Single Responsibility**: Кожен сервіс має одну відповідальність (макс. 150 рядків)
- **Open/Closed**: Розширення функціоналу без модифікації існуючого коду
- **Liskov Substitution**: Правильне використання наслідування та поліморфізму
- **Interface Segregation**: Малі, специфічні інтерфейси
- **Dependency Inversion**: Залежність від абстракцій, а не конкретних реалізацій

## Структура сервісів

```
services/
├── interfaces/                 # Базові інтерфейси
│   ├── base.interfaces.ts      # BaseService, InitializableService
│   ├── operation-result.interfaces.ts  # OperationResult типи
│   ├── validation.interfaces.ts # Валідація
│   ├── persistence.interfaces.ts # Репозиторії та кеш
│   └── navigation.interfaces.ts # Навігація
│
├── client/                     # Клієнтські сервіси
│   ├── client-domain.types.ts  # Доменні типи клієнтів
│   ├── client.interfaces.ts    # Інтерфейси сервісів
│   ├── client.repository.ts    # Репозиторій (адаптер)
│   ├── client-search.service.ts # Пошук клієнтів
│   ├── client-creation.service.ts # Створення клієнтів
│   └── index.ts               # Експорт
│
├── pricing/                    # Сервіси ціноутворення
│   ├── pricing.interfaces.ts   # Інтерфейси ціноутворення
│   └── index.ts               # Експорт
│
└── index.ts                   # Головний експорт
```

## Правила роботи з сервісами

### 1. Сервіси НЕ імпортують з `lib/api`

```typescript
// ❌ НЕПРАВИЛЬНО
import { ClientsService } from '@/lib/api';

// ✅ ПРАВИЛЬНО
import { clientRepository } from './client.repository';
```

### 2. Сервіси працюють з доменними типами

```typescript
// ❌ НЕПРАВИЛЬНО - API тип
async createClient(request: CreateClientRequest): Promise<ClientResponse>

// ✅ ПРАВИЛЬНО - доменний тип
async createClient(request: CreateClientDomainRequest): Promise<OperationResult<ClientDomain>>
```

### 3. Всі операції повертають OperationResult

```typescript
// ✅ Успішний результат
return OperationResultFactory.success(data);

// ✅ Помилка
return OperationResultFactory.error('Опис помилки');
```

### 4. Репозиторії інкапсулюють адаптери

```typescript
export class ClientRepository {
  async searchClients(
    params: ClientSearchDomainParams
  ): Promise<OperationResult<ClientSearchDomainResult>> {
    try {
      // Викликаємо адаптер
      const result = await searchClientsWithPagination(query, page, size);

      // Конвертуємо в доменні типи
      const domainResult = {
        clients: result.clients.map(this.convertToDomainClient),
        total: result.totalElements,
        // ...
      };

      return OperationResultFactory.success(domainResult);
    } catch (error) {
      return OperationResultFactory.error(`Помилка: ${error.message}`);
    }
  }
}
```

## Реалізовані сервіси

### Клієнтські сервіси ✅

#### ClientRepository

- `searchClients()` - пошук з пагінацією
- `getById()` - отримання за ID
- `create()` - створення клієнта
- `update()` - оновлення клієнта

#### ClientSearchService

- `searchClients()` - пошук з пагінацією
- `searchByQuery()` - пошук за загальним запитом
- `searchByPhone()` - пошук за телефоном
- `searchByEmail()` - пошук за email
- `getRecentClients()` - останні клієнти

#### ClientCreationService

- `createClient()` - створення з валідацією
- `updateClient()` - оновлення з валідацією
- `validateClientData()` - валідація даних
- `checkClientExists()` - перевірка існування

### Сервіси ціноутворення ✅

#### PriceCalculationService

- `calculatePrice()` - розрахунок ціни з модифікаторами та знижками
- `validateCalculationRequest()` - валідація запиту розрахунку
- `recalculateWithModifiers()` - перерахунок з новими модифікаторами
- `applyDiscount()` - застосування знижки

#### PriceListService

- `getPriceListItems()` - отримання елементів прайс-листа
- `getPriceListItemById()` - отримання елемента за ID
- `searchPriceListItems()` - пошук в прайс-листі
- `getServiceCategories()` - отримання категорій послуг
- `getCategoryById()` - отримання категорії за ID
- `clearCache()` - очищення кешу

#### PriceModifierService

- `getAvailableModifiers()` - отримання доступних модифікаторів
- `getModifierById()` - отримання модифікатора за ID
- `validateModifierCombination()` - валідація комбінації модифікаторів
- `calculateModifierImpact()` - розрахунок впливу модифікаторів
- `clearCache()` - очищення кешу

#### PriceDiscountService

- `getAvailableDiscounts()` - отримання доступних знижок
- `validateDiscountEligibility()` - валідація права на знижку
- `calculateDiscountAmount()` - розрахунок суми знижки
- `calculateFinalPrice()` - розрахунок фінальної ціни з знижкою
- `isCategoryExcluded()` - перевірка виключених категорій
- `getDiscountInfo()` - отримання інформації про знижку

#### TODO: Реалізація сервісів

- [ ] PriceValidationService

### Сервіси замовлень ✅

#### OrderCreationService

- `createOrder()` - створення замовлення з валідацією та розрахунками
- `validateOrderRequest()` - валідація запиту створення замовлення
- `generateReceiptNumber()` - генерація номера квитанції
- `calculateOrderTotal()` - розрахунок загальної вартості замовлення

#### OrderStatsService ✅

- `getOrderStats()` - загальна статистика замовлень з фільтрацією за датами
- `getOrdersByStatus()` - статистика за статусами з кешуванням
- `getDailyStats()` - денна статистика з розрахунком середніх значень
- `getTopServices()` - топ послуг за кількістю та сумою
- `getPeriodStats()` - статистика за період з показниками ефективності
- `clearStatsCache()` - очищення кешу статистики
- `getCachedStats()` - отримання кешованих даних

#### TODO: Реалізація сервісів замовлень

- [ ] OrderValidationService

### Сервіси замовлень ✅

#### OrderCreationService

- `createOrder()` - створення замовлення з валідацією та розрахунками
- `validateOrderRequest()` - валідація запиту створення замовлення
- `generateReceiptNumber()` - генерація номера квитанції
- `calculateOrderTotal()` - розрахунок загальної вартості замовлення

#### OrderSearchService

- `searchOrders()` - пошук замовлень з фільтрами та пагінацією
- `getOrderById()` - отримання замовлення за ID
- `getOrderByReceiptNumber()` - отримання замовлення за номером квитанції
- `getOrdersByClient()` - отримання замовлень клієнта
- `getRecentOrders()` - отримання останніх замовлень
- `clearSearchCache()` - очищення кешу пошуку
- `getCachedSearchResult()` - отримання кешованих результатів

#### OrderManagementService

- `updateOrder()` - оновлення замовлення з валідацією
- `updateOrderStatus()` - оновлення статусу з перевіркою переходів
- `cancelOrder()` - скасування замовлення з причиною
- `completeOrder()` - завершення замовлення
- `addPayment()` - додавання платежу з валідацією
- `getAvailableStatusTransitions()` - отримання доступних переходів статусу
- `canCancelOrder()` - перевірка можливості скасування
- `canCompleteOrder()` - перевірка можливості завершення

#### TODO: Реалізація сервісів замовлень

- [ ] OrderStatsService
- [ ] OrderValidationService

### Сервіси філій ✅

#### BranchService

- `getAllBranches()` - отримання всіх філій
- `getActiveBranches()` - отримання активних філій
- `getBranchById()` - отримання філії за ID
- `searchBranches()` - пошук філій з фільтрами
- `getBranchAvailability()` - перевірка доступності філії
- `getBranchesWithService()` - отримання філій з певною послугою
- `calculateDistanceToBranches()` - розрахунок відстані до філій
- `getNearestBranch()` - отримання найближчої філії
- `clearCache()` - очищення кешу

### Сервіси предметів ✅

#### Доменні типи предметів

- **ItemDomain** - повна модель предмета з характеристиками, дефектами, фото
- **ItemCharacteristicsDomain** - характеристики (матеріал, колір, наповнювач, знос)
- **ItemDefectsAndRisksDomain** - плями, дефекти, ризики
- **ItemPhotoDomain** - фотодокументація з типами фото
- **MaterialType, FillerType, StainType, DefectType, RiskType** - детальна типізація

#### ItemCreationService ✅

- `createItem()` - створення предмета з валідацією та розрахунком ціни
- `updateItem()` - оновлення предмета з валідацією
- `validateItemRequest()` - комплексна валідація запиту створення
- `validateCharacteristics()` - валідація характеристик предмета
- `validateDefectsAndRisks()` - валідація дефектів та ризиків
- `calculateItemPrice()` - розрахунок ціни через pricing service

#### ItemManagementService ✅

- `searchItems()` - пошук предметів з фільтрами та пагінацією
- `getItemById()` - отримання предмета за ID з кешуванням
- `getItemsByOrder()` - отримання всіх предметів замовлення
- `updateItemStatus()` - оновлення статусу з валідацією переходів
- `deleteItem()` - видалення предмета з очищенням кешу
- `getItemStats()` - статистика предметів за замовленням
- `getAvailableStatusTransitions()` - доступні переходи статусу
- `canUpdateStatus()` - перевірка можливості зміни статусу
- `clearCache()` - управління кешем

#### ItemPhotoService ✅

- `uploadPhoto()` - завантаження одного фото з валідацією та стисненням
- `uploadMultiplePhotos()` - пакетне завантаження фото
- `getPhotosByItem()` - отримання всіх фото предмета
- `getPhotoById()` - отримання фото за ID
- `deletePhoto()` - видалення фото
- `updatePhotoDescription()` - оновлення опису фото
- `validatePhotoRequest()` - валідація запиту фото
- `compressPhoto()` - стиснення зображення
- `generateThumbnail()` - генерація мініатюр

#### TODO: Реалізація сервісів предметів

- [ ] ItemTemplateService - шаблони для швидкого створення

## Використання в UI

### Імпорт сервісів

```typescript
// В хуках домену
import { clientSearchService, clientCreationService } from '@/domains/wizard/services';

export const useClientSearch = () => {
  const searchClients = async (query: string) => {
    const result = await clientSearchService.searchByQuery(query);
    if (result.success) {
      return result.data;
    }
    throw new Error(result.error);
  };

  return { searchClients };
};
```

### В UI компонентах

```typescript
// В компонентах
import { useClientSearch } from '@/domains/wizard';

export const ClientSearchComponent = () => {
  const { searchClients } = useClientSearch();

  // Компонент лише відображає дані та викликає методи
  return <div>...</div>;
};
```

## Тестування

### Юніт-тести сервісів

```typescript
describe('ClientSearchService', () => {
  it('should search clients by query', async () => {
    const result = await clientSearchService.searchByQuery('test');
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
```

### Моки для репозиторіїв

```typescript
const mockClientRepository = {
  searchClients: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
```

## Розширення

### Додавання нового сервісу

1. **Створити інтерфейс**

```typescript
export interface INewService extends BaseService {
  doSomething(): Promise<OperationResult<SomeType>>;
}
```

2. **Реалізувати сервіс**

```typescript
export class NewService implements INewService {
  public readonly name = 'NewService';
  public readonly version = '1.0.0';

  async doSomething(): Promise<OperationResult<SomeType>> {
    // Реалізація
  }
}
```

3. **Експортувати**

```typescript
export * from './new.service';
```

### Додавання нового методу

1. **Додати в інтерфейс**
2. **Реалізувати в сервісі**
3. **Додати тести**
4. **Оновити документацію**

## Помилки та їх вирішення

### Типові помилки

1. **Імпорт з lib/api в сервісах**

   - Використовуйте репозиторії замість прямих викликів API

2. **Використання API типів в сервісах**

   - Створіть доменні типи та конвертуйте в репозиторіях

3. **Відсутність обробки помилок**

   - Всі методи повинні повертати OperationResult

4. **Великі сервіси (>150 рядків)**
   - Розбийте на менші, специфічні сервіси

### Налагодження

1. **Перевірте типи**

   - Всі параметри та результати мають бути типізовані

2. **Перевірте помилки**

   - Всі помилки мають бути оброблені та повернені в OperationResult

3. **Перевірте залежності**
   - Сервіси не повинні залежати від UI або фреймворків
