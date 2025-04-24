/**
 * Хук для роботи з XState машиною OrderWizard
 */
import { useEffect, useState, useCallback } from 'react';
import { createActor } from 'xstate';
import { orderWizardMachine } from '../../model/machine/orderWizard.machine';
import type { OrderItemUI } from '../../model/types/wizard.types';
import type { OrderCreateRequest } from '@/lib/api';
import type { ClientDTO } from '@/lib/api';

// Імпортуємо типи подій з машини станів
type OrderWizardEvent = 
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'RESET' }
  | { type: 'SELECT_CLIENT'; client: ClientDTO }
  | { type: 'CREATE_CLIENT'; client: ClientDTO }
  | { type: 'SAVE_BASIC_INFO'; data: Partial<OrderCreateRequest> }
  | { type: 'SAVE_ORDER_PARAMS'; params: Partial<OrderCreateRequest> }
  | { type: 'COMPLETE_ORDER' }
  | { type: 'ADD_ITEM' }
  | { type: 'EDIT_ITEM'; itemId: string }
  | { type: 'DELETE_ITEM'; itemId: string }
  | { type: 'SAVE_ITEM'; item: OrderItemUI }
  | { type: 'CANCEL_ITEM_EDIT' };

/**
 * Хук для роботи з машиною станів OrderWizard
 * Використовує сучасний підхід до інтеграції XState v5 з React
 */
export const useOrderWizardMachine = () => {
  // Створюємо і запускаємо XState актора
  const [machineActor] = useState(() => {
    const actor = createActor(orderWizardMachine);
    actor.start();
    return actor;
  });

  // Застосовуємо useState для відстеження змін стану машини
  const [snapshot, setSnapshot] = useState(machineActor.getSnapshot());

  // Підписуємось на зміни стану машини
  useEffect(() => {
    const subscription = machineActor.subscribe((state) => {
      console.log('Новий стан машини:', state.value);
      setSnapshot(state);
    });
    
    return () => subscription.unsubscribe();
  }, [machineActor]);

  // Зупиняємо актора при розмонтуванні компонента
  useEffect(() => {
    // Функція cleanup має повертати void або функцію без параметрів
    return () => { machineActor.stop(); };
  }, [machineActor]);

  // Функція для відправки подій до машини
  const send = useCallback(
    // Використовуємо тип подій з машини станів
    (event: OrderWizardEvent) => {
      console.log('Відправка події до XState:', event);
      machineActor.send(event);
    },
    [machineActor]
  );
  
  // Отримуємо контекст та поточний стан
  const { context } = snapshot;
  const currentState = snapshot.value as string;

  // Зручні геттери для отримання даних з контексту
  const client = context.client;
  const orderData = context.orderData;
  const items = context.items;
  const currentItem = context.currentItem;
  const itemWizardState = context.itemWizardState;
  
  // Функції для взаємодії з машиною станів
  const actions = {
    // Навігація
    goNext: () => send({ type: 'NEXT' }),
    goBack: () => send({ type: 'BACK' }),
    reset: () => send({ type: 'RESET' }),
    
    // Клієнт
    selectClient: (client: ClientDTO) => send({ type: 'SELECT_CLIENT', client }),
    createClient: (client: ClientDTO) => send({ type: 'CREATE_CLIENT', client }),
    
    // Замовлення
    saveBasicInfo: (data: Partial<OrderCreateRequest>) => send({ type: 'SAVE_BASIC_INFO', data }),
    saveOrderParams: (params: Partial<OrderCreateRequest>) => send({ type: 'SAVE_ORDER_PARAMS', params }),
    completeOrder: () => send({ type: 'COMPLETE_ORDER' }),
    
    // Предмети замовлення
    addItem: () => send({ type: 'ADD_ITEM' }),
    editItem: (itemId: string) => send({ type: 'EDIT_ITEM', itemId }),
    deleteItem: (itemId: string) => send({ type: 'DELETE_ITEM', itemId }),
    saveItem: (item: OrderItemUI) => send({ type: 'SAVE_ITEM', item }),
    cancelItemEdit: () => send({ type: 'CANCEL_ITEM_EDIT' }),
  };

  // Корисні функції-помічники
  const getters = {
    hasItems: () => items.length > 0,
    
    isOrderComplete: () => {
      // Перевірка відповідно до бізнес-правил
      return !!client && !!orderData?.urgencyType && items.length > 0;
    },
    
    isCurrentItemValid: () => {
      // Перевірка валідності поточного предмета
      return !!currentItem?.isValid;
    },
    
    getTotalCost: () => {
      // Обчислення загальної вартості замовлення
      return items.reduce((sum: number, item: OrderItemUI) => {
        return sum + (item.finalPrice || 0);
      }, 0);
    },
  };

  // Даємо додаткову інформацію про дебаг реактивності
  console.log('useOrderWizardMachine повертає стан:', currentState);
  
  return {
    state: snapshot,
    context,
    currentState,
    client, 
    orderData,
    items,
    currentItem,
    itemWizardState,
    actions,
    getters,
    // Додаємо сам актор для можливості прямого доступу
    actor: machineActor
  };
};