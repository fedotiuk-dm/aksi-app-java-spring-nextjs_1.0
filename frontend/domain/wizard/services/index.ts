/**
 * @fileoverview Wizard Services - Бізнес-логіка для Order Wizard домену
 * @module domain/wizard/services
 * @author AKSI Team
 * @since 1.0.0
 *
 * ================================================================================
 * 🔧 WIZARD SERVICES - БІЗНЕС-ЛОГІКА ТА ВАЛІДАЦІЯ
 * ================================================================================
 *
 * ## 🎯 РОЛЬ СЕРВІСІВ В АРХІТЕКТУРІ
 *
 * Сервіси містять **ЧИСТУ БІЗНЕС-ЛОГІКУ** wizard домену:
 * - Валідація даних через orval + Zod схеми
 * - Бізнес-правила та обчислення
 * - Адаптація API даних для UI
 * - Трансформація та композиція даних
 *
 * ### Сервіси НЕ містять:
 * - API виклики (роль TanStack Query + orval)
 * - UI логіку (роль компонентів)
 * - Стан додатка (роль Zustand)
 * - Навігаційну логіку (роль XState)
 *
 * ### Сервіси МІСТЯТЬ:
 * - Валідацію через orval схеми
 * - Бізнес-правила та обчислення
 * - Адаптацію API даних
 * - Очищення та трансформацію даних
 *
 * ## 🏗️ АРХІТЕКТУРНІ ПРИНЦИПИ
 *
 * ### Принцип мінімалізму:
 * - Розмір сервісу < 300 рядків
 * - Одна відповідальність на сервіс (SRP)
 * - Тільки композиція та валідація
 * - БЕЗ дублювання функціональності
 *
 * ### Інтеграція з orval:
 * ```typescript
 * import { safeValidate, validateOrThrow } from '@/shared/api/generated/zod';
 * import { clientDataSchema } from '@/shared/api/generated/client/zod';
 *
 * export class ClientValidationService extends BaseWizardService {
 *   validateClient(data: unknown) {
 *     return safeValidate(clientDataSchema, data);
 *   }
 * }
 * ```
 *
 * ### Базовий клас для всіх сервісів:
 * ```typescript
 * import { BaseWizardService } from './base.service';
 *
 * export class MyService extends BaseWizardService {
 *   protected readonly serviceName = 'MyService';
 *
 *   // методи сервісу
 * }
 * ```
 *
 * ## 📁 СТРУКТУРА СЕРВІСІВ ЗА ЕТАПАМИ
 *
 * ```
 * services/
 * ├── base.service.ts              # 🏗️ Базовий сервіс
 * │
 * ├── stage-1-client-and-order/    # 🧑 Етап 1: Клієнт та замовлення
 * │   ├── client-search/           # Пошук клієнтів
 * │   ├── client-selection/        # Вибір клієнта
 * │   └── order-basic-info/        # Базова інформація
 * │
 * ├── stage-2-item-management/     # 📦 Етап 2: Предмети
 * │   ├── items-manager/           # Менеджер предметів
 * │   ├── item-characteristics/    # Характеристики
 * │   ├── item-defects/           # Дефекти та ризики
 * │   ├── price-calculator/       # Розрахунок ціни
 * │   └── photo-documentation/    # Фотодокументація
 * │
 * ├── stage-3-order-params/        # ⚙️ Етап 3: Параметри
 * │   ├── execution-parameters/    # Параметри виконання
 * │   ├── global-discounts/       # Глобальні знижки
 * │   ├── payment/                # Оплата
 * │   └── additional-info/        # Додаткова інформація
 * │
 * └── stage-4-confirmation/        # ✅ Етап 4: Підтвердження
 *     ├── order-review/           # Перегляд замовлення
 *     ├── legal-aspects/          # Юридичні аспекти
 *     ├── receipt-generation/     # Генерація квитанції
 *     └── process-completion/     # Завершення процесу
 * ```
 *
 * ## 🔗 ІНТЕГРАЦІЯ З ІНШИМИ ШАРАМИ
 *
 * ### Використання в хуках:
 * ```typescript
 * import { ClientSearchService } from '@/domain/wizard/services';
 *
 * export const useClientSearch = () => {
 *   const service = useMemo(() => new ClientSearchService(), []);
 *
 *   const validateSearchCriteria = useCallback((criteria: unknown) => {
 *     return service.validateSearchCriteria(criteria);
 *   }, [service]);
 *
 *   return { validateSearchCriteria };
 * };
 * ```
 *
 * ### Використання з TanStack Query:
 * ```typescript
 * import { useMutation } from '@tanstack/react-query';
 * import { ClientValidationService } from '@/domain/wizard/services';
 *
 * export const useCreateClient = () => {
 *   const service = new ClientValidationService();
 *
 *   return useMutation({
 *     mutationFn: async (clientData: unknown) => {
 *       // Валідація через сервіс
 *       const validation = service.validateClient(clientData);
 *       if (!validation.success) {
 *         throw new Error(validation.errors.join(', '));
 *       }
 *
 *       // API виклик через orval
 *       return await createClientApi(validation.data);
 *     },
 *   });
 * };
 * ```
 *
 * ## 📋 ПРИКЛАДИ ТИПОВИХ СЕРВІСІВ
 *
 * ### Сервіс валідації:
 * ```typescript
 * import { safeValidate } from '@/shared/api/generated/zod';
 * import { clientDataSchema } from '@/shared/api/generated/client/zod';
 * import { BaseWizardService } from '../base.service';
 *
 * export class ClientValidationService extends BaseWizardService {
 *   protected readonly serviceName = 'ClientValidationService';
 *
 *   validateClientData(data: unknown) {
 *     return safeValidate(clientDataSchema, data);
 *   }
 *
 *   validatePhoneNumber(phone: string): boolean {
 *     return /^[\d\s\+\-\(\)]+$/.test(phone) && phone.length >= 10;
 *   }
 * }
 * ```
 *
 * ### Сервіс бізнес-логіки:
 * ```typescript
 * export class PriceCalculatorService extends BaseWizardService {
 *   protected readonly serviceName = 'PriceCalculatorService';
 *
 *   calculateItemPrice(item: OrderItemData, modifiers: PriceModifier[]): PriceCalculation {
 *     let basePrice = item.basePrice;
 *     let totalModifications = 0;
 *
 *     for (const modifier of modifiers) {
 *       const modification = this.applyModifier(basePrice, modifier);
 *       totalModifications += modification;
 *     }
 *
 *     return {
 *       basePrice,
 *       modifications: totalModifications,
 *       finalPrice: basePrice + totalModifications,
 *       breakdown: this.generateBreakdown(basePrice, modifiers),
 *     };
 *   }
 * }
 * ```
 *
 * ### Сервіс адаптації даних:
 * ```typescript
 * export class OrderSummaryService extends BaseWizardService {
 *   protected readonly serviceName = 'OrderSummaryService';
 *
 *   adaptOrderForReceipt(order: OrderData): ReceiptData {
 *     return {
 *       orderNumber: order.id,
 *       customerInfo: this.formatCustomerInfo(order.client),
 *       items: order.items.map(item => this.formatReceiptItem(item)),
 *       totals: this.calculateTotals(order),
 *       legalInfo: this.generateLegalInfo(),
 *     };
 *   }
 * }
 * ```
 *
 * ## ⚡ ПАТТЕРНИ ОПТИМІЗАЦІЇ
 *
 * ### Lazy ініціалізація:
 * ```typescript
 * export const useValidationServices = () => {
 *   const clientService = useMemo(() => new ClientValidationService(), []);
 *   const orderService = useMemo(() => new OrderValidationService(), []);
 *
 *   return { clientService, orderService };
 * };
 * ```
 *
 * ### Кешування обчислень:
 * ```typescript
 * export class PriceCalculatorService extends BaseWizardService {
 *   private calculationCache = new Map<string, PriceCalculation>();
 *
 *   calculatePrice(item: OrderItemData): PriceCalculation {
 *     const cacheKey = this.generateCacheKey(item);
 *
 *     if (this.calculationCache.has(cacheKey)) {
 *       return this.calculationCache.get(cacheKey)!;
 *     }
 *
 *     const calculation = this.performCalculation(item);
 *     this.calculationCache.set(cacheKey, calculation);
 *
 *     return calculation;
 *   }
 * }
 * ```
 *
 * ## 🧪 ТЕСТУВАННЯ СЕРВІСІВ
 *
 * ### Одиничні тести:
 * ```typescript
 * describe('ClientValidationService', () => {
 *   let service: ClientValidationService;
 *
 *   beforeEach(() => {
 *     service = new ClientValidationService();
 *   });
 *
 *   it('should validate valid client data', () => {
 *     const validClient = {
 *       firstName: 'Іван',
 *       lastName: 'Петренко',
 *       phone: '+380123456789',
 *     };
 *
 *     const result = service.validateClientData(validClient);
 *     expect(result.success).toBe(true);
 *   });
 * });
 * ```
 *
 * ## ⚠️ ВАЖЛИВІ ПРИМІТКИ
 *
 * - **Без side effects**: сервіси не мають побічних ефектів
 * - **Immutable**: не змінюють вхідні параметри
 * - **Testable**: легко тестуються через dependency injection
 * - **Orval first**: пріоритет orval схем над власними
 * - **Performance**: кешування для expensive операцій
 * - **Error handling**: стандартизована обробка помилок через BaseService
 *
 * ================================================================================
 */

// ===== STAGE 1: CLIENT AND ORDER =====
// Сервіси для роботи з клієнтами та базовою інформацією замовлення
export * from './stage-1-client-and-order/index';

// ===== STAGE 2: ITEM MANAGEMENT (всі мінімалістські) =====
// Сервіси для управління предметами замовлення
export * from './stage-2-item-management/index';

// ===== STAGE 3: ORDER PARAMS (всі з адаптерів) =====
// Сервіси для параметрів виконання, знижок та оплати
export * from './stage-3-order-params/index';

// ===== STAGE 4: CONFIRMATION (всі з адаптерів) =====
// Сервіси для підтвердження замовлення та генерації документів
export * from './stage-4-confirmation/index';
