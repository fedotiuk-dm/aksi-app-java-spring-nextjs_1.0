/**
 * @fileoverview Константи кроків Order Wizard - визначення порядку, назв та утилітарних функцій кроків
 * @module domain/wizard/shared/constants/steps
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Центральне місце для визначення структури та логіки кроків Order Wizard.
 * Включає конфігурацію основних кроків wizard та підкроків Item Wizard.
 *
 * Структура кроків:
 * - 5 основних кроків Order Wizard
 * - 5 підкроків Item Wizard (циклічний підпроцес)
 * - Назви та описи кроків для UI
 * - Логіка навігації між кроками
 * - Валідація обов'язковості кроків
 *
 * Принципи організації:
 * - Чіткий порядок виконання кроків
 * - Гнучка навігація (вперед/назад)
 * - Валідація обов'язковості кроків
 * - Автоматичний розрахунок прогресу
 * - Підтримка локалізації назв та описів
 *
 * @example
 * // Отримання порядку кроків
 * import { WIZARD_STEPS_ORDER, getNextStep } from '@/domain/wizard/shared/constants/steps';
 *
 * const currentStep = WizardStep.CLIENT_SELECTION;
 * const nextStep = getNextStep(currentStep); // WizardStep.BRANCH_SELECTION
 *
 * @example
 * // Розрахунок прогресу
 * import { calculateProgress } from '@/domain/wizard/shared/constants/steps';
 *
 * const progress = calculateProgress(WizardStep.ITEM_MANAGER); // 60%
 *
 * @example
 * // Отримання назв для UI
 * import { WIZARD_STEP_LABELS } from '@/domain/wizard/shared/constants/steps';
 *
 * const stepName = WIZARD_STEP_LABELS[WizardStep.CLIENT_SELECTION]; // "Вибір клієнта"
 *
 * @see {@link ../types/wizard-common.types} - Типи кроків WizardStep та ItemWizardStep
 * @see {@link ./wizard.constants} - Загальні константи wizard
 */

import { WizardStep, ItemWizardStep } from '../types/wizard-common.types';

/**
 * Порядок виконання основних кроків Order Wizard
 *
 * @constant {WizardStep[]} WIZARD_STEPS_ORDER
 * @readonly
 * @description
 * Масив кроків Order Wizard у правильному порядку виконання.
 * Використовується для навігації, валідації та відображення прогресу.
 *
 * Послідовність кроків відповідає бізнес-логіці процесу оформлення замовлення:
 * 1. CLIENT_SELECTION - вибір або створення клієнта
 * 2. BRANCH_SELECTION - вибір філії та ініціація замовлення
 * 3. ITEM_MANAGER - додавання предметів до замовлення
 * 4. ORDER_PARAMETERS - налаштування параметрів виконання
 * 5. ORDER_CONFIRMATION - підтвердження та завершення
 *
 * @example
 * // Перевірка кількості кроків
 * console.log('Всього кроків:', WIZARD_STEPS_ORDER.length); // 5
 *
 * @example
 * // Ітерація по всіх кроках
 * WIZARD_STEPS_ORDER.forEach((step, index) => {
 *   console.log(`Крок ${index + 1}:`, step);
 * });
 *
 * @example
 * // Використання в UI навігації
 * {WIZARD_STEPS_ORDER.map((step, index) => (
 *   <Step key={step} active={currentStep === step}>
 *     {WIZARD_STEP_LABELS[step]}
 *   </Step>
 * ))}
 *
 * @since 1.0.0
 */
export const WIZARD_STEPS_ORDER: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_PARAMETERS,
  WizardStep.ORDER_CONFIRMATION,
];

