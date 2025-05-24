/**
 * @fileoverview XState події для Order Wizard - типізовані події для state machine
 * @module domain/wizard/shared/types/events
 * @author AKSI Team
 * @since 1.0.0
 *
 * @description
 * Повний набір подій для XState машини Order Wizard. Забезпечує строгу типізацію
 * всіх можливих подій які може обробляти wizard state machine.
 *
 * Категорії подій:
 * - Navigation Events: навігація між кроками wizard
 * - Validation Events: валідація даних кроків
 * - Save Events: збереження чернетки та автозбереження
 * - Control Events: управління lifecycle wizard
 * - Item Wizard Events: події циклічного підвізарда предметів
 *
 * Архітектурні принципи:
 * - Event-Driven: всі взаємодії через події
 * - Type Safety: строга типізація всіх подій
 * - Composition: базові інтерфейси + спеціалізовані події
 * - Immutability: всі події незмінні після створення
 *
 * @example
 * // Навігаційні події
 * const nextEvent: NavigationEvent = {
 *   type: 'NEXT',
 *   timestamp: new Date(),
 *   source: 'user-interaction'
 * };
 *
 * @example
 * // XState використання
 * send({ type: 'GOTO_STEP', targetStep: WizardStep.ORDER_PARAMETERS });
 * send({ type: 'START_ITEM_WIZARD', itemId: 'new-item' });
 *
 * @see {@link https://xstate.js.org/docs/guides/events.html} - XState Events
 * @see {@link ./wizard-common.types} - Основні типи wizard
 */

import { WizardStep, ItemWizardStep } from './wizard-common.types';

/**
 * Базова подія wizard з метаданими
 *
 * @interface BaseWizardEvent
 * @description
 * Спільний контракт для всіх подій wizard. Містить обов'язкове поле type
 * та опціональні метадані для логування та діагностики.
 *
 * @property {string} type - Тип події (обов'язковий)
 * @property {Date} [timestamp] - Час створення події
 * @property {string} [source] - Джерело події (user, system, api)
 *
 * @example
 * const event: BaseWizardEvent = {
 *   type: 'CUSTOM_EVENT',
 *   timestamp: new Date(),
 *   source: 'user-interaction'
 * };
 *
 * @since 1.0.0
 */
export interface BaseWizardEvent {
  type: string;
  timestamp?: Date;
  source?: string;
}

/**
 * Навігаційні події для переходів між кроками
 *
 * @interface NavigationEvent
 * @extends BaseWizardEvent
 * @description
 * Події для управління навігацією між кроками wizard та підкроками Item Wizard.
 * Забезпечують типобезпечні переходи та валідацію цільових станів.
 *
 * @property {'NEXT' | 'PREV' | 'GOTO_STEP' | 'GOTO_ITEM_STEP'} type - Тип навігаційної події
 * @property {WizardStep} [targetStep] - Цільовий крок wizard (для GOTO_STEP)
 * @property {ItemWizardStep} [targetItemStep] - Цільовий підкрок Item Wizard (для GOTO_ITEM_STEP)
 *
 * @example
 * // Перехід до наступного кроку
 * const nextEvent: NavigationEvent = {
 *   type: 'NEXT',
 *   timestamp: new Date()
 * };
 *
 * @example
 * // Перехід до конкретного кроку
 * const gotoEvent: NavigationEvent = {
 *   type: 'GOTO_STEP',
 *   targetStep: WizardStep.ORDER_PARAMETERS
 * };
 *
 * @since 1.0.0
 */
export interface NavigationEvent extends BaseWizardEvent {
  type: 'NEXT' | 'PREV' | 'GOTO_STEP' | 'GOTO_ITEM_STEP';
  targetStep?: WizardStep;
  targetItemStep?: ItemWizardStep;
}

