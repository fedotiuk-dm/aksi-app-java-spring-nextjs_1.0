import { Client } from '@/features/clients/types/client.types';
import { DiscountType, PaymentMethod, UrgencyType } from './order-details.types';

/**
 * Канали комунікації з клієнтом
 */
export enum CommunicationChannel {
  PHONE = 'PHONE',
  SMS = 'SMS',
  VIBER = 'VIBER'
}

/**
 * Структура для філій/пунктів прийому
 */
export interface ReceptionPoint {
  id: string;
  name: string;
  address?: string;
}

/**
 * Тип послуги у замовленні
 */
export interface OrderService {
  id?: string;                // ID послуги, коли вона вже збережена
  serviceCategoryId: string;  // ID категорії послуги
  priceListItemId: string;    // ID елемента прайс-листа
  serviceTypeId?: string;     // ID типу послуги (наприклад, прання, хімчистка тощо)
  name: string;               // Назва послуги
  quantity: number;           // Кількість
  unitPrice: number;          // Ціна за одиницю
  totalPrice: number;         // Загальна вартість
  params: Record<string, string | number | boolean>; // Додаткові параметри послуги (матеріал, тип забруднення тощо)
  notes?: string;             // Примітки до послуги
}

/**
 * Статус етапу у візарді
 */
export enum StepStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

/**
 * Базовий інтерфейс для етапів ордервізарда
 */
export interface WizardStep {
  id: string;
  title: string;
  status: StepStatus;
}

/**
 * Структура даних для зберігання стану ордервізарда
 */
/**
 * Базова інформація замовлення (етап 1 візарда)
 */
export interface OrderBasicInfo {
  receiptNumber?: string;    // Генерується автоматично
  uniqueTag: string;         // Унікальна мітка (вводиться або сканується)
  receptionPointId: string;  // ID пункту прийому
  createdAt?: string;        // Генерується автоматично
}

/**
 * Деталі замовлення (етап 3 візарда)
 */
export interface OrderDetails {
  receptionPoint: string;
  expectedCompletionDate: string;
  urgencyType: UrgencyType;
  discountType: DiscountType;
  customDiscountPercentage?: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  notes?: string;
  clientRequirements?: string;
}

export interface OrderWizardState {
  // Загальні дані
  orderId?: string;      // ID замовлення (якщо вже створено)
  client: Client | null; // Вибраний клієнт
  orderNote: string;     // Примітки до замовлення
  createdAt?: string;    // Дата створення
  
  // Базова інформація (етап 1)
  basicInfo: OrderBasicInfo;
  
  // Додаткові поля для форми клієнта
  isNewClientFormVisible: boolean;  // Показувати форму нового клієнта
  communicationChannels: CommunicationChannel[];  // Вибрані канали комунікації
  availableReceptionPoints: ReceptionPoint[]; // Доступні пункти прийому
  
  // Послуги
  services: OrderService[]; // Список послуг
  
  // Деталі замовлення (етап 3)
  orderDetails: OrderDetails;
  
  // Фінансова інформація
  subtotal: number;      // Проміжна сума
  discount: number;      // Знижка
  total: number;         // Загальна сума
  
  // Стан візарда
  currentStep: number;   // Поточний крок
  steps: WizardStep[];   // Список всіх кроків
  
  // Флаги
  isNewClient: boolean;  // Чи створюємо нового клієнта
  isCompleted: boolean;  // Чи завершено оформлення замовлення
}