/**
 * Порядок виконання підкроків Item Wizard
 *
 * @constant {ItemWizardStep[]} ITEM_WIZARD_STEPS_ORDER
 * @readonly
 * @description
 * Масив підкроків для додавання/редагування предмета в Order Wizard.
 * Цей процес циклічний - може повторюватись для кожного предмета.
 *
 * Послідовність підкроків відповідає логіці детального опису предмета:
 * 1. ITEM_BASIC_INFO - категорія, назва, кількість
 * 2. ITEM_PROPERTIES - матеріал, колір, наповнювач, знос
 * 3. DEFECTS_STAINS - плями, дефекти, ризики
 * 4. PRICE_CALCULATOR - модифікатори та розрахунок ціни
 * 5. PHOTO_DOCUMENTATION - фотодокументація предмета
 *
 * @example
 * // Відображення прогресу підвізарда
 * const itemProgress = (currentItemStep / ITEM_WIZARD_STEPS_ORDER.length) * 100;
 *
 * @example
 * // Навігація в підвізарді
 * const currentIndex = ITEM_WIZARD_STEPS_ORDER.indexOf(currentItemStep);
 * const nextItemStep = ITEM_WIZARD_STEPS_ORDER[currentIndex + 1];
 *
 * @since 1.0.0
 */
export const ITEM_WIZARD_STEPS_ORDER: ItemWizardStep[] = [
  ItemWizardStep.ITEM_BASIC_INFO,
  ItemWizardStep.ITEM_PROPERTIES,
  ItemWizardStep.DEFECTS_STAINS,
  ItemWizardStep.PRICE_CALCULATOR,
  ItemWizardStep.PHOTO_DOCUMENTATION,
];

/**
 * Назви кроків для відображення в UI
 *
 * @constant {Record<WizardStep, string>} WIZARD_STEP_LABELS
 * @readonly
 * @description
 * Українські назви кроків для відображення в користувацькому інтерфейсі.
 * Забезпечує консистентність найменувань в усьому додатку.
 *
 * @property {string} CLIENT_SELECTION - "Вибір клієнта"
 * @property {string} BRANCH_SELECTION - "Вибір філії"
 * @property {string} ITEM_MANAGER - "Управління предметами"
 * @property {string} ORDER_PARAMETERS - "Параметри замовлення"
 * @property {string} ORDER_CONFIRMATION - "Підтвердження"
 *
 * @example
 * // Відображення назви поточного кроку
 * const currentStepName = WIZARD_STEP_LABELS[currentStep];
 * return <Typography variant="h4">{currentStepName}</Typography>;
 *
 * @example
 * // Хлібні крихти
 * const breadcrumbs = WIZARD_STEPS_ORDER.map(step => ({
 *   label: WIZARD_STEP_LABELS[step],
 *   active: step === currentStep
 * }));
 *
 * @since 1.0.0
 */
export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Вибір клієнта',
  [WizardStep.BRANCH_SELECTION]: 'Вибір філії',
  [WizardStep.ITEM_MANAGER]: 'Управління предметами',
  [WizardStep.ORDER_PARAMETERS]: 'Параметри замовлення',
  [WizardStep.ORDER_CONFIRMATION]: 'Підтвердження',
};

/**
 * Назви підкроків Item Wizard для відображення в UI
 *
 * @constant {Record<ItemWizardStep, string>} ITEM_WIZARD_STEP_LABELS
 * @readonly
 * @description
 * Українські назви підкроків додавання предмета для UI.
 * Використовуються в stepper компонентах та заголовках сторінок.
 *
 * @property {string} ITEM_BASIC_INFO - "Основна інформація"
 * @property {string} ITEM_PROPERTIES - "Властивості предмета"
 * @property {string} DEFECTS_STAINS - "Дефекти та плями"
 * @property {string} PRICE_CALCULATOR - "Розрахунок ціни"
 * @property {string} PHOTO_DOCUMENTATION - "Фотодокументація"
 *
 * @example
 * // Stepper для підвізарда
 * {ITEM_WIZARD_STEPS_ORDER.map((step, index) => (
 *   <Step key={step} completed={completedSteps.includes(step)}>
 *     <StepLabel>{ITEM_WIZARD_STEP_LABELS[step]}</StepLabel>
 *   </Step>
 * ))}
 *
 * @since 1.0.0
 */
export const ITEM_WIZARD_STEP_LABELS: Record<ItemWizardStep, string> = {
  [ItemWizardStep.ITEM_BASIC_INFO]: 'Основна інформація',
  [ItemWizardStep.ITEM_PROPERTIES]: 'Властивості предмета',
  [ItemWizardStep.DEFECTS_STAINS]: 'Дефекти та плями',
  [ItemWizardStep.PRICE_CALCULATOR]: 'Розрахунок ціни',
  [ItemWizardStep.PHOTO_DOCUMENTATION]: 'Фотодокументація',
};

