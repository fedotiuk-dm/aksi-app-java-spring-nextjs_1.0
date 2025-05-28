/**
 * @fileoverview Централізовані Zod схеми для Stage 3: Загальні параметри замовлення
 *
 * Структура Stage 3:
 * 3.1 - execution-params: Параметри виконання (дата, терміновість)
 * 3.2 - global-discounts: Глобальні знижки замовлення
 * 3.3 - payment-processing: Обробка платежів
 * 3.4 - additional-info: Додаткова інформація та примітки
 *
 * ПРАВИЛА:
 * - Всі схеми централізовані в одному файлі
 * - Експорт схем та типів для використання в сервісах
 * - Дотримання українізації та бізнес-правил
 * - Ретельна валідація всіх полів
 */

import { z } from 'zod';

// ===============================================
// ЦЕНТРАЛІЗОВАНІ ZOD СХЕМИ ДЛЯ STAGE-3 ORDER WIZARD
// ===============================================
// Етап 3: Загальні параметри замовлення
// ✅ СТРОГО НА ОСНОВІ: OrderWizard instruction_structure logic.md
// ✅ Single Source of Truth: документ з вимогами

// ===============================================
// ENUMS ТА БАЗОВІ ТИПИ (з документу)
// ===============================================

// 3.1 - Термінове виконання (мультивибір з документу)
export const urgentExecutionEnum = z.enum(
  [
    'звичайне', // Звичайне (без націнки)
    'термінове_50_за_48год', // +50% за 48 год
    'термінове_100_за_24год', // +100% за 24 год
  ],
  {
    errorMap: () => ({ message: 'Оберіть тип терміновості виконання' }),
  }
);

// 3.2 - Тип знижки (вибір один з документу)
export const discountTypeEnum = z.enum(
  [
    'без_знижки', // Без знижки
    'еверкард', // Еверкард (10%)
    'соцмережі', // Соцмережі (5%)
    'зсу', // ЗСУ (10%)
    'інше', // Інше (з полем для вводу відсотка)
  ],
  {
    errorMap: () => ({ message: 'Оберіть тип знижки' }),
  }
);

// 3.3 - Спосіб оплати (вибір один з документу)
export const paymentMethodEnum = z.enum(
  [
    'термінал', // Термінал
    'готівка', // Готівка
    'на_рахунок', // На рахунок
  ],
  {
    errorMap: () => ({ message: 'Оберіть спосіб оплати' }),
  }
);

// ===============================================
// 3.1. ПАРАМЕТРИ ВИКОНАННЯ (з документу)
// ===============================================

export const executionParamsSchema = z.object({
  // Дата виконання: Календар з вибором дати
  executionDate: z
    .string()
    .min(1, "Дата виконання обов'язкова")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Дата виконання не може бути в минулому'),

  // Автоматичний розрахунок на основі категорій доданих предметів
  isAutoCalculated: z.boolean().default(true),

  // Інформація про стандартні терміни (48 годин для звичайних/14 днів для шкіри)
  standardDeadlineInfo: z.string().optional(),

  // Термінове виконання (мультивибір)
  urgentExecution: urgentExecutionEnum.default('звичайне'),

  // Автоматичний перерахунок дати виконання при зміні
  isDateRecalculated: z.boolean().default(false),
});

// ===============================================
// 3.2. ЗНИЖКИ (глобальні для замовлення з документу)
// ===============================================

export const globalDiscountsSchema = z.object({
  // Тип знижки (вибір один)
  discountType: discountTypeEnum.default('без_знижки'),

  // Поле для вводу відсотка (для типу "інше")
  customDiscountPercent: z
    .number()
    .min(0, "Відсоток знижки не може бути від'ємним")
    .max(100, 'Відсоток знижки не може перевищувати 100%')
    .optional(),

  // Система повинна перевіряти автоматично
  systemValidation: z.object({
    // Знижки не діють на прасування, прання і фарбування текстилю
    excludedCategories: z
      .array(z.string())
      .default(['прасування', 'прання', 'фарбування_текстилю']),

    // Відображення попередження якщо вибрана знижка не може бути застосована
    hasWarning: z.boolean().default(false),
    warningMessage: z.string().optional(),

    // Автоматичне виключення неприйнятних категорій зі знижки
    ineligibleItemIds: z.array(z.string()).default([]),
  }),

  // Розрахована сума знижки
  calculatedDiscountAmount: z.number().min(0).default(0),
});

// ===============================================
// 3.3. ОПЛАТА (з документу)
// ===============================================

