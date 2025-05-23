/**
 * Типи для модуля Status (Статуси та історія змін)
 */

import type { OrderStatus } from '../order.types';

/**
 * Історія змін статусу замовлення
 */
export interface OrderStatusHistory {
  id?: string;
  orderId: string;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  changedAt: Date;
  changedBy?: string;
  reason?: string;
  notes?: string;
  automaticChange: boolean;
  durationInPreviousStatus?: number; // в мілісекундах
}

/**
 * Можливі переходи статусів
 */
export interface StatusTransition {
  from: OrderStatus;
  to: OrderStatus;
  allowed: boolean;
  requiresReason: boolean;
  requiresApproval: boolean;
  autoTransitionConditions?: TransitionCondition[];
  validationRules?: TransitionValidationRule[];
}

/**
 * Умова автоматичного переходу
 */
export interface TransitionCondition {
  type: 'TIME_ELAPSED' | 'ALL_ITEMS_COMPLETED' | 'PAYMENT_RECEIVED' | 'APPROVAL_GIVEN';
  value?: number | string;
  description: string;
}

/**
 * Правило валідації переходу
 */
export interface TransitionValidationRule {
  type: 'ITEMS_COMPLETE' | 'PAYMENT_CONFIRMED' | 'QUALITY_CHECK' | 'CUSTOMER_APPROVAL';
  required: boolean;
  message: string;
}

/**
 * Результат валідації переходу статусу
 */
export interface StatusTransitionValidation {
  isValid: boolean;
  allowedTransitions: OrderStatus[];
  blockedTransitions: OrderStatus[];
  warnings: StatusWarning[];
  errors: StatusError[];
  requiredActions: RequiredAction[];
}

/**
 * Попередження статусу
 */
export interface StatusWarning {
  type: 'INCOMPLETE_ITEMS' | 'PENDING_PAYMENT' | 'OVERDUE' | 'MISSING_PHOTOS';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  affectedItems?: string[];
}

/**
 * Помилка статусу
 */
export interface StatusError {
  type: 'INVALID_TRANSITION' | 'MISSING_REQUIREMENTS' | 'PERMISSION_DENIED' | 'SYSTEM_ERROR';
  message: string;
  code: string;
  blockingAction?: string;
}

/**
 * Необхідна дія
 */
export interface RequiredAction {
  type: 'COMPLETE_ITEMS' | 'COLLECT_PAYMENT' | 'UPLOAD_PHOTOS' | 'CUSTOMER_SIGNATURE';
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedTime?: number; // в хвилинах
  assignedTo?: string;
}

/**
 * Конфігурація статусів
 */
export interface StatusConfiguration {
  status: OrderStatus;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  isTerminal: boolean; // Чи є кінцевим статусом
  requiresAction: boolean; // Чи потребує дій
  allowedNextStatuses: OrderStatus[];
  autoTransitions: StatusAutoTransition[];
  notifications: StatusNotification[];
}

/**
 * Автоматичний перехід статусу
 */
export interface StatusAutoTransition {
  toStatus: OrderStatus;
  conditions: TransitionCondition[];
  delay?: number; // Затримка в хвилинах
  enabled: boolean;
}

/**
 * Сповіщення про статус
 */
export interface StatusNotification {
  type: 'CLIENT' | 'STAFF' | 'MANAGER';
  method: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  template: string;
  delay?: number; // Затримка в хвилинах
  enabled: boolean;
}

/**
 * Прогрес замовлення
 */
export interface OrderProgress {
  orderId: string;
  currentStatus: OrderStatus;
  progressPercentage: number;
  milestones: ProgressMilestone[];
  estimatedCompletion: Date;
  timeInCurrentStatus: number; // в хвилинах
  totalProcessingTime: number; // в хвилинах
}

/**
 * Віха прогресу
 */
export interface ProgressMilestone {
  status: OrderStatus;
  name: string;
  completedAt?: Date;
  isCompleted: boolean;
  isCurrent: boolean;
  estimatedDate?: Date;
  actualDuration?: number; // в хвилинах
}

/**
 * Метрики статусів
 */
export interface StatusMetrics {
  orderId: string;
  timeInStatus: Record<OrderStatus, number>; // в хвилинах
  transitionCounts: Record<string, number>; // "FROM_TO": count
  averageStatusDuration: Record<OrderStatus, number>;
  bottlenecks: StatusBottleneck[];
  efficiency: StatusEfficiency;
}

/**
 * Вузьке місце в процесі
 */
export interface StatusBottleneck {
  status: OrderStatus;
  averageDuration: number;
  maxDuration: number;
  affectedOrders: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestions: string[];
}

/**
 * Ефективність процесу
 */
export interface StatusEfficiency {
  overallScore: number; // 0-100
  timeEfficiency: number; // 0-100
  transitionEfficiency: number; // 0-100
  bottleneckImpact: number; // 0-100
  recommendations: string[];
}

/**
 * Пакетна зміна статусу
 */
export interface BatchStatusUpdate {
  orderIds: string[];
  toStatus: OrderStatus;
  reason?: string;
  notes?: string;
  performedBy?: string;
  scheduledFor?: Date;
}

/**
 * Результат пакетної зміни
 */
export interface BatchStatusUpdateResult {
  successful: string[]; // IDs успішно оновлених замовлень
  failed: BatchUpdateError[]; // Помилки
  warnings: BatchUpdateWarning[];
  summary: BatchUpdateSummary;
}

/**
 * Помилка пакетного оновлення
 */
export interface BatchUpdateError {
  orderId: string;
  error: StatusError;
  skipped: boolean;
}

/**
 * Попередження пакетного оновлення
 */
export interface BatchUpdateWarning {
  orderId: string;
  warning: StatusWarning;
  processed: boolean;
}

/**
 * Підсумок пакетного оновлення
 */
export interface BatchUpdateSummary {
  totalOrders: number;
  successfulUpdates: number;
  failedUpdates: number;
  warnings: number;
  totalTime: number; // в мілісекундах
}