/**
 * Короткі описи кроків для підказок користувачу
 *
 * @constant {Record<WizardStep, string>} WIZARD_STEP_DESCRIPTIONS
 * @readonly
 * @description
 * Описи кроків що пояснюють користувачу що потрібно зробити на кожному етапі.
 * Використовуються в підказках, tooltip та інструкціях.
 *
 * @property {string} CLIENT_SELECTION - Опис кроку вибору клієнта
 * @property {string} BRANCH_SELECTION - Опис кроку вибору філії
 * @property {string} ITEM_MANAGER - Опис кроку управління предметами
 * @property {string} ORDER_PARAMETERS - Опис кроку параметрів замовлення
 * @property {string} ORDER_CONFIRMATION - Опис кроку підтвердження
 *
 * @example
 * // Підказка для поточного кроку
 * const stepDescription = WIZARD_STEP_DESCRIPTIONS[currentStep];
 * return <Alert severity="info">{stepDescription}</Alert>;
 *
 * @example
 * // Tooltip для кроку в навігації
 * <Tooltip title={WIZARD_STEP_DESCRIPTIONS[step]}>
 *   <Button>{WIZARD_STEP_LABELS[step]}</Button>
 * </Tooltip>
 *
 * @since 1.0.0
 */
export const WIZARD_STEP_DESCRIPTIONS: Record<WizardStep, string> = {
  [WizardStep.CLIENT_SELECTION]: 'Оберіть існуючого клієнта або створіть нового',
  [WizardStep.BRANCH_SELECTION]: 'Оберіть філію для оформлення замовлення',
  [WizardStep.ITEM_MANAGER]: 'Додайте предмети до замовлення',
  [WizardStep.ORDER_PARAMETERS]: 'Встановіть параметри виконання та оплати',
  [WizardStep.ORDER_CONFIRMATION]: 'Перевірте та підтвердіть замовлення',
};

/**
 * Обов'язкові кроки які не можна пропустити
 *
 * @constant {WizardStep[]} REQUIRED_STEPS
 * @readonly
 * @description
 * Масив кроків які обов'язково потрібно пройти для завершення wizard.
 * Використовується для валідації можливості завершення процесу.
 *
 * ORDER_PARAMETERS не включений як обов'язковий, оскільки може мати значення за замовчуванням.
 *
 * @example
 * // Перевірка чи можна завершити wizard
 * const canComplete = REQUIRED_STEPS.every(step =>
 *   completedSteps.includes(step)
 * );
 *
 * @example
 * // Валідація перед переходом до підтвердження
 * const missingSteps = REQUIRED_STEPS.filter(step =>
 *   !isStepValid(step, validationState)
 * );
 *
 * @since 1.0.0
 */
export const REQUIRED_STEPS: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_CONFIRMATION,
];

/**
 * Обов'язкові підкроки Item Wizard
 *
 * @constant {ItemWizardStep[]} REQUIRED_ITEM_STEPS
 * @readonly
 * @description
 * Мінімальний набір підкроків необхідних для створення предмета.
 * DEFECTS_STAINS та PHOTO_DOCUMENTATION є опціональними.
 *
 * @example
 * // Валідація предмета перед додаванням
 * const isItemValid = REQUIRED_ITEM_STEPS.every(step =>
 *   isItemStepCompleted(step, itemData)
 * );
 *
 * @since 1.0.0
 */
export const REQUIRED_ITEM_STEPS: ItemWizardStep[] = [
  ItemWizardStep.ITEM_BASIC_INFO,
  ItemWizardStep.ITEM_PROPERTIES,
  ItemWizardStep.PRICE_CALCULATOR,
];

