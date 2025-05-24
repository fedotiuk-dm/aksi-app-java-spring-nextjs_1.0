/**
 * @fileoverview Загальні утиліти для Order Wizard - допоміжні функції загального призначення
 * @module domain/wizard/shared/utils/wizard
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Набір універсальних утилітарних функцій для Order Wizard, які забезпечують:
 * - Генерацію унікальних ідентифікаторів та номерів
 * - Форматування даних для відображення
 * - Розрахунки прогресу wizard та валідації
 * - Операції з об'єктами та масивами
 * - Контроль продуктивності (debounce, throttle)
 * - Безпечний доступ до вкладених властивостей
 *
 * Принципи реалізації:
 * - Pure Functions: всі функції без побічних ефектів
 * - Type Safety: строга типізація всіх параметрів та результатів
 * - Immutability: збереження незмінності вхідних даних
 * - Performance: оптимізовані алгоритми для частого використання
 * - Reusability: універсальні функції для повторного використання
 *
 * @example
 * // Генерація ідентифікаторів
 * import { generateId, generateReceiptNumber } from '@/domain/wizard/shared/utils';
 *
 * const orderId = generateId();
 * const receiptNumber = generateReceiptNumber();
 *
 * @example
 * // Форматування для UI
 * import { formatPrice, formatDate, formatPhone } from '@/domain/wizard/shared/utils';
 *
 * const priceText = formatPrice(150.50); // "150,50 ₴"
 * const dateText = formatDate(new Date()); // "15 січня 2024 р."
 * const phoneText = formatPhone('+380501234567'); // "+38 (050) 123-45-67"
 *
 * @example
 * // Розрахунки wizard
 * import { calculateWizardProgress, isStepValid } from '@/domain/wizard/shared/utils';
 *
 * const progress = calculateWizardProgress(currentStep, completedSteps);
 * const isValid = isStepValid(WizardStep.CLIENT_SELECTION, stepValidations);
 *
 * @see {@link ./wizard-common.types} - Основні типи wizard
 * @see {@link ../constants/wizard.constants} - Константи wizard
 */

import {
  WIZARD_STEPS_ORDER,
  ITEM_WIZARD_STEPS_ORDER,
  getStepIndex,
  getItemStepIndex,
} from '../constants/steps.constants';
import {
  WizardStep,
  ItemWizardStep,
  ValidationStatus,
  WizardOperationResult,
  WizardStepState,
} from '../types/wizard-common.types';

/**
 * Генерує унікальний ідентифікатор на основі timestamp та випадкових символів
 *
 * @function generateId
 * @description
 * Створює унікальний ID який складається з timestamp та випадкового рядка.
 * Забезпечує високу ймовірність унікальності навіть при паралельному створенні.
 *
 * @returns {string} Унікальний ідентифікатор формату "timestamp-randomString"
 *
 * @example
 * const orderId = generateId(); // "1704067200000-x7k3mp9q2"
 * const itemId = generateId(); // "1704067200001-b8j4nv7x5"
 *
 * @example
 * // Використання для створення унікальних ключів
 * const uniqueItems = items.map(item => ({
 *   ...item,
 *   id: generateId()
 * }));
 *
 * @since 1.0.0
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Генерує номер квитанції для замовлення
 *
 * @function generateReceiptNumber
 * @description
 * Створює номер квитанції з префіксом, timestamp та випадковими символами.
 * Формат забезпечує читабельність та унікальність для операторів хімчистки.
 *
 * @returns {string} Номер квитанції формату "RC" + 8 цифр timestamp + 4 літери
 *
 * @example
 * const receiptNumber = generateReceiptNumber(); // "RC67200000ABCD"
 * console.log('Номер квитанції:', receiptNumber);
 *
 * @example
 * // Використання при створенні замовлення
 * const newOrder = {
 *   receiptNumber: generateReceiptNumber(),
 *   clientId: selectedClientId,
 *   items: []
 * };
 *
 * @since 1.0.0
 */
