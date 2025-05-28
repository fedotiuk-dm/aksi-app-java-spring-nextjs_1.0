/**
 * @fileoverview Zod Схеми валідації для Order Wizard домену
 * @module domain/wizard/schemas
 * @author AKSI Team
 * @since 1.0.0
 *
 * ================================================================================
 * ✅ ZOD VALIDATION SCHEMAS - ВАЛІДАЦІЯ WIZARD ДОМЕНУ
 * ================================================================================
 *
 * ## 🎯 РОЛЬ СХЕМ В АРХІТЕКТУРІ
 *
 * Zod схеми забезпечують **RUNTIME ВАЛІДАЦІЮ** даних wizard:
 * - Валідація форм перед відправкою на сервер
 * - Перевірка отриманих API відповідей
 * - Генерація TypeScript типів з схем
 * - Трансформація та очищення даних
 *
 * ## 🔗 ІНТЕГРАЦІЯ З ORVAL
 *
 * ### Пріоритет orval схем:
 * ```typescript
 * // ✅ ПРАВИЛЬНО: використання orval схем для API
 * import { clientDataSchema } from '@/shared/api/generated/client/zod';
 * import { safeValidate } from '@/shared/api/generated/zod';
 *
 * const validation = safeValidate(clientDataSchema, formData);
 *
 * // ❌ НЕПРАВИЛЬНО: створення власних дублікатів API схем
 * const myClientSchema = z.object({ ... }); // Не потрібно!
 * ```
 *
 * ### Локальні схеми тільки для:
 * - UI специфічної валідації
 * - Метаданих wizard (крок, прогрес, навігація)
 * - Композиційних типів для складних форм
 * - Проміжних станів та збереження
 *
 * ## 📋 СТРУКТУРА СХЕМ
 *
 * ### wizard-base.schemas.ts:
 * - Базові схеми станів wizard
 * - Схеми навігації та прогресу
 * - Метадані та контекст wizard
 * - Схеми збереження сесії
 *
 * ### Відсутні схеми (використовуємо orval):
 * - `clientSchema` → `clientDataSchema` з orval
 * - `branchSchema` → `branchDataSchema` з orval
 * - `orderItemSchema` → `orderItemDataSchema` з orval
 * - `expediteSchema` → `calculateCompletionDateBodySchema` з orval
 * - `discountSchema` → `applyDiscountBodySchema` з orval
 *
 * ## 🏗️ АРХІТЕКТУРНІ ПРИНЦИПИ
 *
 * ### Single Source of Truth:
 * ```typescript
 * // API типи походять з orval схем
 * import { clientDataSchema } from '@/shared/api/generated';
 *
 * // UI типи створюються локально
 * export const wizardProgressSchema = z.object({
 *   currentStep: z.enum(['client', 'items', 'params', 'confirmation']),
 *   completedSteps: z.array(z.string()),
 *   totalSteps: z.number(),
 * });
 * ```
 *
 * ### Композиція схем:
 * ```typescript
 * // Комбінування orval та локальних схем
 * export const clientSelectionFormSchema = z.object({
 *   // Orval схема для клієнта
 *   clientData: clientDataSchema.optional(),
 *
 *   // Локальні UI стани
 *   isSearchMode: z.boolean(),
 *   searchTerm: z.string(),
 *   validationErrors: z.array(z.string()),
 * });
 * ```
 *
 * ### Валідація з трансформацією:
 * ```typescript
 * export const phoneNumberSchema = z.string()
 *   .min(10, 'Телефон повинен містити мінімум 10 цифр')
 *   .transform(phone => phone.replace(/\D/g, '')) // очищення від нецифрових символів
 *   .refine(phone => phone.length >= 10, 'Невірний формат телефону');
 * ```
 *
 * ## 🚀 ПРИКЛАДИ ВИКОРИСТАННЯ
 *
 * ### Валідація форми з orval схемою:
 * ```typescript
 * import { useForm } from 'react-hook-form';
 * import { zodResolver } from '@hookform/resolvers/zod';
 * import { clientDataSchema } from '@/shared/api/generated/client/zod';
 *
 * export const useClientForm = () => {
 *   return useForm<ClientData>({
 *     resolver: zodResolver(clientDataSchema),
 *     defaultValues: {
 *       firstName: '',
 *       lastName: '',
 *       phone: '',
 *       email: '',
 *     },
 *   });
 * };
 * ```
 *
 * ### Валідація в сервісі:
 * ```typescript
 * import { safeValidate } from '@/shared/api/generated/zod';
 * import { clientDataSchema } from '@/shared/api/generated/client/zod';
 *
 * export class ClientValidationService {
 *   validateClientData(data: unknown) {
 *     const validation = safeValidate(clientDataSchema, data);
 *
 *     if (!validation.success) {
 *       return {
 *         isValid: false,
 *         errors: validation.errors,
 *       };
 *     }
 *
 *     return {
 *       isValid: true,
 *       data: validation.data,
 *       errors: [],
 *     };
 *   }
 * }
 * ```
 *
 * ### Композиційна валідація:
 * ```typescript
 * import { wizardProgressSchema } from '@/domain/wizard/schemas';
 *
 * export const fullWizardStateSchema = z.object({
 *   // Orval типи
 *   selectedClient: clientDataSchema.optional(),
 *   orderItems: z.array(orderItemDataSchema),
 *
 *   // Локальні UI стани
 *   progress: wizardProgressSchema,
 *   navigationHistory: z.array(z.string()),
 *   unsavedChanges: z.boolean(),
 * });
 * ```
 *
 * ## 📊 КОРИСТЬ ВІД ZOD СХЕМ
 *
 * ### Runtime безпека:
 * - Перевірка типів під час виконання
 * - Захист від невалідних API відповідей
 * - Раннє виявлення помилок валідації
 *
 * ### TypeScript інтеграція:
 * ```typescript
 * // Автоматична генерація типів
 * type WizardProgress = z.infer<typeof wizardProgressSchema>;
 * type ClientFormData = z.infer<typeof clientSelectionFormSchema>;
 * ```
 *
 * ### Трансформація даних:
 * ```typescript
 * const cleanPhoneSchema = z.string()
 *   .transform(phone => phone.replace(/[^\d]/g, ''))
 *   .pipe(z.string().min(10));
 * ```
 *
 * ### Складна валідація:
 * ```typescript
 * const orderValidationSchema = z.object({
 *   items: z.array(orderItemDataSchema).min(1, 'Потрібен хоча б один предмет'),
 *   totalAmount: z.number().positive(),
 * }).refine(
 *   data => data.totalAmount === data.items.reduce((sum, item) => sum + item.price, 0),
 *   'Загальна сума не збігається з сумою предметів'
 * );
 * ```
 *
 * ## ⚠️ ВАЖЛИВІ ПРИМІТКИ
 *
 * - **Не дублюємо orval схеми**: використовуємо готові з API
 * - **Локальні схеми**: тільки для UI специфічної логіки
 * - **Валідація**: runtime + compile-time безпека
 * - **Трансформація**: очищення та нормалізація даних
 * - **Композиція**: комбінування orval та локальних схем
 * - **Продуктивність**: lazy валідація для великих об'єктів
 *
 * ================================================================================
 */

export * from './wizard-base.schemas';
