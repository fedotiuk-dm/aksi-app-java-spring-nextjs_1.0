/**
 * Хук для управління створенням замовлень в Order Wizard
 * Інкапсулює логіку створення реального замовлення після вибору клієнта і філії
 */

import { useState, useCallback } from 'react';

import { useWizardStore } from '../../wizard/store/wizard.store';
import { OrderRepository } from '../repositories/order.repository';
import { ExpediteType } from '../types';

import type { Order, OrderOperationResult } from '../types';

interface OrderCreationState {
  currentOrder: Order | null;
  isCreating: boolean;
  error: string | null;
  creationState: 'idle' | 'creating' | 'success' | 'error';
}

/**
 * Хук для створення замовлень в контексті Order Wizard
 */
export const useOrderCreation = () => {
  const [state, setState] = useState<OrderCreationState>({
    currentOrder: null,
    isCreating: false,
    error: null,
    creationState: 'idle',
  });

  /**
   * Створює нове замовлення для Order Wizard
   */
  const createOrderForWizard = useCallback(
    async (
      clientId: string,
      branchLocationId: string,
      tagNumber: string
    ): Promise<OrderOperationResult> => {
      console.log('🔍 useOrderCreation.createOrderForWizard викликано:', {
        clientId,
        branchLocationId,
        tagNumber,
      });

      setState((prev) => ({
        ...prev,
        isCreating: true,
        error: null,
        creationState: 'creating',
      }));

      try {
        // Створюємо об'єкт замовлення для передачі в репозиторій
        const orderToCreate: Partial<Order> = {
          tagNumber,
          clientId,
          branchLocationId,
          expectedCompletionDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
          customerNotes: 'Замовлення створено через Order Wizard',
          expediteType: ExpediteType.STANDARD,
          draft: true,
          items: [],
        };

        const orderRepository = new OrderRepository();
        const result = await orderRepository.create(orderToCreate as Order);

        if (result.success && result.order) {
          console.log('✅ Замовлення успішно створено:', result.order);

          // Оновлюємо orderId в wizard context
          const { updateContext } = useWizardStore.getState();
          updateContext({ orderId: result.order.id });

          setState((prev) => ({
            ...prev,
            currentOrder: result.order || null,
            isCreating: false,
            error: null,
            creationState: 'success',
          }));

          return {
            success: true,
            order: result.order,
            errors: null,
          };
        } else {
          console.error('❌ Помилка створення замовлення:', result.errors);

          const errorMessage = result.errors?.general || 'Невідома помилка створення замовлення';

          setState((prev) => ({
            ...prev,
            currentOrder: null,
            isCreating: false,
            error: errorMessage,
            creationState: 'error',
          }));

          return {
            success: false,
            order: null,
            errors: result.errors,
          };
        }
      } catch (error) {
        console.error('❌ Виняток при створенні замовлення:', error);

        const errorMessage =
          error instanceof Error ? error.message : 'Критична помилка створення замовлення';

        setState((prev) => ({
          ...prev,
          currentOrder: null,
          isCreating: false,
          error: errorMessage,
          creationState: 'error',
        }));

        return {
          success: false,
          order: null,
          errors: {
            general: errorMessage,
          },
        };
      }
    },
    []
  );

  /**
   * Скидає стан створення замовлення
   */
  const resetCreationState = useCallback(() => {
    console.log('🔄 Скидання стану створення замовлення');

    setState({
      currentOrder: null,
      isCreating: false,
      error: null,
      creationState: 'idle',
    });
  }, []);

  /**
   * Очищає помилку
   */
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    // Стан
    currentOrder: state.currentOrder,
    isCreating: state.isCreating,
    error: state.error,
    creationState: state.creationState,

    // Computed властивості
    hasOrder: state.currentOrder !== null,
    isSuccess: state.creationState === 'success',
    isError: state.creationState === 'error',
    isIdle: state.creationState === 'idle',

    // Методи
    createOrderForWizard,
    resetCreationState,
    clearError,
  };
};