/**
 * Події валідації даних кроків wizard
 *
 * @interface ValidationEvent
 * @extends BaseWizardEvent
 * @description
 * Події для управління валідацією даних на різних кроках wizard.
 * Забезпечують обробку результатів валідації та збір помилок.
 *
 * @property {'VALIDATE_STEP' | 'VALIDATION_SUCCESS' | 'VALIDATION_ERROR'} type - Тип валідаційної події
 * @property {WizardStep} [step] - Крок для валідації
 * @property {string[]} [errors] - Список помилок валідації
 * @property {string[]} [warnings] - Список попереджень
 *
 * @example
 * // Запуск валідації кроку
 * const validateEvent: ValidationEvent = {
 *   type: 'VALIDATE_STEP',
 *   step: WizardStep.CLIENT_SELECTION
 * };
 *
 * @example
 * // Результат невдалої валідації
 * const errorEvent: ValidationEvent = {
 *   type: 'VALIDATION_ERROR',
 *   errors: ['Клієнт не обраний', 'Телефон обов\'язковий']
 * };
 *
 * @since 1.0.0
 */
export interface ValidationEvent extends BaseWizardEvent {
  type: 'VALIDATE_STEP' | 'VALIDATION_SUCCESS' | 'VALIDATION_ERROR';
  step?: WizardStep;
  errors?: string[];
  warnings?: string[];
}

/**
 * Події збереження даних wizard
 *
 * @interface SaveEvent
 * @extends BaseWizardEvent
 * @description
 * Події для управління збереженням чернетки wizard та автозбереженням.
 * Забезпечують захист від втрати даних та синхронізацію з бекендом.
 *
 * @property {'SAVE_DRAFT' | 'AUTO_SAVE' | 'SAVE_SUCCESS' | 'SAVE_ERROR'} type - Тип події збереження
 * @property {unknown} [data] - Дані для збереження
 * @property {string} [error] - Повідомлення про помилку збереження
 *
 * @example
 * // Ручне збереження чернетки
 * const saveEvent: SaveEvent = {
 *   type: 'SAVE_DRAFT',
 *   data: { clientId: '123', items: [] }
 * };
 *
 * @example
 * // Автоматичне збереження
 * const autoSaveEvent: SaveEvent = {
 *   type: 'AUTO_SAVE',
 *   timestamp: new Date(),
 *   source: 'system'
 * };
 *
 * @since 1.0.0
 */
export interface SaveEvent extends BaseWizardEvent {
  type: 'SAVE_DRAFT' | 'AUTO_SAVE' | 'SAVE_SUCCESS' | 'SAVE_ERROR';
  data?: unknown;
  error?: string;
}

/**
 * Події управління lifecycle wizard
 *
 * @interface ControlEvent
 * @extends BaseWizardEvent
 * @description
 * Події для управління загальним життєвим циклом wizard:
 * ініціалізація, скидання, завершення та скасування.
 *
 * @property {'RESET' | 'INITIALIZE' | 'COMPLETE' | 'CANCEL'} type - Тип контрольної події
 * @property {unknown} [context] - Контекст для ініціалізації
 *
 * @example
 * // Скидання wizard до початкового стану
 * const resetEvent: ControlEvent = {
 *   type: 'RESET',
 *   source: 'user-action'
 * };
 *
 * @example
 * // Ініціалізація з існуючими даними
 * const initEvent: ControlEvent = {
 *   type: 'INITIALIZE',
 *   context: { orderId: '123', mode: 'edit' }
 * };
 *
 * @since 1.0.0
 */
export interface ControlEvent extends BaseWizardEvent {
  type: 'RESET' | 'INITIALIZE' | 'COMPLETE' | 'CANCEL';
  context?: unknown;
}

