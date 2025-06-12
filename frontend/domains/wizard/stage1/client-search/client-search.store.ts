import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Типи для локального UI стану (не дублюємо API типи)
interface ClientSearchUIState {
  // Поточні значення форм
  searchTerm: string;
  phoneNumber: string;

  // UI стан
  selectedClientId: string | null;
  showAdvanced: boolean;
  autoSearchEnabled: boolean; // Флаг для контролю автопошуку

  // Session management
  sessionId: string | null;
}

interface ClientSearchUIActions {
  // Сеттери для форм
  setSearchTerm: (term: string) => void;
  setPhoneNumber: (phone: string) => void;

  // UI дії
  setSelectedClient: (clientId: string | null) => void;
  toggleAdvanced: () => void;
  toggleAutoSearch: () => void; // Перемикач автопошуку

  // Session
  setSessionId: (sessionId: string) => void;

  // Reset
  reset: () => void;
}

type ClientSearchStore = ClientSearchUIState & ClientSearchUIActions;

const initialState: ClientSearchUIState = {
  searchTerm: '',
  phoneNumber: '',
  selectedClientId: null,
  showAdvanced: false,
  autoSearchEnabled: true, // За замовчуванням автопошук увімкнений
  sessionId: null,
};

/**
 * Zustand стор для client search UI стану
 * Відповідальність: тільки локальний UI стан, НЕ дублює API дані
 */
export const useClientSearchStore = create<ClientSearchStore>()(
  subscribeWithSelector((set) => ({
    ...initialState,

    // Сеттери для форм
    setSearchTerm: (searchTerm) => set({ searchTerm }),
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),

    // UI дії
    setSelectedClient: (selectedClientId) => set({ selectedClientId }),
    toggleAdvanced: () => set((state) => ({ showAdvanced: !state.showAdvanced })),
    toggleAutoSearch: () => set((state) => ({ autoSearchEnabled: !state.autoSearchEnabled })),

    // Session
    setSessionId: (sessionId) => set({ sessionId }),

    // Reset
    reset: () => set(initialState),
  }))
);