export const paymentProcessingSchema = z
  .object({
    // Спосіб оплати (вибір один)
    paymentMethod: paymentMethodEnum,

    // Фінансові деталі
    financialDetails: z.object({
      // Загальна вартість (сума всіх предметів з урахуванням знижок/надбавок)
      totalAmount: z.number().min(0, "Загальна вартість не може бути від'ємною"),

      // Сплачено (поле для введення суми передоплати)
      paidAmount: z.number().min(0, "Сплачена сума не може бути від'ємною").default(0),

      // Борг (розраховується автоматично як різниця)
      debtAmount: z.number().min(0, "Сума боргу не може бути від'ємною").default(0),
    }),
  })
  .refine(
    (data) => {
      // Перевірка що сплачена сума не перевищує загальну
      return data.financialDetails.paidAmount <= data.financialDetails.totalAmount;
    },
    {
      message: 'Сплачена сума не може перевищувати загальну вартість',
      path: ['financialDetails', 'paidAmount'],
    }
  );

// ===============================================
// 3.4. ДОДАТКОВА ІНФОРМАЦІЯ (з документу)
// ===============================================

export const additionalInfoSchema = z.object({
  // Примітки до замовлення (загальні)
  orderNotes: z
    .string()
    .max(500, 'Примітки до замовлення не можуть перевищувати 500 символів')
    .optional(),

  // Додаткові вимоги клієнта
  clientRequirements: z
    .string()
    .max(300, 'Додаткові вимоги клієнта не можуть перевищувати 300 символів')
    .optional(),
});

// ===============================================
// КОМПЛЕКСНА СХЕМА ДЛЯ ВСЬОГО STAGE-3
// ===============================================

export const orderParamsStage3Schema = z.object({
  // 3.1 - Параметри виконання
  executionParams: executionParamsSchema,

  // 3.2 - Знижки (глобальні для замовлення)
  globalDiscounts: globalDiscountsSchema,

  // 3.3 - Оплата
  paymentProcessing: paymentProcessingSchema,

  // 3.4 - Додаткова інформація
  additionalInfo: additionalInfoSchema,
});

// ===============================================
// СХЕМИ ДЛЯ ВАЛІДАЦІЇ ФОРМ
// ===============================================

export const executionParamsFormSchema = executionParamsSchema.extend({
  isFormDirty: z.boolean().default(false),
  hasValidationErrors: z.boolean().default(false),
});

export const globalDiscountsFormSchema = globalDiscountsSchema.extend({
  isDiscountApplicable: z.boolean().default(true),
  previousDiscountType: discountTypeEnum.optional(),
});

// Окрема базова схема для payment processing без refine
export const paymentProcessingBaseSchema = z.object({
  paymentMethod: paymentMethodEnum,
  financialDetails: z.object({
    totalAmount: z.number().min(0, "Загальна вартість не може бути від'ємною"),
    paidAmount: z.number().min(0, "Сплачена сума не може бути від'ємною").default(0),
    debtAmount: z.number().min(0, "Сума боргу не може бути від'ємною").default(0),
  }),
});

export const paymentProcessingFormSchema = paymentProcessingBaseSchema.extend({
  isPaymentComplete: z.boolean().default(false),
  paymentValidationErrors: z.array(z.string()).default([]),
});

export const additionalInfoFormSchema = additionalInfoSchema.extend({
  characterCounts: z.object({
    orderNotes: z.number().default(0),
    clientRequirements: z.number().default(0),
  }),
});

// ===============================================
// СХЕМИ ДЛЯ API ВЗАЄМОДІЇ
// ===============================================

export const stage3ApiRequestSchema = z.object({
  orderId: z.string().min(1, "ID замовлення обов'язковий"),
  stage3Data: orderParamsStage3Schema,
  timestamp: z.string().datetime().optional(),
});

export const stage3ApiResponseSchema = z.object({
  success: z.boolean(),
  data: orderParamsStage3Schema.optional(),
  errors: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

// ===============================================
// ЕКСПОРТ ТИПІВ
// ===============================================

export type UrgentExecution = z.infer<typeof urgentExecutionEnum>;
export type DiscountType = z.infer<typeof discountTypeEnum>;
export type PaymentMethod = z.infer<typeof paymentMethodEnum>;

export type ExecutionParams = z.infer<typeof executionParamsSchema>;
export type GlobalDiscounts = z.infer<typeof globalDiscountsSchema>;
export type PaymentProcessing = z.infer<typeof paymentProcessingSchema>;
export type AdditionalInfo = z.infer<typeof additionalInfoSchema>;

export type OrderParamsStage3 = z.infer<typeof orderParamsStage3Schema>;

export type ExecutionParamsForm = z.infer<typeof executionParamsFormSchema>;
export type GlobalDiscountsForm = z.infer<typeof globalDiscountsFormSchema>;
export type PaymentProcessingForm = z.infer<typeof paymentProcessingFormSchema>;
export type AdditionalInfoForm = z.infer<typeof additionalInfoFormSchema>;

export type Stage3ApiRequest = z.infer<typeof stage3ApiRequestSchema>;
export type Stage3ApiResponse = z.infer<typeof stage3ApiResponseSchema>;
