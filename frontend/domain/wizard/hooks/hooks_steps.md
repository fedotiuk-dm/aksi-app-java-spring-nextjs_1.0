# План реалізації хуків Order Wizard (DDD архітектура)

## 📖 Архітектурна філософія: "Hook → Service → Adapter → API"

**Правильна DDD архітектура з чіткими шарами відповідальності:**

- ✅ **Zod схеми валідації** (7 файлів у `schemas/`)
- ✅ **Zustand стор** (бізнес-логіка у `store/wizard.store.ts`)
- ✅ **XState машини** (навігація у `machines/`)
- ✅ **TypeScript типи** (10 файлів у `types/`)
- ✅ **Константи та утиліти** (готові)
- ✅ **API адаптери** (готові + розширені)

```
React Hook ↔ Domain Service ↔ Adapter ↔ API Service ↔ Backend
```

### 🎯 **Розподіл відповідальності:**

1. **React Hook** - тільки React стан та UI логіка
2. **Domain Service** - бізнес-логіка, координація (БЕЗ базової валідації!)
3. **Adapter** - перетворення типів, API інтеграція
4. **Zod Schemas** - вся валідація форм та даних
5. **API Service** - згенеровані OpenAPI клієнти
6. **Backend** - Spring Boot REST API

## 🏗️ **Поточний стан інфраструктури**

### ✅ **Готова інфраструктура (використовуємо як є):**

- **Zod схеми валідації** (7 файлів у `schemas/`) - ВСЯ ВАЛІДАЦІЯ ТУТ
- **Zustand стор** (бізнес-логіка у `store/wizard.store.ts`) - глобальний стан
- **XState машини** (навігація у `machines/`) - контроль переходів
- **TypeScript типи** (10 файлів у `types/`) - доменні типи
- **Константи та утиліти** (готові) - допоміжні функції
- **API адаптери** (готові + розширені) - повна API інтеграція

### 🔄 **Що потрібно доопрацювати:**

- **Доменні сервіси** - створити з нуля (тільки бізнес-логіка)
- **Хуки** - переробити під DDD архітектуру

## 🗓️ **Покроковий план реалізації**

### **✅ КРОК 1: Розширення існуючих адаптерів (ЗАВЕРШЕНО)**

**Мета:** Додати методи API викликів до готових адаптерів

**ClientAdapter - додані методи:**

1. ✅ `searchWithPagination(params)` → виклик `ClientsService.searchClientsWithPagination()`
2. ✅ `createClient(domainData)` → виклик `ClientsService.createClient()` + перетворення типів
3. ✅ `getById(id)` → виклик `ClientsService.getClientById()`
4. ✅ `updateClient(id, domainData)` → виклик `ClientsService.updateClient()`
5. ✅ `deleteClient(id)` → виклик `ClientsService.deleteClient()`

**BranchAdapter - додані методи:**

1. ✅ `getAllBranches(activeOnly)` → виклик `BranchLocationsApiService.getAllBranchLocations()`
2. ✅ `getById(id)` → виклик `BranchLocationsApiService.getBranchLocationById()`
3. ✅ `getByCode(code)` → виклик `BranchLocationsApiService.getBranchLocationByCode()`
4. ✅ `createBranch(domainData)` → виклик `BranchLocationsApiService.createBranchLocation()`
5. ✅ `updateBranch(id, domainData)` → виклик `BranchLocationsApiService.updateBranchLocation()`
6. ✅ `deleteBranch(id)` → виклик `BranchLocationsApiService.deleteBranchLocation()`
7. ✅ `setActiveStatus(id, active)` → виклик `BranchLocationsApiService.setActiveStatus()`

**Результат:** ✅ Адаптери стали повноцінною API інтеграцією з правильними типами

### **✅ КРОК 2: Створення доменних сервісів для Етапу 1 (ЗАВЕРШЕНО)**

**Мета:** Винести бізнес-логіку з хуків в окремі сервіси

**✅ ClientSearchService:**

