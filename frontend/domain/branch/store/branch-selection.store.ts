import { create } from 'zustand';

import { BranchRepository } from '../repositories';
import { Branch, BranchSearchParams, BranchSearchResult } from '../types';

/**
 * Стан для вибору приймального пункту
 * Реалізує Single Responsibility Principle - відповідає ТІЛЬКИ за вибір
 */
interface BranchSelectionState {
  // Список доступних приймальних пунктів
  availableBranches: Branch[];

  // Вибраний приймальний пункт
  selectedBranch: Branch | null;

  // Стан завантаження
  isLoading: boolean;

  // Помилки
  error: string | null;

  // Результати пошуку
  searchResults: BranchSearchResult | null;

  // Чи показувати тільки активні пункти
  showActiveOnly: boolean;
}

/**
 * Дії для вибору приймального пункту
 */
interface BranchSelectionActions {
  // Завантажити доступні приймальні пункти
  loadAvailableBranches: (activeOnly?: boolean) => Promise<void>;

  // Вибрати приймальний пункт за ID
  selectBranch: (branchId: string) => Promise<void>;

  // Вибрати приймальний пункт за об'єктом
  selectBranchObject: (branch: Branch) => void;

  // Очистити вибір
  clearSelection: () => void;

  // Пошук приймальних пунктів
  searchBranches: (params: BranchSearchParams) => Promise<void>;

  // Очистити пошук
  clearSearch: () => void;

  // Встановити фільтр активних
  setShowActiveOnly: (activeOnly: boolean) => Promise<void>;

  // Встановити стан завантаження
  setLoading: (loading: boolean) => void;

  // Встановити помилку
  setError: (error: string | null) => void;

  // Отримати приймальний пункт за кодом
  getBranchByCode: (code: string) => Promise<Branch | null>;

  // Змінити статус активності
  toggleActiveStatus: (branchId: string) => Promise<boolean>;
}

/**
 * Повний інтерфейс стору
 */
type BranchSelectionStore = BranchSelectionState & BranchSelectionActions;

/**
 * Початковий стан
 */
const initialState: BranchSelectionState = {
  availableBranches: [],
  selectedBranch: null,
  isLoading: false,
  error: null,
  searchResults: null,
  showActiveOnly: true,
};

/**
 * Zustand стор для вибору приймального пункту
 * Реалізує принцип Single Responsibility
 */
export const useBranchSelectionStore = create<BranchSelectionStore>((set, get) => {
  const branchRepository = new BranchRepository();

  return {
    // Початковий стан
    ...initialState,

    // Дії
    loadAvailableBranches: async (activeOnly = true) => {
      set({ isLoading: true, error: null });

      try {
        const branches = await branchRepository.getAll(activeOnly);
        const branchObjects = branches.map((entity) => entity.toPlainObject());

        set({
          availableBranches: branchObjects,
          isLoading: false,
          showActiveOnly: activeOnly,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка завантаження приймальних пунктів';
        set({
          isLoading: false,
          error: errorMessage,
        });
      }
    },

    selectBranch: async (branchId: string) => {
      const { availableBranches } = get();

      // Спочатку шукаємо в доступних пунктах
      let branch = availableBranches.find((b) => b.id === branchId);

      if (!branch) {
        // Якщо не знайшли, завантажуємо з API
        set({ isLoading: true, error: null });

        try {
          const branchEntity = await branchRepository.getById(branchId);
          branch = branchEntity.toPlainObject();
          set({ isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Помилка завантаження приймального пункту';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return;
        }
      }

      set({ selectedBranch: branch });
    },

    selectBranchObject: (branch) => {
      set({ selectedBranch: branch });
    },

    clearSelection: () => {
      set({ selectedBranch: null });
    },

    searchBranches: async (params) => {
      set({ isLoading: true, error: null });

      try {
        const searchResults = await branchRepository.search(params);
        set({
          searchResults,
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка пошуку приймальних пунктів';
        set({
          isLoading: false,
          error: errorMessage,
        });
      }
    },

    clearSearch: () => {
      set({ searchResults: null });
    },

    setShowActiveOnly: async (activeOnly) => {
      await get().loadAvailableBranches(activeOnly);
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    setError: (error) => {
      set({ error });
    },

    getBranchByCode: async (code: string) => {
      try {
        const branch = await branchRepository.getByCode(code);
        return branch ? branch.toPlainObject() : null;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Помилка отримання приймального пункту за кодом';
        console.error(errorMessage);
        return null;
      }
    },

    toggleActiveStatus: async (branchId: string) => {
      try {
        const { availableBranches } = get();
        const branch = availableBranches.find((b) => b.id === branchId);
        if (!branch) {
          console.error('Приймальний пункт не знайдено');
          return false;
        }

        await branchRepository.setActiveStatus(branchId, !branch.active);
        await get().loadAvailableBranches();
        return !branch.active; // Повертаємо новий статус
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Помилка зміни статусу активності приймального пункту';
        console.error(errorMessage);
        return false;
      }
    },
  };
});
