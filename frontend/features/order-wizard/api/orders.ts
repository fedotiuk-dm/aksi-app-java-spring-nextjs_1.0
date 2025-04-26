import { useState } from 'react';
import { OrdersService, OrderDTO, OrderItemDTO } from '@/lib/api';
import type { CreateOrderRequest } from '@/lib/api';
import { Order, OrderItem } from '../model/types';
import type { UUID } from 'node:crypto';
import { useOrderWizardStatus } from '../model/store/store';
import dayjs from 'dayjs';

/**
 * Хук для роботи з API замовлень в Order Wizard
 */
export const useOrders = () => {
  const { withLoading } = useOrderWizardStatus();
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  /**
   * Створення нового замовлення
   */
  const createOrder = async (orderData: Omit<Order, 'id'>) => {
    return withLoading(async (): Promise<Order> => {
      // Підготовка даних замовлення у формат API
      const apiOrderData: CreateOrderRequest = {
        clientId: orderData.clientId,
        tagNumber: orderData.tagNumber,
        items: orderData.items.map(mapModelItemToApiItem),
        branchLocation: orderData.branchLocation,
        expectedCompletionDate: formatDate(orderData.expectedCompletionDate),
        customerNotes: orderData.customerNotes,
        internalNotes: orderData.internalNotes,
        express: orderData.express,
        draft: orderData.draft,
      };

      // Створення замовлення через API
      const response = await OrdersService.createOrder({
        requestBody: apiOrderData,
      });

      const mappedOrder = mapApiOrderToModelOrder(response);
      return mappedOrder;
    });
  };

  /**
   * Отримання замовлення за ID
   */
  const getOrderById = async (orderId: string) => {
    return withLoading(async (): Promise<Order> => {
      const response = await OrdersService.getOrderById({
        id: orderId,
      });

      const mappedOrder = mapApiOrderToModelOrder(response);
      setOrderDetails(mappedOrder);
      return mappedOrder;
    });
  };

  /**
   * Збереження чернетки замовлення
   */
  const saveOrderDraft = async (orderData: Omit<Order, 'id'>) => {
    return withLoading(async (): Promise<Order> => {
      // Підготовка даних замовлення у формат API, з позначкою як чернетки
      const apiOrderData: CreateOrderRequest = {
        clientId: orderData.clientId,
        tagNumber: orderData.tagNumber,
        items: orderData.items.map(mapModelItemToApiItem),
        branchLocation: orderData.branchLocation,
        expectedCompletionDate: formatDate(orderData.expectedCompletionDate),
        customerNotes: orderData.customerNotes,
        internalNotes: orderData.internalNotes,
        express: orderData.express,
        draft: true, // Завжди чернетка
      };

      // Збереження чернетки через API
      const response = await OrdersService.saveOrderDraft({
        requestBody: apiOrderData,
      });

      const mappedOrder = mapApiOrderToModelOrder(response);
      return mappedOrder;
    });
  };

  /**
   * Перетворення чернетки на активне замовлення
   */
  const convertDraftToOrder = async (orderId: string) => {
    return withLoading(async (): Promise<Order> => {
      const response = await OrdersService.convertDraftToOrder({
        id: orderId,
      });

      const mappedOrder = mapApiOrderToModelOrder(response);
      return mappedOrder;
    });
  };

  /**
   * Додавання знижки до замовлення
   */
  const applyDiscount = async (orderId: string, discountAmount: number) => {
    return withLoading(async (): Promise<Order> => {
      const response = await OrdersService.applyDiscount({
        id: orderId,
        amount: discountAmount,
      });

      const mappedOrder = mapApiOrderToModelOrder(response);
      return mappedOrder;
    });
  };

  /**
   * Додавання передоплати до замовлення
   */
  const addPrepayment = async (orderId: string, prepaymentAmount: number) => {
    return withLoading(async (): Promise<Order> => {
      const response = await OrdersService.addPrepayment({
        id: orderId,
        amount: prepaymentAmount,
      });

      const mappedOrder = mapApiOrderToModelOrder(response);
      return mappedOrder;
    });
  };

  /**
   * Форматування дати у строковий формат для API
   */
  const formatDate = (date?: Date | null): string | undefined => {
    if (!date) return undefined;
    return dayjs(date).format('YYYY-MM-DD');
  };

  /**
   * Перетворення предмета замовлення з нашої моделі в API формат
   */
  const mapModelItemToApiItem = (item: OrderItem): OrderItemDTO => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.quantity * item.unitPrice,
      category: item.category,
      color: item.color,
      material: item.material,
      defects: item.defects,
      specialInstructions: item.specialInstructions,
    };
  };

  /**
   * Перетворення замовлення з API формату в нашу модель
   */
  const mapApiOrderToModelOrder = (apiOrder: OrderDTO): Order => {
    return {
      id: apiOrder.id ? (String(apiOrder.id) as UUID) : undefined,
      clientId: apiOrder.client?.id
        ? (String(apiOrder.client.id) as UUID)
        : ('' as UUID), // Використовуємо порожній рядок як UUID для уникнення помилок типізації
      receiptNumber: apiOrder.receiptNumber,
      tagNumber: apiOrder.tagNumber,
      items:
        apiOrder.items?.map((item) => ({
          id: item.id ? (String(item.id) as UUID) : undefined,
          name: item.name || '',
          description: item.description,
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          totalPrice:
            item.totalPrice || (item.quantity || 1) * (item.unitPrice || 0),
          category: item.category,
          color: item.color,
          material: item.material,
          defects: item.defects,
          specialInstructions: item.specialInstructions,
        })) || [],
      totalAmount: apiOrder.totalAmount || 0,
      discountAmount: apiOrder.discountAmount || 0,
      finalAmount: apiOrder.finalAmount || 0,
      prepaymentAmount: apiOrder.prepaymentAmount || 0,
      balanceAmount: apiOrder.balanceAmount || 0,
      branchLocation: apiOrder.branchLocation || '',
      status: apiOrder.status
        ? (String(apiOrder.status) as Order['status'])
        : undefined,
      expectedCompletionDate: apiOrder.expectedCompletionDate
        ? new Date(apiOrder.expectedCompletionDate)
        : undefined,
      completedDate: apiOrder.completedDate
        ? new Date(apiOrder.completedDate)
        : undefined,
      createdDate: apiOrder.createdDate
        ? new Date(apiOrder.createdDate)
        : undefined,
      updatedDate: apiOrder.updatedDate
        ? new Date(apiOrder.updatedDate)
        : undefined,
      customerNotes: apiOrder.customerNotes,
      internalNotes: apiOrder.internalNotes,
      express: apiOrder.express || false,
      draft: apiOrder.draft || false,
    };
  };

  return {
    orderDetails,
    createOrder,
    getOrderById,
    saveOrderDraft,
    convertDraftToOrder,
    applyDiscount,
    addPrepayment,
  };
};
