/**
 * Етап 1.1: Стан кроку "Вибір або створення клієнта"
 */

import type { ClientData, ClientSearchResultItem } from '../shared/orval-types';
import type { WizardStepState } from '../wizard-step-state.types';

/**
 * Етап 1.1: Стан кроку "Вибір або створення клієнта"
 */
export interface ClientSelectionStepState extends WizardStepState {
  // Пошук існуючого клієнта
  searchTerm: string;
  searchResults: ClientSearchResultItem[];
  isSearching: boolean;
  recentClients: ClientSearchResultItem[];
  lastSearchQuery?: string;
  searchCache: Map<string, ClientSearchResultItem[]>;

  // Обраний клієнт
  selectedClientId: string | null;
  selectedClient: ClientData | null;

  // Форма нового клієнта
  isNewClient: boolean;
  showCreateForm: boolean;
  newClientForm: {
    lastName: string;
    firstName: string;
    phone: string;
    email?: string;
    address?: string;
    communicationChannels: Array<'PHONE' | 'SMS' | 'VIBER'>;
    source: 'INSTAGRAM' | 'GOOGLE' | 'RECOMMENDATION' | 'OTHER' | null;
    sourceDetails?: string;
  };

  // Валідація та помилки
  formErrors: Record<string, string>;
  isFormValid: boolean;
}