- Відповідальність: координація пошуку, бізнес-правила пошуку
- Методи:
  - ✅ `searchWithPagination()` - пошук з пагінацією
  - ✅ `quickSearch()` - швидкий пошук для автокомплету
  - ✅ `hasSearchResults()`, `canLoadNextPage()` - утиліти пагінації
  - ✅ `formatSearchResultsForDisplay()` - форматування для UI
  - ✅ `shouldDebounceSearch()` - логіка дебаунсу
- БЕЗ валідації (Zod робить в хуках)

**✅ ClientCreationService:**

- Відповідальність: бізнес-логіка створення, перевірка дублікатів
- Методи:
  - ✅ `createClient()` - створення з перевіркою дублікатів
  - ✅ `checkDuplicatePhone()`, `checkDuplicateEmail()`, `checkDuplicateFullName()` - перевірки дублікатів
  - ✅ `checkForDuplicates()` - комплексна перевірка
  - ✅ `normalizeClientData()`, `normalizePhone()` - нормалізація даних
  - ✅ `canAutoCreate()`, `getDuplicateMessage()` - утиліти
- БЕЗ валідації форм (Zod робить)

**✅ ClientSelectionService:**

- Відповідальність: логіка вибору клієнта в контексті wizard
- Методи:
  - ✅ `selectClient()`, `clearSelection()` - управління вибором
  - ✅ `validateClientForOrder()` - валідація для замовлення
  - ✅ `isValidForOrder()`, `canProceedToNextStep()` - перевірки переходу
  - ✅ `getMissingRequiredFields()`, `getMissingRecommendedFields()` - аналіз полів
  - ✅ `formatClientForDisplay()` - форматування для wizard
- Інтеграція: готовий для роботи з Zustand Store через хуки

**Результат:** ✅ Сервіси містять всю бізнес-логіку, готові для використання в хуках

### **✅ КРОК 3: Переробка хуків Етапу 1 під DDD (ЗАВЕРШЕНО)**

**Мета:** Перенести API виклики з хуків в сервіси, зробити хуки "тонкими"

**✅ useClientSearch - DDD архітектура:**

- ✅ React стан: `searchTerm`, `searchResult`, `isSearching`, `searchCache`
- ✅ Дебаунс: власна реалізація замість use-debounce
- ✅ Пагінація: делегування ClientSearchService
- ✅ Кешування: локальний Map для результатів
- ✅ Бізнес-логіка: повністю делегована ClientSearchService
- ✅ Валідація: БЕЗ валідації (Zod робить в формах)
- ✅ API виклики: БЕЗ прямих викликів (через сервіс)

**✅ useClientForm - DDD архітектура:**

- ✅ React стан: форма через `useWizardForm`, `isCreating`, `duplicateCheck`
- ✅ Валідація: через існуючі Zod схеми (`createClientSchema`)
- ✅ Дублікати: делегування ClientCreationService
- ✅ Бізнес-логіка: повністю делегована ClientCreationService
- ✅ Інтеграція: з wizard станом для помилок/попереджень
- ✅ API виклики: БЕЗ прямих викликів (через сервіс)

**✅ useClientSelection - DDD архітектура:**

- ✅ React стан: `isSelecting`, `validationResult`
- ✅ Zustand інтеграція: `selectedClient`, `selectedClientId`, `isNewClient`
- ✅ Бізнес-логіка: делегування ClientSelectionService
- ✅ Навігація: інтеграція з `useWizardNavigation`
- ✅ Валідація: делегування сервісу для бізнес-правил
- ✅ API виклики: БЕЗ прямих викликів (через сервіс)

**✅ Індексні файли:**

- ✅ `/steps/client-selection/index.ts` - експорт хуків етапу
- ✅ `/hooks/index.ts` - головний експорт з коментарями TODO

**Результат:** ✅ Хуки етапу 1 повністю переведені на DDD архітектуру

### **КРОК 4: Створення сервісів для Етапу 2**

**Мета:** Підготовка логіки вибору філії та початку замовлення

**BranchService:**

- Відповідальність: завантаження та вибір філій
- Методи: `getAllActiveBranches()`, `selectBranch()`, `validateBranchSelection()`
- Бізнес-правила: філія активна, доступна для замовлень