/**
 * Кроки які можуть мати незбережені зміни
 *
 * @constant {WizardStep[]} STEPS_WITH_UNSAVED_CHANGES
 * @readonly
 * @description
 * Кроки на яких користувач може ввести дані що потребують збереження.
 * Використовується для попередження про втрату даних при виході.
 *
 * @example
 * // Перевірка чи є незбережені зміни
 * const hasUnsavedChanges = STEPS_WITH_UNSAVED_CHANGES.includes(currentStep)
 *   && hasFormChanges;
 *
 * if (hasUnsavedChanges) {
 *   const shouldContinue = confirm('Є незбережені зміни. Продовжити?');
 * }
 *
 * @since 1.0.0
 */
export const STEPS_WITH_UNSAVED_CHANGES: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.ITEM_MANAGER,
  WizardStep.ORDER_PARAMETERS,
];

/**
 * Кроки які потребують API валідації
 *
 * @constant {WizardStep[]} STEPS_WITH_API_VALIDATION
 * @readonly
 * @description
 * Кроки на яких потрібно викликати API для валідації даних.
 * Використовується для вирішення коли показувати індикатори завантаження.
 *
 * @example
 * // Асинхронна валідація кроку
 * if (STEPS_WITH_API_VALIDATION.includes(currentStep)) {
 *   setIsValidating(true);
 *   await validateStepWithAPI(currentStep, stepData);
 *   setIsValidating(false);
 * }
 *
 * @since 1.0.0
 */
export const STEPS_WITH_API_VALIDATION: WizardStep[] = [
  WizardStep.CLIENT_SELECTION,
  WizardStep.BRANCH_SELECTION,
  WizardStep.ITEM_MANAGER,
];

/**
 * Отримує індекс кроку в загальному порядку
 *
 * @function getStepIndex
 * @description
 * Повертає позицію кроку в масиві WIZARD_STEPS_ORDER.
 * Використовується для навігації та розрахунку прогресу.
 *
 * @param {WizardStep} step - Крок для якого потрібно знайти індекс
 * @returns {number} Індекс кроку (0-based) або -1 якщо крок не знайдено
 *
 * @example
 * const index = getStepIndex(WizardStep.ITEM_MANAGER); // 2
 * const isFirstStep = getStepIndex(currentStep) === 0;
 * const isLastStep = getStepIndex(currentStep) === WIZARD_STEPS_ORDER.length - 1;
 *
 * @example
 * // Розрахунок позиції в UI
 * const stepPosition = getStepIndex(currentStep) + 1; // 1-based для користувача
 * return `Крок ${stepPosition} з ${WIZARD_STEPS_ORDER.length}`;
 *
 * @since 1.0.0
 */
export const getStepIndex = (step: WizardStep): number => {
  return WIZARD_STEPS_ORDER.indexOf(step);
};

/**
 * Отримує індекс підкроку Item Wizard
 *
 * @function getItemStepIndex
 * @description
 * Повертає позицію підкроку в масиві ITEM_WIZARD_STEPS_ORDER.
 * Використовується для навігації в підвізарді додавання предмета.
 *
 * @param {ItemWizardStep} step - Підкрок для якого потрібно знайти індекс
 * @returns {number} Індекс підкроку (0-based) або -1 якщо підкрок не знайдено
 *
 * @example
 * const itemIndex = getItemStepIndex(ItemWizardStep.PRICE_CALCULATOR); // 3
 * const itemProgress = (getItemStepIndex(currentItemStep) + 1) / ITEM_WIZARD_STEPS_ORDER.length * 100;
 *
 * @since 1.0.0
 */
export const getItemStepIndex = (step: ItemWizardStep): number => {
  return ITEM_WIZARD_STEPS_ORDER.indexOf(step);
};

/**
 * Отримує наступний крок в послідовності
 *
 * @function getNextStep
 * @description
 * Повертає наступний крок після поточного або null якщо це останній крок.
 * Використовується для навігації "Далі".
 *
 * @param {WizardStep} currentStep - Поточний крок
 * @returns {WizardStep | null} Наступний крок або null якщо це останній
 *
 * @example
 * const nextStep = getNextStep(WizardStep.CLIENT_SELECTION);
 * // WizardStep.BRANCH_SELECTION
 *
 * @example
 * // Кнопка "Далі"
 * const handleNext = () => {
 *   const next = getNextStep(currentStep);
 *   if (next) {
 *     navigateToStep(next);
 *   } else {
 *     completeWizard();
 *   }
 * };
 *
 * @example
 * // Перевірка чи можна йти далі
 * const canGoNext = getNextStep(currentStep) !== null;
 * <Button disabled={!canGoNext} onClick={handleNext}>Далі</Button>
 *
 * @since 1.0.0
 */
