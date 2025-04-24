/**
 * XState машина станів для OrderWizard
 */
import { createMachine, assign } from 'xstate';
import type { OrderWizardContext, ItemWizardState } from '../types/wizard.types';
import type { ClientDTO } from '@/lib/api';
import type { OrderCreateRequest } from '@/lib/api';
import type { OrderItemUI } from '../types/wizard.types';

/**
 * Початковий контекст для машини станів
 */
export const initialContext: OrderWizardContext = {
  orderData: {},
  items: [],
  itemWizardState: 'idle',
  itemWizardHistory: [],
};

/**
 * Типи подій для машини станів
 */
export type OrderWizardEvent =
  // Навігаційні події
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'RESET' }
  
  // Події для етапу вибору клієнта
  | { type: 'CLIENT_SEARCH_STARTED'; criteria: { query: string } }
  | { type: 'CLIENT_SEARCH_SUCCEEDED'; clients: ClientDTO[] }
  | { type: 'CLIENT_SEARCH_FAILED'; error: string }
  | { type: 'SELECT_CLIENT'; client: ClientDTO }
  | { type: 'CREATE_CLIENT'; client: ClientDTO }
  | { type: 'TOGGLE_CLIENT_FORM_MODE'; mode: 'search' | 'create' }
  
  // Події для етапу базової інформації
  | { type: 'SAVE_BASIC_INFO'; data: Partial<OrderCreateRequest> }
  | { type: 'BASIC_INFO_ERROR'; errors: Record<string, string> }
  | { type: 'SET_BRANCH_OFFICE'; branchOfficeId: string }
  | { type: 'SET_TAG_NUMBER'; tagNumber: string }
  
  // Події для етапу управління предметами
  | { type: 'ADD_ITEM' }
  | { type: 'EDIT_ITEM'; itemId: string }
  | { type: 'DELETE_ITEM'; itemId: string }
  | { type: 'SAVE_ITEM'; item: OrderItemUI }
  | { type: 'CANCEL_ITEM_EDIT' }
  
  // Події для етапу параметрів замовлення
  | { type: 'SAVE_ORDER_PARAMS'; params: Partial<OrderCreateRequest> }
  
  // Події завершення
  | { type: 'COMPLETE_ORDER' };

/**
 * Машина станів OrderWizard
 */
export const orderWizardMachine = createMachine({
  /** Ідентифікатор машини */
  id: 'orderWizard',
  
  /** Визначення типів для контексту та подій */
  types: {} as {
    context: OrderWizardContext;
    events: OrderWizardEvent;
    input: undefined;
    output: undefined;
    actions: undefined;
    guards: undefined;
    actors: undefined;
  },
  
  /** Початковий стан */
  initial: 'clientSelection',
  
  /** Початковий контекст */
  context: initialContext,
  
  /** Стани машини */
  states: {
    // Етап 1.1: Вибір або створення клієнта
    clientSelection: {
      on: {
        SELECT_CLIENT: {
          target: 'basicInfo',
          actions: assign({
            client: ({ event }) => ({
              ...event.client,
              isSelected: true
            }),
          }),
        },
        CREATE_CLIENT: {
          target: 'basicInfo',
          actions: assign({
            client: ({ event }) => ({
              ...event.client,
              isSelected: true
            }),
          }),
        },
      },
    },
    
    // Етап 1.2: Базова інформація замовлення
    basicInfo: {
      on: {
        BACK: {
          target: 'clientSelection',
        },
        SAVE_BASIC_INFO: {
          target: 'itemManagement',
          actions: assign({
            orderData: ({ context, event }) => ({
              ...context.orderData,
              ...event.data,
            }),
          }),
          guard: ({ context }) => !!context.client && !!context.client.id,
        },
      },
    },
    
    // Етап 2.0: Головний екран менеджера предметів
    itemManagement: {
      on: {
        BACK: {
          target: 'basicInfo',
        },
        ADD_ITEM: {
          actions: [
            assign({
              itemWizardState: () => 'itemBasic' as ItemWizardState,
              itemWizardHistory: () => ['idle'] as ItemWizardState[],
            }),
          ],
        },
        EDIT_ITEM: {
          actions: [
            assign({
              currentItem: ({ context, event }) => {
                return context.items.find((item) => item.localId === event.itemId);
              },
              itemWizardState: () => 'itemBasic' as ItemWizardState,
              itemWizardHistory: () => ['idle'] as ItemWizardState[],
            }),
          ],
        },
        DELETE_ITEM: {
          actions: assign({
            items: ({ context, event }) => {
              return context.items.filter((item) => item.localId !== event.itemId);
            },
          }),
        },
        SAVE_ITEM: {
          actions: [
            assign({
              items: ({ context, event }) => {
                const existingItemIndex = context.items.findIndex(
                  (item) => item.localId === event.item.localId
                );
                
                if (existingItemIndex >= 0) {
                  // Оновити існуючий предмет
                  const updatedItems = [...context.items];
                  updatedItems[existingItemIndex] = event.item;
                  return updatedItems;
                } else {
                  // Додати новий предмет
                  const newItem = {
                    ...event.item,
                    localId: event.item.localId || `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  };
                  return [...context.items, newItem];
                }
              },
              currentItem: () => undefined,
              itemWizardState: () => 'idle' as ItemWizardState,
            }),
          ],
        },
        NEXT: {
          target: 'orderParams',
          guard: ({ context }) => context.items.length > 0,
        },
      },
    },
    
    // Етап 3: Загальні параметри замовлення
    orderParams: {
      on: {
        BACK: {
          target: 'itemManagement',
        },
        SAVE_ORDER_PARAMS: {
          target: 'billing',
          actions: assign({
            orderData: ({ context, event }) => ({
              ...context.orderData,
              ...event.params,
            }),
          }),
        },
      },
    },
    
    // Етап 4: Платіжна інформація та квитанція
    billing: {
      on: {
        BACK: {
          target: 'orderParams',
        },
        COMPLETE_ORDER: {
          target: 'complete',
          guard: ({ context }) => !!context.orderData && !!context.orderData.urgencyType,
        },
      },
    },
    
    // Завершення замовлення
    complete: {
      on: {
        RESET: {
          target: 'clientSelection',
          actions: assign(() => initialContext),
        },
      },
    },
  },
});