**OrderInitiationService:**

- Відповідальність: створення початкового замовлення
- Методи: `initializeOrder(client, branch)`, `generateReceiptNumber()`, `generateTagNumber()`
- Інтеграція: комбінування даних клієнта + філії

### **КРОК 5: Хуки для Етапу 2**

**Мета:** Реалізація вибору філії та початку замовлення

**useBranchSelection:**

- Делегування: BranchService для списку філій
- React стан: список філій, вибрана філія, завантаження

**useOrderInitiation:**

- Делегування: OrderInitiationService
- React стан: початкові дані замовлення, статус створення

### **КРОК 6: Сервіси для Етапу 3 (Менеджер предметів)**

**Мета:** Складна логіка управління предметами та ціноутворення

**ItemManagementService:**

- Відповідальність: CRUD операції з предметами
- Методи: `addItem()`, `updateItem()`, `removeItem()`, `calculateOrderTotal()`
- Бізнес-правила: мінімум 1 предмет, валідація складності

**ItemWizardService:**

- Відповідальність: покрокове створення предмета
- Методи: `startItemCreation()`, `saveStepData()`, `completeItem()`, `cancelItem()`
- Інтеграція: з XState для Item Wizard навігації

**PricingCalculationService:**

- Відповідальність: складні розрахунки цін з модифікаторами
- Методи: `calculateBasePrice()`, `applyModifiers()`, `calculateFinalPrice()`
- Бізнес-правила: всі правила ціноутворення з документації

### **КРОК 7: Хуки для Етапу 3**

**useItemManager:**

- Делегування: ItemManagementService
- React стан: список предметів, загальна сума

**useItemWizard:**

- Делегування: ItemWizardService
- React стан: поточний предмет, крок wizard

**usePricingCalculator:**

- Делегування: PricingCalculationService
- React стан: розрахунки, модифікатори

### **КРОК 8: Сервіси та хуки для Етапів 4-5**

**Мета:** Завершення архітектури всіх етапів

**OrderParametersService + useOrderParameters**
**ExpediteService + useExpediteCalculation**
**OrderCompletionService + useOrderConfirmation**
**DigitalSignatureService + useDigitalSignature**

### **КРОК 9: Фінальна інтеграція**

**Мета:** З'єднання всіх частин в цілісну систему

1. Створення індексних файлів експорту
2. Інтеграція з існуючим Zustand Store
3. Тестування повного флоу
4. Оптимізація продуктивності

## 🔧 **Ключові принципи реалізації**

### **Валідація - тільки Zod:**

- ✅ Вся валідація в існуючих Zod схемах
- ❌ БЕЗ дублювання в сервісах
- ✅ Використання `useWizardForm` для інтеграції

### **Сервіси - тільки бізнес-логіка:**

- ✅ Координація операцій
- ✅ Бізнес-правила та обмеження
- ✅ Композиція адаптерів
- ❌ БЕЗ базової валідації
- ❌ БЕЗ React стану

### **Хуки - тільки React:**

- ✅ React стан та ефекти
- ✅ Інтеграція з UI компонентами
- ✅ Делегування бізнес-логіки сервісам
- ❌ БЕЗ прямих API викликів

### **Адаптери - тільки API:**

- ✅ Виклики OpenAPI сервісів
- ✅ Перетворення API ↔ Domain типів
- ✅ Обробка API помилок
- ❌ БЕЗ бізнес-логіки

## 📊 **Оцінка обсягу робіт**

### **Розширення адаптерів:** ~3-4 методи на адаптер

### **Доменні сервіси:** ~9 сервісів по 3-5 методів

### **Переробка хуків:** ~15 хуків по 30-50 рядків

### **Інтеграція:** фінальне з'єднання частин

**Загальна оцінка:** Середній обсяг, але чітка структура

## ❓ **Питання для підтвердження:**

1. **Чи правильно розумію - валідація ТІЛЬКИ в Zod?**
2. **Чи готові почати з КРОК 1 (розширення адаптерів)?**
3. **Чи потрібні зміни в плані перед початком?**

**Готові переходити до реалізації?** 🚀