export const generateReceiptNumber = (): string => {
  const prefix = 'RC';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

/**
 * Генерує ідентифікатор сесії wizard
 *
 * @function generateSessionId
 * @description
 * Створює унікальний ідентифікатор сесії wizard для відстеження та логування.
 * Використовується для діагностики та аналітики роботи користувачів.
 *
 * @returns {string} Ідентифікатор сесії з префіксом "session_"
 *
 * @example
 * const sessionId = generateSessionId(); // "session_1704067200000_x7k3mp9q2b8j"
 * logger.info('Нова сесія wizard', { sessionId });
 *
 * @example
 * // Використання в контексті wizard
 * const wizardContext = {
 *   sessionId: generateSessionId(),
 *   startedAt: new Date().toISOString(),
 *   mode: WizardMode.CREATE
 * };
 *
 * @since 1.0.0
 */
export const generateSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${random}`;
};

/**
 * Форматує дату для відображення в українській локалі
 *
 * @function formatDate
 * @description
 * Перетворює дату в читабельний формат для українських користувачів.
 * Підтримує як об'єкти Date, так і рядкові представлення дат.
 *
 * @param {Date | string} date - Дата для форматування
 * @returns {string} Відформатована дата у форматі "день місяць рік"
 *
 * @example
 * const date = new Date('2024-01-15');
 * const formatted = formatDate(date); // "15 січня 2024 р."
 *
 * @example
 * // Використання з ISO рядком
 * const isoDate = '2024-12-31T23:59:59.000Z';
 * const dateText = formatDate(isoDate); // "31 грудня 2024 р."
 *
 * @example
 * // В UI компонентах
 * <Typography>
 *   Дата виконання: {formatDate(order.executionDate)}
 * </Typography>
 *
 * @since 1.0.0
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Форматує дату та час для відображення в українській локалі
 *
 * @function formatDateTime
 * @description
 * Перетворює дату і час в читабельний формат для українських користувачів.
 * Включає повну інформацію про дату та час до хвилин.
 *
 * @param {Date | string} date - Дата та час для форматування
 * @returns {string} Відформатована дата та час у форматі "день місяць рік, година:хвилина"
 *
 * @example
 * const now = new Date();
 * const formatted = formatDateTime(now); // "15 січня 2024 р., 14:30"
 *
 * @example
 * // Логування з часом
 * console.log(`Замовлення створено: ${formatDateTime(order.createdAt)}`);
 *
 * @example
 * // Відображення в квитанції
 * const receiptTime = formatDateTime(order.completedAt);
 * return `Квитанція створена: ${receiptTime}`;
 *
 * @since 1.0.0
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Форматує ціну в українській валюті
 *
 * @function formatPrice
 * @description
 * Перетворює числове значення ціни в читабельний формат з символом гривні.
 * Використовує українську локаль та стандартне форматування валюти.
 *
 * @param {number} amount - Сума для форматування
 * @returns {string} Відформатована ціна з символом валюти
 *
 * @example
 * const price = formatPrice(150.50); // "150,50 ₴"
 * const total = formatPrice(0); // "0,00 ₴"
 * const bigAmount = formatPrice(1500.75); // "1 500,75 ₴"
 *
 * @example
 * // В таблиці предметів
 * {items.map(item => (
 *   <TableRow key={item.id}>
 *     <TableCell>{item.name}</TableCell>
 *     <TableCell>{formatPrice(item.price)}</TableCell>
 *   </TableRow>
 * ))}
 *
 * @example
 * // Розрахунок загальної суми
 * const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
 * const totalText = formatPrice(totalAmount);
 *
 * @since 1.0.0
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Форматує номер телефону в українському стандарті
 *
 * @function formatPhone
 * @description
 * Перетворює номер телефону в стандартний український формат з дужками та дефісами.
 * Автоматично визначає український формат за кодом країни 38.
 *
 * @param {string} phone - Номер телефону для форматування
 * @returns {string} Відформатований номер телефону або оригінальний рядок
 *
 * @example
 * const phone1 = formatPhone('380501234567'); // "+38 (050) 123-45-67"
 * const phone2 = formatPhone('+380671234567'); // "+38 (067) 123-45-67"
 * const phone3 = formatPhone('0501234567'); // "0501234567" (без змін)
 *
 * @example
 * // Відображення в UI
 * <Typography>
 *   Телефон: {formatPhone(client.phone)}
 * </Typography>
 *
 * @example
 * // Форматування для квитанції
 * const clientInfo = {
 *   ...client,
 *   displayPhone: formatPhone(client.phone)
 * };
 *
 * @since 1.0.0
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('38')) {
    const national = cleaned.slice(2);
    return `+38 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6, 8)}-${national.slice(8, 10)}`;
  }
  return phone;
};

/**
 * Розраховує прогрес виконання основного wizard
 *
 * @function calculateWizardProgress
 * @description
 * Обчислює відсоток завершення wizard на основі поточного кроку та завершених кроків.
 * Враховує часткове виконання поточного кроку (50% за початок кроку).
 *
 * @param {WizardStep} currentStep - Поточний крок wizard
 * @param {WizardStep[]} completedSteps - Масив завершених кроків
 * @returns {number} Прогрес у відсотках (0-100)
 *
 * @example
 * const progress = calculateWizardProgress(
 *   WizardStep.ITEM_MANAGER,
 *   [WizardStep.CLIENT_SELECTION, WizardStep.BRANCH_SELECTION]
 * ); // повертає 50% (2 завершені + 0.5 поточний) / 5 всього * 100
 *
 * @example
 * // Використання в прогрес-барі
 * const wizardProgress = calculateWizardProgress(currentStep, completedSteps);
 * <LinearProgress variant="determinate" value={wizardProgress} />
 *
 * @since 1.0.0
 */
export const calculateWizardProgress = (
  currentStep: WizardStep,
  completedSteps: WizardStep[]
): number => {
  const currentIndex = getStepIndex(currentStep);
  const completedCount = completedSteps.length;
  const totalSteps = WIZARD_STEPS_ORDER.length;

  // Прогрес = (завершені кроки + прогрес поточного кроку) / загальна кількість
  const currentStepProgress = currentIndex >= 0 ? 0.5 : 0; // 50% за початок кроку
  return ((completedCount + currentStepProgress) / totalSteps) * 100;
};

/**
 * Розраховує прогрес виконання Item Wizard (підвізард)
 *
 * @function calculateItemWizardProgress
 * @description
 * Обчислює відсоток завершення підвізарда додавання предмета.
 * Працює аналогічно до основного wizard але для 5 кроків Item Wizard.
 *
 * @param {ItemWizardStep} currentStep - Поточний підкрок Item Wizard
 * @param {ItemWizardStep[]} completedSteps - Масив завершених підкроків
 * @returns {number} Прогрес у відсотках (0-100)
 *
 * @example
 * const itemProgress = calculateItemWizardProgress(
 *   ItemWizardStep.ITEM_PROPERTIES,
 *   [ItemWizardStep.ITEM_BASIC_INFO]
 * ); // повертає 30% (1 завершений + 0.5 поточний) / 5 всього * 100
 *
 * @example
 * // Використання в UI підвізарда
 * const itemWizardProgress = calculateItemWizardProgress(currentItemStep, completedItemSteps);
 * <Stepper activeStep={getCurrentItemStepIndex()} />
 *
 * @since 1.0.0
 */
export const calculateItemWizardProgress = (
  currentStep: ItemWizardStep,
  completedSteps: ItemWizardStep[]
): number => {
  const currentIndex = getItemStepIndex(currentStep);
  const completedCount = completedSteps.length;
  const totalSteps = ITEM_WIZARD_STEPS_ORDER.length;

  const currentStepProgress = currentIndex >= 0 ? 0.5 : 0;
  return ((completedCount + currentStepProgress) / totalSteps) * 100;
};

/**
 * Перевіряє валідність конкретного кроку wizard
 *
 * @function isStepValid
 * @description
 * Визначає чи пройшов крок валідацію успішно на основі збереженого стану валідації.
 * Перевіряє як прапорець isValid, так і статус валідації.
 *
 * @param {WizardStep} step - Крок для перевірки
 * @param {Record<WizardStep, WizardStepState>} stepValidations - Об'єкт з валідаціями всіх кроків
 * @returns {boolean} true якщо крок валідний, false в іншому випадку
 *
 * @example
 * const isClientValid = isStepValid(WizardStep.CLIENT_SELECTION, stepValidations);
 * if (!isClientValid) {
 *   setError('Спочатку оберіть клієнта');
 *   return;
 * }
 *
 * @example
 * // Перевірка перед переходом
 * const canProceed = isStepValid(currentStep, stepValidations);
 * <Button disabled={!canProceed} onClick={goToNextStep}>
 *   Далі
 * </Button>
 *
 * @since 1.0.0
 */
export const isStepValid = (
  step: WizardStep,
  stepValidations: Record<WizardStep, WizardStepState>
): boolean => {
  const validation = stepValidations[step];
  return validation?.isValid === true && validation?.validationStatus === ValidationStatus.VALID;
};

/**
 * Збирає всі помилки валідації з усіх кроків wizard
 *
 * @function getAllValidationErrors
 * @description
 * Агрегує помилки валідації з усіх кроків wizard в один масив.
 * Корисно для відображення всіх проблем які потребують вирішення.
 *
 * @param {Record<WizardStep, WizardStepState>} stepValidations - Об'єкт з валідаціями всіх кроків
 * @returns {string[]} Масив всіх помилок валідації
 *
 * @example
 * const allErrors = getAllValidationErrors(stepValidations);
 * if (allErrors.length > 0) {
 *   showErrorDialog('Виправте помилки:', allErrors);
 * }
 *
 * @example
 * // Відображення в UI
 * const errors = getAllValidationErrors(stepValidations);
 * {errors.map((error, index) => (
 *   <Alert key={index} severity="error">{error}</Alert>
 * ))}
 *
 * @since 1.0.0
 */
export const getAllValidationErrors = (
  stepValidations: Record<WizardStep, WizardStepState>
): string[] => {
  const errors: string[] = [];

  Object.values(stepValidations).forEach((validation) => {
    if (validation.errors && Array.isArray(validation.errors)) {
      errors.push(...validation.errors);
    }
  });

  return errors;
};

/**
 * Перевіряє можливість переходу до наступного кроку
 *
 * @function canProceedToNextStep
 * @description
 * Визначає чи може користувач переходити до наступного кроку wizard
 * на основі валідації поточного кроку.
 *
 * @param {WizardStep} currentStep - Поточний крок wizard
 * @param {Record<WizardStep, WizardStepState>} stepValidations - Об'єкт з валідаціями всіх кроків
 * @returns {boolean} true якщо можна переходити далі, false в іншому випадку
 *
 * @example
 * const canGo = canProceedToNextStep(currentStep, stepValidations);
 * setCanGoNext(canGo);
 *
 * @example
 * // Використання в навігації
 * const handleNext = () => {
 *   if (canProceedToNextStep(currentStep, stepValidations)) {
 *     goToNextStep();
 *   } else {
 *     showValidationErrors();
 *   }
 * };
 *
 * @since 1.0.0
 */
export const canProceedToNextStep = (
  currentStep: WizardStep,
  stepValidations: Record<WizardStep, WizardStepState>
): boolean => {
  return isStepValid(currentStep, stepValidations);
};

/**
 * Створює стандартизований результат операції wizard
 *
 * @function createOperationResult
 * @template T - Тип даних результату
 * @description
 * Фабрика для створення узгоджених результатів операцій wizard.
 * Забезпечує стандартний формат відповідей для всіх операцій.
 *
 * @param {boolean} success - Чи успішна операція
 * @param {T} [data] - Дані результату (опціональні)
 * @param {string[]} [errors] - Масив помилок (опціональний)
 * @param {string[]} [warnings] - Масив попереджень (опціональний)
 * @returns {WizardOperationResult<T>} Стандартизований результат операції
 *
 * @example
 * // Успішний результат з даними
 * const result = createOperationResult(true, { orderId: '123' });
 * return result; // { success: true, data: { orderId: '123' } }
 *
 * @example
 * // Результат з помилками
 * const errorResult = createOperationResult(
 *   false,
 *   undefined,
 *   ['Клієнт не обраний', 'Телефон обов\'язковий']
 * );
 *
 * @example
 * // В async функціях
 * async function saveOrder(orderData) {
 *   try {
 *     const savedOrder = await api.saveOrder(orderData);
 *     return createOperationResult(true, savedOrder);
 *   } catch (error) {
 *     return createOperationResult(false, undefined, [error.message]);
 *   }
 * }
 *
 * @since 1.0.0
 */
export const createOperationResult = <T = void>(
  success: boolean,
  data?: T,
  errors?: string[],
  warnings?: string[]
): WizardOperationResult<T> => {
  return {
    success,
    data,
    errors,
    warnings,
  };
};

/**
 * Створює debounced версію функції для контролю частоти викликів
 *
 * @function debounce
 * @template T - Тип функції
 * @description
 * Затримує виконання функції до закінчення паузи у викликах.
 * Корисно для оптимізації пошуку та валідації при введенні тексту.
 *
 * @param {T} func - Функція для debounce
 * @param {number} delay - Затримка в мілісекундах
 * @returns {(...args: Parameters<T>) => void} Debounced версія функції
 *
 * @example
 * // Debounced пошук клієнтів
 * const debouncedSearch = debounce((searchTerm: string) => {
 *   searchClients(searchTerm);
 * }, 300);
 *
 * // Використання в input onChange
 * <TextField onChange={(e) => debouncedSearch(e.target.value)} />
 *
 * @example
 * // Debounced валідація
 * const debouncedValidate = debounce(() => {
 *   validateCurrentStep();
 * }, 500);
 *
 * @since 1.0.0
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Створює throttled версію функції для обмеження частоти викликів
 *
 * @function throttle
 * @template T - Тип функції
 * @description
 * Обмежує частоту викликів функції до максимум одного разу на період.
 * Корисно для обробки подій scroll, resize та інших частих подій.
 *
 * @param {T} func - Функція для throttle
 * @param {number} delay - Мінімальний інтервал між викликами в мілісекундах
 * @returns {(...args: Parameters<T>) => void} Throttled версія функції
 *
 * @example
 * // Throttled обробник scroll
 * const throttledScroll = throttle(() => {
 *   updateScrollPosition();
 * }, 100);
 *
 * window.addEventListener('scroll', throttledScroll);
 *
 * @example
 * // Throttled автозбереження
 * const throttledAutoSave = throttle(() => {
 *   saveDraft();
 * }, 5000);
 *
 * @since 1.0.0
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Створює глибоку копію об'єкта зі збереженням всіх типів
 *
 * @function deepClone
 * @template T - Тип об'єкта
 * @description
 * Рекурсивно клонує об'єкт включаючи вкладені об'єкти, масиви та дати.
 * Забезпечує повну незалежність клонованого об'єкта від оригіналу.
 *
 * @param {T} obj - Об'єкт для клонування
 * @returns {T} Глибока копія об'єкта
 *
 * @example
 * const originalOrder = {
 *   id: '123',
 *   client: { name: 'Іван', contacts: ['phone', 'email'] },
 *   createdAt: new Date()
 * };
 *
 * const clonedOrder = deepClone(originalOrder);
 * clonedOrder.client.name = 'Петро'; // оригінал не змінюється
 *
 * @example
 * // Клонування стану для іммутабельних оновлень
 * const newState = {
 *   ...deepClone(currentState),
 *   selectedClient: updatedClient
 * };
 *
 * @since 1.0.0
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
};

/**
 * Перевіряє чи є об'єкт порожнім (null, undefined, порожній рядок, масив чи об'єкт)
 *
 * @function isEmpty
 * @description
 * Універсальна перевірка на "порожність" для різних типів даних.
 * Враховує специфіку кожного типу (trim для рядків, length для масивів).
 *
 * @param {unknown} obj - Значення для перевірки
 * @returns {boolean} true якщо об'єкт порожній, false в іншому випадку
 *
 * @example
 * console.log(isEmpty(null)); // true
 * console.log(isEmpty('')); // true
 * console.log(isEmpty('   ')); // true (trim)
 * console.log(isEmpty([])); // true
 * console.log(isEmpty({})); // true
 * console.log(isEmpty('text')); // false
 * console.log(isEmpty([1, 2])); // false
 *
 * @example
 * // Валідація полів форми
 * if (isEmpty(formData.clientName)) {
 *   setError('Ім\'я клієнта обов\'язкове');
 * }
 *
 * @example
 * // Перевірка результатів пошуку
 * if (isEmpty(searchResults)) {
 *   showMessage('Клієнтів не знайдено');
 * }
 *
 * @since 1.0.0
 */
export const isEmpty = (obj: unknown): boolean => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim() === '';
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Безпечно отримує значення вкладеної властивості об'єкта
 *
 * @function get
 * @description
 * Дозволяє безпечно отримувати значення з глибоко вкладених об'єктів
 * без ризику отримання помилки "Cannot read property of undefined".
 *
 * @param {unknown} obj - Об'єкт для доступу
 * @param {string} path - Шлях до властивості (розділений крапками)
 * @param {unknown} [defaultValue] - Значення за замовчуванням
 * @returns {unknown} Значення властивості або defaultValue
 *
 * @example
 * const order = {
 *   client: {
 *     contacts: {
 *       phone: '+380501234567'
 *     }
 *   }
 * };
 *
 * const phone = get(order, 'client.contacts.phone'); // '+380501234567'
 * const email = get(order, 'client.contacts.email', 'Не вказано'); // 'Не вказано'
 *
 * @example
 * // Безпечний доступ до API відповідей
 * const clientName = get(apiResponse, 'data.client.firstName', 'Невідомий');
 * const itemsCount = get(apiResponse, 'data.items.length', 0);
 *
 * @since 1.0.0
 */
export const get = (obj: unknown, path: string, defaultValue?: unknown): unknown => {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object' || !(key in result)) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return result;
};

/**
 * Розраховує прогрес за кроком
 *
 * @function calculateProgress
 * @description
 * Обчислює відсоток завершення wizard на основі поточного кроку.
 *
 * @param {WizardStep} step - Поточний крок wizard
 * @returns {number} Прогрес у відсотках (0-100)
 *
 * @example
 * const progress = calculateProgress(WizardStep.ITEM_MANAGER); // повертає 50% (2 завершені + 0.5 поточний) / 5 всього * 100
 *
 * @since 1.0.0
 */
export const calculateProgress = (step: WizardStep): number => {
  const steps = Object.values(WizardStep);
  const index = steps.indexOf(step);
  return Math.round((index / (steps.length - 1)) * 100);
};

/**
 * Отримує наступний крок
 *
 * @function getNextStep
 * @description
 * Повертає наступний крок wizard на основі поточного кроку.
 *
 * @param {WizardStep} currentStep - Поточний крок wizard
 * @returns {WizardStep | null} Наступний крок або null якщо крок останній
 *
 * @example
 * const nextStep = getNextStep(WizardStep.ITEM_MANAGER); // повертає WizardStep.ITEM_MANAGER
 *
 * @since 1.0.0
 */
export const getNextStep = (currentStep: WizardStep): WizardStep | null => {
  const steps = Object.values(WizardStep);
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
};

/**
 * Отримує попередній крок
 *
 * @function getPrevStep
 * @description
 * Повертає попередній крок wizard на основі поточного кроку.
 *
 * @param {WizardStep} currentStep - Поточний крок wizard
 * @returns {WizardStep | null} Попередній крок або null якщо крок перший
 *
 * @example
 * const prevStep = getPrevStep(WizardStep.ITEM_MANAGER); // повертає WizardStep.ITEM_MANAGER
 *
 * @since 1.0.0
 */
export const getPrevStep = (currentStep: WizardStep): WizardStep | null => {
  const steps = Object.values(WizardStep);
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex > 0 ? steps[currentIndex - 1] : null;
};

/**
 * Перевіряє чи є крок завершеним
 *
 * @function isStepCompleted
 * @description
 * Перевіряє чи заданий крок є завершеним на основі масиву завершених кроків.
 *
 * @param {WizardStep} step - Крок для перевірки
 * @param {WizardStep[]} completedSteps - Масив завершених кроків
 * @returns {boolean} true якщо крок завершений, false в іншому випадку
 *
 * @example
 * const isItemManagerCompleted = isStepCompleted(WizardStep.ITEM_MANAGER, completedSteps); // повертає true або false
 *
 * @since 1.0.0
 */
export const isStepCompleted = (step: WizardStep, completedSteps: WizardStep[]): boolean => {
  return completedSteps.includes(step);
};

/**
 * Отримує загальну кількість кроків
 *
 * @function getTotalSteps
 * @description
 * Повертає загальну кількість кроків wizard.
 *
 * @returns {number} Загальна кількість кроків
 *
 * @example
 * const totalSteps = getTotalSteps(); // повертає 5
 *
 * @since 1.0.0
 */
export const getTotalSteps = (): number => {
  return Object.values(WizardStep).length;
};