export const getNextStep = (currentStep: WizardStep): WizardStep | null => {
  const currentIndex = getStepIndex(currentStep);
  const nextIndex = currentIndex + 1;
  return nextIndex < WIZARD_STEPS_ORDER.length ? WIZARD_STEPS_ORDER[nextIndex] : null;
};

/**
 * Отримує попередній крок в послідовності
 *
 * @function getPrevStep
 * @description
 * Повертає попередній крок перед поточним або null якщо це перший крок.
 * Використовується для навігації "Назад".
 *
 * @param {WizardStep} currentStep - Поточний крок
 * @returns {WizardStep | null} Попередній крок або null якщо це перший
 *
 * @example
 * const prevStep = getPrevStep(WizardStep.BRANCH_SELECTION);
 * // WizardStep.CLIENT_SELECTION
 *
 * @example
 * // Кнопка "Назад"
 * const handlePrev = () => {
 *   const prev = getPrevStep(currentStep);
 *   if (prev) {
 *     navigateToStep(prev);
 *   }
 * };
 *
 * @example
 * // Перевірка чи можна йти назад
 * const canGoBack = getPrevStep(currentStep) !== null;
 * <Button disabled={!canGoBack} onClick={handlePrev}>Назад</Button>
 *
 * @since 1.0.0
 */
export const getPrevStep = (currentStep: WizardStep): WizardStep | null => {
  const currentIndex = getStepIndex(currentStep);
  const prevIndex = currentIndex - 1;
  return prevIndex >= 0 ? WIZARD_STEPS_ORDER[prevIndex] : null;
};

/**
 * Перевіряє чи є крок обов'язковим
 *
 * @function isStepRequired
 * @description
 * Визначає чи входить крок до списку обов'язкових для завершення wizard.
 * Використовується для валідації та UI індикації.
 *
 * @param {WizardStep} step - Крок для перевірки
 * @returns {boolean} true якщо крок обов'язковий, false в іншому випадку
 *
 * @example
 * const isRequired = isStepRequired(WizardStep.ORDER_PARAMETERS); // false
 * const isClientRequired = isStepRequired(WizardStep.CLIENT_SELECTION); // true
 *
 * @example
 * // Відображення обов'язковості в UI
 * const stepLabel = WIZARD_STEP_LABELS[step];
 * const displayLabel = isStepRequired(step) ? `${stepLabel} *` : stepLabel;
 *
 * @example
 * // Валідація перед завершенням
 * const allRequiredCompleted = REQUIRED_STEPS.every(step =>
 *   isStepCompleted(step)
 * );
 *
 * @since 1.0.0
 */
export const isStepRequired = (step: WizardStep): boolean => {
  return REQUIRED_STEPS.includes(step);
};

/**
 * Розраховує прогрес виконання wizard у відсотках
 *
 * @function calculateProgress
 * @description
 * Обчислює відсоток завершення wizard на основі поточного кроку.
 * Вважає що кожен крок має однакову вагу.
 *
 * @param {WizardStep} currentStep - Поточний крок wizard
 * @returns {number} Прогрес у відсотках (0-100)
 *
 * @example
 * const progress = calculateProgress(WizardStep.ITEM_MANAGER); // 60
 * <LinearProgress variant="determinate" value={progress} />
 *
 * @example
 * // Текстове відображення прогресу
 * const progressText = `${Math.round(calculateProgress(currentStep))}% завершено`;
 *
 * @example
 * // Умовне відображення на основі прогресу
 * const progress = calculateProgress(currentStep);
 * const showSuccessMessage = progress >= 80;
 *
 * @since 1.0.0
 */
export const calculateProgress = (currentStep: WizardStep): number => {
  const currentIndex = getStepIndex(currentStep);
  return ((currentIndex + 1) / WIZARD_STEPS_ORDER.length) * 100;
};