/**
 * Події циклічного Item Wizard
 *
 * @interface ItemWizardEvent
 * @extends BaseWizardEvent
 * @description
 * Спеціальні події для управління циклічним підвізардом додавання предметів.
 * Забезпечують початок, завершення та скасування процесу додавання предмета.
 *
 * @property {'START_ITEM_WIZARD' | 'COMPLETE_ITEM_WIZARD' | 'CANCEL_ITEM_WIZARD'} type - Тип події Item Wizard
 * @property {string} [itemId] - ID предмета (для редагування існуючого)
 * @property {unknown} [itemData] - Дані предмета (при завершенні)
 *
 * @example
 * // Початок додавання нового предмета
 * const startEvent: ItemWizardEvent = {
 *   type: 'START_ITEM_WIZARD',
 *   source: 'user-action'
 * };
 *
 * @example
 * // Завершення з збереженням предмета
 * const completeEvent: ItemWizardEvent = {
 *   type: 'COMPLETE_ITEM_WIZARD',
 *   itemData: { category: 'cleaning', price: 100 }
 * };
 *
 * @since 1.0.0
 */
export interface ItemWizardEvent extends BaseWizardEvent {
  type: 'START_ITEM_WIZARD' | 'COMPLETE_ITEM_WIZARD' | 'CANCEL_ITEM_WIZARD';
  itemId?: string;
  itemData?: unknown;
}

/**
 * Об'єднаний тип всіх подій wizard
 *
 * @typedef {NavigationEvent | ValidationEvent | SaveEvent | ControlEvent | ItemWizardEvent} WizardEvent
 * @description
 * Union type який включає всі можливі події wizard.
 * Використовується для типізації обробників подій та XState машини.
 *
 * @example
 * // Обробник подій wizard
 * function handleWizardEvent(event: WizardEvent) {
 *   switch (event.type) {
 *     case 'NEXT':
 *       return handleNavigation(event);
 *     case 'VALIDATE_STEP':
 *       return handleValidation(event);
 *     // ... інші події
 *   }
 * }
 *
 * @since 1.0.0
 */
export type WizardEvent =
  | NavigationEvent
  | ValidationEvent
  | SaveEvent
  | ControlEvent
  | ItemWizardEvent;

/**
 * Типи подій для зручності
 *
 * @typedef {WizardEvent['type']} WizardEventType
 * @description
 * Извлекает все возможные строковые типы событий из WizardEvent.
 * Полезно для создания switch statements и валидации.
 *
 * @example
 * const eventTypes: WizardEventType[] = ['NEXT', 'PREV', 'VALIDATE_STEP'];
 * const isValidType = (type: string): type is WizardEventType => {
 *   return eventTypes.includes(type as WizardEventType);
 * };
 *
 * @since 1.0.0
 */
export type WizardEventType = WizardEvent['type'];

/**
 * Конкретні події для XState машини
 *
 * @typedef XStateWizardEvent
 * @description
 * Спрощені події спеціально для XState машини без додаткових метаданих.
 * Забезпечує сумісність з XState API та оптимізовану продуктивність.
 *
 * @example
 * // Використання з XState
 * import { useMachine } from '@xstate/react';
 *
 * const [state, send] = useMachine(wizardMachine);
 *
 * // Відправка події
 * send({ type: 'NEXT' });
 * send({ type: 'GOTO_STEP', targetStep: WizardStep.ORDER_PARAMETERS });
 *
 * @since 1.0.0
 */
export type XStateWizardEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO_STEP'; targetStep: WizardStep }
  | { type: 'GOTO_ITEM_STEP'; targetItemStep: ItemWizardStep }
  | { type: 'VALIDATE_STEP'; step: WizardStep }
  | { type: 'VALIDATION_SUCCESS' }
  | { type: 'VALIDATION_ERROR'; errors: string[] }
  | { type: 'SAVE_DRAFT'; data?: unknown }
  | { type: 'AUTO_SAVE' }
  | { type: 'RESET' }
  | { type: 'INITIALIZE'; context: unknown }
  | { type: 'COMPLETE' }
  | { type: 'CANCEL' }
  | { type: 'START_ITEM_WIZARD'; itemId?: string }
  | { type: 'COMPLETE_ITEM_WIZARD'; itemData: unknown }
  | { type: 'CANCEL_ITEM_WIZARD' };
