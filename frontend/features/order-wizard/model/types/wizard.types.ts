/**
 * Типи, специфічні для UI-частини OrderWizard
 * Використовують OpenAPI типи як основу, але розширюють їх для потреб візарда
 */

import type { ClientDTO } from '@/lib/api';
import type { OrderItemDto } from '@/lib/api';
import type { OrderCreateRequest } from '@/lib/api';

/**
 * Стани головного візарда
 */
export type OrderWizardState =
  | 'clientSelection'   // Вибір або створення клієнта
  | 'basicInfo'         // Заповнення базової інформації
  | 'itemManagement'    // Головний екран списку предметів
  | 'orderParams'       // Загальні параметри замовлення
  | 'billing'           // Платіжна інформація та квитанція
  | 'complete';         // Завершення замовлення

/**
 * Підстани для етапу додавання/редагування предмета
 */
export type ItemWizardState =
  | 'idle'             // Початковий стан (менеджер предметів)
  | 'itemBasic'        // Основна інформація про предмет
  | 'itemProperties'   // Характеристики предмета
  | 'defects'          // Забруднення та дефекти
  | 'pricing'          // Розрахунок ціни
  | 'photos'           // Фотодокументація
  | 'summary';         // Підсумок інформації про предмет

/**
 * Розширення OrderItemDto для потреб UI
 */
export interface OrderItemUI extends OrderItemDto {
  /** Локальний ID для роботи на клієнті до збереження на сервері */
  localId?: string;
  /** Поточний стан валідації */
  isValid?: boolean;
  /** Помилки валідації */
  validationErrors?: Record<string, string>;
}

/**
 * Розширення ClientDTO для потреб UI
 */
export interface ClientUI extends ClientDTO {
  /** Чи вибраний клієнт */
  isSelected?: boolean;
  /** Повне ім'я клієнта (прізвище ім'я) */
  fullName?: string;
}

/**
 * Типи для подій визначено в файлі orderWizard.machine.ts
 * для уникнення дублювання
 */

/**
 * Контекст, який зберігається в машині станів XState
 */
export interface OrderWizardContext {
  /** Поточний клієнт */
  client?: ClientUI;
  /** Дані замовлення для відправки на бекенд */
  orderData: Partial<OrderCreateRequest>;
  /** Список предметів замовлення */
  items: OrderItemUI[];
  /** Поточний редагований предмет */
  currentItem?: OrderItemUI;
  /** Підстан для предметного візарда */
  itemWizardState: ItemWizardState;
  /** Історія переходів для предметного візарда */
  itemWizardHistory: ItemWizardState[];
}
// Кінець файлу wizard.types.ts
