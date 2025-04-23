import { Stage1Data } from '../stages/stage1-client/model/types';
import { OrderDto, ColorDto, ServiceCategoryDto, OrderItemDefectDto, MeasurementUnitDto, WearDegreeDto } from '@/lib/api';

/**
 * Загальні типи та інтерфейси для Order Wizard
 */

// Типи даних для етапу 2 (управління предметами)
export interface Stage2ItemData {
  id?: number;
  name: string;
  category: ServiceCategoryDto | null;
  quantity: number;
  unit: MeasurementUnitDto | null; // Одиниця виміру: штуки або кілограми
  wearDegree?: WearDegreeDto | null; // Ступінь зношеності
  color: ColorDto | null;
  defects: OrderItemDefectDto[];
  specialRequirements: string[];
  price: number;
  notes?: string;
  photoUrls?: string[];
}

export interface Stage2Data {
  items: Stage2ItemData[];
  totalPrice: number;
}

// Типи даних для етапу 3 (загальні параметри)
export interface Stage3Data {
  executionPriority: 'NORMAL' | 'URGENT' | 'EXPRESS'; // Терміновість виконання
  expectedCompletionDate: string; // Орієнтовна дата готовності
  deliveryMethod: 'SELF_PICKUP' | 'COURIER'; // Спосіб отримання замовлення
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID'; // Статус оплати
  paymentAmount?: number; // Сума оплати (якщо була оплата)
  discount?: number; // Знижка (у відсотках)
  customerNotes?: string; // Нотатки від клієнта
  internalNotes?: string; // Внутрішні нотатки працівників
}

// Типи даних для етапу 4 (підтвердження)
export interface Stage4Data {
  orderId?: number; // ID замовлення в системі після збереження
  receiptGenerated: boolean; // Чи була згенерована квитанція
  receiptUrl?: string; // URL для доступу до квитанції
  customerNotified: boolean; // Чи був клієнт повідомлений
  notificationMethod?: 'SMS' | 'EMAIL' | 'PHONE'; // Метод повідомлення
}

// Загальний стейт для всіх етапів візарда
export interface OrderWizardState {
  // Дані з усіх етапів
  stage1: Stage1Data | null;
  stage2: Stage2Data | null;
  stage3: Stage3Data | null;
  stage4: Stage4Data | null;
  currentStage: number;
  isComplete: boolean;
  
  // Додаткові поля для управління станом
  isSubmitting: boolean;
  errors: Record<string, string>;
  
  // Загальні дані для всього замовлення
  order?: OrderDto;
}

// Типи для кроків візарда
export enum OrderWizardStage {
  CLIENT_SELECTION = 0,
  ITEMS_MANAGEMENT = 1,
  GENERAL_PARAMETERS = 2,
  CONFIRMATION = 3
}

// Інтерфейс для компонентів етапів
export interface StageComponentProps<TData = unknown> {
  onComplete: (data: TData) => void;
  onNext: () => void;
  onBack?: () => void;
  initialData?: TData;
}

// Загальні статуси виконання операцій
export enum OperationStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Інтерфейс для чернетки замовлення
export interface OrderDraftDto {
  id: string;
  clientId?: string;
  clientName?: string;
  createdAt: string;
  updatedAt: string;
  draftData: string;
  createdBy: string;
  convertedToOrder: boolean;
  orderId?: string;
  draftName?: string;
}

// Інтерфейс для запиту на збереження чернетки
export interface OrderDraftRequest {
  clientId?: string;
  draftData: string;
  draftName?: string;
}
