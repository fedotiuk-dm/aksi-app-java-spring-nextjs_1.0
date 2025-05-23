import { create } from 'zustand';

import { useClientCreationStore } from './client-creation.store';
import { useClientEditingStore } from './client-editing.store';
import { useClientSearchStore } from './client-search.store';
import { useClientSelectionStore } from './client-selection.store';
import { Client, CreateClientFormData, UpdateClientFormData } from '../types';
import { ClientMode } from '../types/client-enums';

/**
 * Композиційний стан клієнтського домену
 * Агрегує стани всіх спеціалізованих сторів
 */
interface ClientDomainState {
  // Режим роботи з клієнтами
  mode: ClientMode;

  // Загальний стан завантаження
  isGlobalLoading: boolean;

  // Загальні помилки домену
  globalError: string | null;
}

/**
 * Композиційні дії клієнтського домену
 * Високорівневі операції які координують роботу спеціалізованих сторів
 */
interface ClientDomainActions {
  // Режим управління
  setMode: (mode: ClientMode) => void;
  resetDomain: () => void;

  // Глобальні дії
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;

  // Композиційні дії для роботи з клієнтами
  startClientCreation: () => void;
  startClientEditing: (client: Client) => void;
  startClientSelection: () => void;

  // Інтеграційні методи для wizard з правильними типами
  createAndSelect: (formData: CreateClientFormData) => Promise<void>;
  editAndSelect: (formData: UpdateClientFormData) => Promise<void>;
  searchAndSelect: (searchTerm: string) => Promise<void>;
}

/**
 * Повний інтерфейс композиційного стору
 */
type ClientDomainStore = ClientDomainState & ClientDomainActions;

/**
 * Початковий стан домену
 */
const initialState: ClientDomainState = {
  mode: ClientMode.SELECT, // Змінюю на SELECT для wizard
  isGlobalLoading: false,
  globalError: null,
};

/**
 * Композиційний Zustand стор для клієнтського домену
 *
 * DDD SOLID принципи:
 * - Single Responsibility: тільки управління станом домену (без хуків)
 * - Open/Closed: легко розширюється новими композиційними операціями
 * - Liskov Substitution: реалізує загальний контракт управління доменом
 * - Interface Segregation: надає тільки необхідні високорівневі методи
 * - Dependency Inversion: залежить від абстракцій спеціалізованих сторів
 *
 * Оптимізовано для роботи з Order Wizard:
 * - Централізоване управління станом домену
 * - Координація між різними аспектами клієнтської функціональності
 * - Єдина точка входу для складних бізнес-операцій wizard
 * - Інкапсуляція складної логіки взаємодії між сторами
 */
export const useClientDomainStore = create<ClientDomainStore>((set, get) => ({
  // Початковий стан
  ...initialState,

  // Базові дії управління режимом
  setMode: (mode) => {
    set({ mode });
  },

  resetDomain: () => {
    set({ ...initialState });

    // Скидаємо всі спеціалізовані сторі
    useClientCreationStore.getState().resetForm();
    useClientEditingStore.getState().cancelEditing();
    useClientSearchStore.getState().clearSearch();
    useClientSelectionStore.getState().clearSelection();
  },

  // Глобальні дії
  setGlobalLoading: (loading) => {
    set({ isGlobalLoading: loading });
  },

  setGlobalError: (error) => {
    set({ globalError: error });
  },

  // Композиційні дії для початку операцій
  startClientCreation: () => {
    set({ mode: ClientMode.CREATE, globalError: null });
    useClientSelectionStore.getState().clearSelection();
    useClientEditingStore.getState().cancelEditing();
  },

  startClientEditing: (client) => {
    set({ mode: ClientMode.EDIT, globalError: null });
    useClientEditingStore.getState().startEditing(client);
    useClientSelectionStore.getState().selectClient(client.id || '');
  },

  startClientSelection: () => {
    set({ mode: ClientMode.SELECT, globalError: null });
    useClientCreationStore.getState().resetForm();
    useClientEditingStore.getState().cancelEditing();
  },

  // Складні інтеграційні операції для wizard
  createAndSelect: async (formData) => {
    const { setGlobalLoading, setGlobalError, setMode } = get();

    try {
      setGlobalLoading(true);
      setGlobalError(null);

      // Створюємо клієнта через creation store
      const creationStore = useClientCreationStore.getState();
      creationStore.setFormData(formData);
      const result = await creationStore.saveClient();

      if (result.client && !result.errors) {
        // Автоматично вибираємо створеного клієнта для wizard
        if (result.client.id) {
          await useClientSelectionStore.getState().selectClient(result.client.id);
        }
        setMode(ClientMode.SELECT);
      } else {
        setGlobalError(result.errors?.general || 'Помилка створення клієнта');
      }
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : 'Невідома помилка');
    } finally {
      setGlobalLoading(false);
    }
  },

  editAndSelect: async (formData) => {
    const { setGlobalLoading, setGlobalError, setMode } = get();

    try {
      setGlobalLoading(true);
      setGlobalError(null);

      // Оновлюємо клієнта через editing store
      const editingStore = useClientEditingStore.getState();
      editingStore.setFormData(formData);
      const result = await editingStore.saveClient();

      if (result.client && !result.errors) {
        // Автоматично вибираємо оновленого клієнта для wizard
        if (result.client.id) {
          await useClientSelectionStore.getState().selectClient(result.client.id);
        }
        setMode(ClientMode.SELECT);
      } else {
        setGlobalError(result.errors?.general || 'Помилка оновлення клієнта');
      }
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : 'Невідома помилка');
    } finally {
      setGlobalLoading(false);
    }
  },

  searchAndSelect: async (searchTerm) => {
    const { setGlobalLoading, setGlobalError } = get();

    try {
      setGlobalLoading(true);
      setGlobalError(null);

      // Виконуємо пошук через search store
      const searchStore = useClientSearchStore.getState();
      await searchStore.search({ keyword: searchTerm });

      // Якщо знайдено тільки одного клієнта, автоматично вибираємо його для wizard
      const results = searchStore.results;
      if (results.length === 1 && results[0].id) {
        await useClientSelectionStore.getState().selectClient(results[0].id);
        set({ mode: ClientMode.SELECT });
      }
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : 'Помилка пошуку');
    } finally {
      setGlobalLoading(false);
    }
  },
}));
