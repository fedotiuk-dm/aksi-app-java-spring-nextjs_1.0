/**
 * Типи для модуля Completion (Виконання та терміни)
 */

import type { ExpediteType } from '../order.types';

/**
 * Варіанти терміновості замовлення
 */
export type UrgencyOption =
  | 'STANDARD' // Звичайне виконання
  | 'URGENT_48H' // Терміново за 48 годин (+50%)
  | 'URGENT_24H' // Терміново за 24 години (+100%)
  | 'CUSTOM'; // Індивідуальний термін

/**
 * Інформація про завершення замовлення
 */
export interface OrderCompletion {
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  expediteType: ExpediteType;
  standardDays: number; // Стандартний термін в днях
  expediteDays: number; // Термін з урахуванням терміновості
  workingDaysOnly: boolean; // Тільки робочі дні
  completionComments?: string;
  readyForPickup: boolean;
  deliveredAt?: Date;
}

/**
 * Запит на оновлення параметрів виконання
 */
export interface UpdateCompletionRequest {
  orderId: string;
  expediteType: ExpediteType;
  expectedCompletionDate: Date;
  comments?: string;
}

/**
 * Параметри розрахунку дати завершення
 */
export interface CompletionCalculationParams {
  serviceCategories: string[]; // Категорії послуг
  expediteType: ExpediteType;
  branchId: string;
  excludeWeekends?: boolean;
  excludeHolidays?: boolean;
  customBusinessHours?: BusinessHours;
}

/**
 * Робочі години
 */
export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

/**
 * Години роботи на день
 */
export interface DayHours {
  isWorkingDay: boolean;
  openTime?: string; // "09:00"
  closeTime?: string; // "18:00"
  breakStart?: string; // "13:00"
  breakEnd?: string; // "14:00"
}

/**
 * Результат розрахунку дати завершення
 */
export interface CompletionCalculationResult {
  expectedDate: Date;
  standardDays: number;
  actualDays: number;
  expediteMultiplier: number;
  expediteAmount: number;
  breakdown: CompletionBreakdown;
  warnings: string[];
}

/**
 * Деталізація розрахунку терміну
 */
export interface CompletionBreakdown {
  serviceTypeMinDays: Record<string, number>;
  maxServiceDays: number;
  expediteAdjustment: number;
  finalDays: number;
  startDate: Date;
  endDate: Date;
  weekendsSkipped: number;
  holidaysSkipped: number;
}

/**
 * Статус готовності замовлення
 */
export enum ReadinessStatus {
  NOT_STARTED = 'NOT_STARTED', // Не розпочато
  IN_PROCESS = 'IN_PROCESS', // В процесі
  READY = 'READY', // Готово
  DELIVERED = 'DELIVERED', // Видано
  OVERDUE = 'OVERDUE', // Прострочено
}

/**
 * Інформація про готовність
 */
export interface OrderReadiness {
  status: ReadinessStatus;
  expectedDate: Date;
  actualReadyDate?: Date;
  daysRemaining: number;
  isOverdue: boolean;
  overdueByDays: number;
  progressPercentage: number;
  estimatedCompletionTime?: Date;
}

/**
 * Нагадування про замовлення
 */
export interface OrderReminder {
  orderId: string;
  type: 'COMPLETION' | 'PICKUP' | 'OVERDUE';
  scheduledDate: Date;
  sent: boolean;
  sentAt?: Date;
  method: 'EMAIL' | 'SMS' | 'CALL';
  recipientId: string;
}

/**
 * Календарне планування
 */
export interface OrderSchedule {
  orderId: string;
  startDate: Date;
  milestones: OrderMilestone[];
  dependencies: OrderDependency[];
  resourceAllocation: ResourceAllocation[];
}

/**
 * Віха замовлення
 */
export interface OrderMilestone {
  id: string;
  name: string;
  expectedDate: Date;
  actualDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  dependencies: string[];
}

/**
 * Залежність замовлення
 */
export interface OrderDependency {
  fromMilestone: string;
  toMilestone: string;
  type: 'FINISH_TO_START' | 'START_TO_START' | 'FINISH_TO_FINISH';
  lag: number; // в годинах
}

/**
 * Розподіл ресурсів
 */
export interface ResourceAllocation {
  resourceId: string;
  resourceType: 'EQUIPMENT' | 'STAFF' | 'WORKSPACE';
  allocatedFrom: Date;
  allocatedTo: Date;
  utilizationPercentage: number;
}

/**
 * Статистика виконання
 */
export interface CompletionStats {
  averageCompletionDays: number;
  onTimeCompletionRate: number;
  expediteUsageRate: number;
  overdueOrders: number;
  byExpediteType: Record<ExpediteType, CompletionTypeStats>;
}

/**
 * Статистика по типу терміновості
 */
export interface CompletionTypeStats {
  count: number;
  averageDays: number;
  onTimeRate: number;
  averageDelay: number;
}
