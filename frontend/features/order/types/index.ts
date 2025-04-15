export enum OrderStatus {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export interface OrderItem {
  serviceId: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface Order {
  id: string;
  clientId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  notes?: string;
  scheduledDate: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  clientId: string;
  items: OrderItem[];
  notes?: string;
  scheduledDate: string;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  items?: OrderItem[];
  notes?: string;
  scheduledDate?: string;
  completedDate?: string;
}
