/**
 * @fileoverview Wizard Hooks - React хуки для композиції бізнес-логіки
 * @module domain/wizard/hooks
 * @author AKSI Team
 * @since 1.0.0
 *
 * ================================================================================
 * 🪝 WIZARD DOMAIN HOOKS - КОМПОЗИЦІЯ БІЗНЕС-ЛОГІКИ
 * ================================================================================
 *
 * ## 🎯 РОЛЬ ХУКІВ В АРХІТЕКТУРІ
 *
 * React хуки виступають як **КОМПОЗИЦІЙНИЙ ШАР** між:
 * - 🗃️ Zustand (бізнес-стан)
 * - 🔄 XState (навігаційна логіка)
 * - 🌐 TanStack Query (API операції)
 * - ✅ Orval + Zod (валідація)
 *
 * ### Хуки НЕ містять:
 * - Бізнес-логіку (роль сервісів)
 * - UI логіку (роль компонентів)
 * - Прямі API виклики (роль TanStack Query)
 *
 * ### Хуки МІСТЯТЬ:
 * - Композицію різних бібліотек
 * - Адаптацію даних для UI
 * - Обробку подій та callbacks
 * - Координацію між станами
 *
 * ## 🏗️ АРХІТЕКТУРНА СТРУКТУРА
 *
 * ```
 * hooks/
 * ├── navigation/              # 🧭 Навігаційні хуки
 * │   └── use-wizard-navigation.hook.ts
 * │
 * ├── stage-1-client-and-order/ # 🧑 Етап 1: Клієнт та замовлення
 * │   ├── use-client-search.hook.ts
 * │   ├── use-client-selection.hook.ts
 * │   ├── use-client-api-operations.hook.ts
 * │   └── use-order-basic-info.hook.ts
 * │
 * ├── stage-2-item-management/ # 📦 Етап 2: Предмети
 * │   ├── use-items-manager.hook.ts
 * │   ├── use-item-wizard.hook.ts
 * │   └── use-price-calculator.hook.ts
 * │
 * ├── stage-3-order-params/    # ⚙️ Етап 3: Параметри
 * │   ├── use-execution-params.hook.ts
 * │   ├── use-global-discounts.hook.ts
 * │   ├── use-payment.hook.ts
 * │   └── use-additional-info.hook.ts
 * │
 * ├── stage-4-confirmation/    # ✅ Етап 4: Підтвердження
 * │   ├── use-order-review.hook.ts
 * │   ├── use-legal-aspects.hook.ts
 * │   └── use-receipt-generation.hook.ts
 * │
 * ├── shared/                  # 🌐 Спільні хуки
 * │   ├── use-wizard-validation.hook.ts
 * │   └── use-wizard-persistence.hook.ts
 * │
 * └── use-wizard-composition.hook.ts # 🎭 Головний композиційний хук
 * ```
 *
 * ## 🔗 ПРИНЦИПИ КОМПОЗИЦІЇ
 *
 * ### Інтеграція Zustand + XState:
 * ```typescript
 * export const useClientSelection = () => {
 *   // Zustand - дані
 *   const { selectedClient, setSelectedClient } = useWizardStore();
 *
 *   // XState - навігація
 *   const { canGoNext, goNext } = useWizardNavigation();
 *
 *   // Композиція - логіка
 *   const selectClient = useCallback((client: ClientData) => {
 *     setSelectedClient(client); // оновлення стану
 *     if (canGoNext) goNext(); // автоматичний перехід
 *   }, [setSelectedClient, canGoNext, goNext]);
 *
 *   return { selectedClient, selectClient };
 * };
 * ```
 *
 * ### Інтеграція TanStack Query + Zustand:
 * ```typescript
 * export const useClientApiOperations = () => {
 *   // TanStack Query - API
 *   const searchMutation = useSearchClientsMutation();
 *   const createMutation = useCreateClientMutation();
 *
 *   // Zustand - стан
 *   const { setSearchResults, setSelectedClient } = useWizardStore();
 *
 *   // Композиція - координація
 *   const searchClients = useCallback(async (criteria: SearchCriteria) => {
 *     const result = await searchMutation.mutateAsync(criteria);
 *     setSearchResults(result.data); // оновлення стану після API
 *   }, [searchMutation, setSearchResults]);
 *
 *   const createClient = useCallback(async (clientData: ClientData) => {
 *     const result = await createMutation.mutateAsync(clientData);
 *     setSelectedClient(result.data); // встановлення нового клієнта
 *   }, [createMutation, setSelectedClient]);
 *
 *   return {
 *     searchClients,
 *     createClient,
 *     isSearching: searchMutation.isPending,
 *     isCreating: createMutation.isPending,
 *   };
 * };
 * ```
 *
 * ### Інтеграція Orval + Zod валідації:
 * ```typescript
 * export const useClientForm = () => {
 *   // React Hook Form + Zod
 *   const form = useForm<ClientData>({
 *     resolver: zodResolver(clientDataSchema), // orval схема
 *   });
 *
 *   // Композиція - валідація та збереження
 *   const handleSubmit = form.handleSubmit(async (data) => {
 *     // Orval валідація
 *     const validation = safeValidate(clientDataSchema, data);
 *     if (!validation.success) return;
 *
 *     // API операція
 *     await createClient(validation.data);
 *   });
 *
 *   return { form, handleSubmit };
 * };
 * ```
 *
 * ## 🚀 ПРИКЛАДИ ВИКОРИСТАННЯ
 *
 * ### UI компонент з хуком:
 * ```tsx
 * 'use client';
 *
 * import { useClientSearch } from '@/domain/wizard';
 *
 * export const ClientSelectionStep = () => {
 *   const {
 *     searchClients,
 *     results,
 *     selectedClient,
 *     selectClient,
 *     isSearching,
 *     clearSearch
 *   } = useClientSearch();
 *
 *   return (
 *     <div>
 *       <SearchInput
 *         onSearch={searchClients}
 *         loading={isSearching}
 *       />
 *       <ClientList
 *         clients={results}
 *         selected={selectedClient}
 *         onSelect={selectClient}
 *       />
 *       <button onClick={clearSearch}>
 *         Очистити результати
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 *
 * ### Композиційний хук для складних сценаріїв:
 * ```typescript
 * export const useOrderWizard = () => {
 *   // Композиція різних хуків
 *   const navigation = useWizardNavigation();
 *   const clientOps = useClientSelection();
 *   const itemOps = useItemsManager();
 *   const validation = useWizardValidation();
 *
 *   // Складна логіка координації
 *   const completeOrder = useCallback(async () => {
 *     if (!validation.isValid) return;
 *
 *     await itemOps.saveAllItems();
 *     await clientOps.updateClientInfo();
 *     navigation.goToCompletion();
 *   }, [validation, itemOps, clientOps, navigation]);
 *
 *   return {
 *     ...navigation,
 *     ...clientOps,
 *     ...itemOps,
 *     completeOrder,
 *     isValid: validation.isValid,
 *   };
 * };
 * ```
 *
 * ## 📋 ПРАВИЛА ДИЗАЙНУ ХУКІВ
 *
 * ### DO (Роби):
 * - ✅ Композиція різних бібліотек
 * - ✅ Адаптація даних для UI
 * - ✅ Обробка callbacks та подій
 * - ✅ Координація між станами
 * - ✅ Мемоізація через useCallback/useMemo
 *
 * ### DON'T (Не роби):
 * - ❌ Бізнес-логіку (використовуй сервіси)
 * - ❌ Прямі API виклики (використовуй TanStack Query)
 * - ❌ Складні обчислення (використовуй сервіси)
 * - ❌ UI логіку (тримай в компонентах)
 *
 * ## ⚡ ОПТИМІЗАЦІЯ ПРОДУКТИВНОСТІ
 *
 * ### Селективні підписки:
 * ```typescript
 * // ✅ ПРАВИЛЬНО: селективна підписка
 * const selectedClient = useWizardStore(state => state.selectedClient);
 * const orderItems = useWizardStore(state => state.orderItems);
 *
 * // ❌ НЕПРАВИЛЬНО: підписка на весь стан
 * const { selectedClient, orderItems } = useWizardStore();
 * ```
 *
 * ### Мемоізація callbacks:
 * ```typescript
 * const searchClients = useCallback(async (criteria: SearchCriteria) => {
 *   // логіка пошуку
 * }, [dependencies]); // тільки необхідні залежності
 * ```
 *
 * ### Умовні хуки для великих операцій:
 * ```typescript
 * // Завантажуємо тільки коли потрібно
 * const { data: priceCalculations } = usePriceCalculationsQuery(
 *   orderItems,
 *   { enabled: orderItems.length > 0 }
 * );
 * ```
 *
 * ## ⚠️ ВАЖЛИВІ ПРИМІТКИ
 *
 * - **Композиція над спадкуванням**: використовуємо хуки для композиції
 * - **Односпрямований потік**: дані течуть вниз, події вгору
 * - **Тестування**: хуки легко тестувати через @testing-library/react-hooks
 * - **TypeScript**: строга типізація всіх параметрів та повернутих значень
 * - **Мемоізація**: обов'язкова для callbacks та expensive operations
 *
 * ================================================================================
 */

// === НАВІГАЦІЯ ===
// Хуки для управління переходами між кроками wizard
export * from './navigation';

// === ЕТАП 1: Клієнт та замовлення ===
// Хуки для роботи з клієнтами та базовою інформацією замовлення
export * from './stage-1-client-and-order';

// // === ЕТАП 2: Управління предметами ===
// // Хуки для циклічного додавання предметів до замовлення
// export * from './stage-2-item-management';

// // === ЕТАП 3: Параметри замовлення ===
// // Хуки для налаштування параметрів виконання, знижок та оплати
// export * from './stage-3-order-params';

// // === ЕТАП 4: Підтвердження та завершення ===
// // Хуки для підтвердження замовлення та генерації квитанції
// export * from './stage-4-confirmation';

// === СПІЛЬНІ ХУКИ ===
// Хуки загального призначення для wizard домену
export * from './shared';

// === ГОЛОВНИЙ КОМПОЗИЦІЙНИЙ ХУК ===
// Композиція всіх wizard хуків для складних сценаріїв
export { useWizardComposition } from './use-wizard-composition.hook';
