import { ClientResponse, ClientPageResponse } from '@/lib/api';

import { ClientSelectionMode, WizardGlobalState } from './common-types';
import { ClientFormField, ClientFieldValue, ValidationErrors } from './form-types';

/**
 * Інтерфейс для акцій клієнтського пошуку
 */
export interface ClientSearchActions {
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  searchClients: () => Promise<void>;
  resetSearch: () => void;
}

/**
 * Інтерфейс для акцій створення клієнта
 */
export interface ClientCreationActions {
  // Встановлення значення поля форми створення клієнта
  setNewClientField: <T extends ClientFormField>(field: T, value: ClientFieldValue) => void;

  // Прямий метод для оновлення поля форми (для сумісності з існуючим кодом)
  updateNewClientField: <T extends ClientFormField>(field: T, value: ClientFieldValue) => void;

  // Створення нового клієнта
  createClient: () => Promise<{ client: ClientResponse | null; errors: ValidationErrors | null }>;

  // Очищення форми створення клієнта
  clearNewClient: () => void;
}

/**
 * Інтерфейс для акцій редагування клієнта
 */
export interface ClientEditingActions {
  // Встановлення клієнта для редагування
  setEditClient: (client: ClientResponse) => void;

  // Початок редагування клієнта (для сумісності з існуючим кодом)
  startEditingClient: (client: ClientResponse) => void;

  // Встановлення значення поля форми редагування
  setEditClientField: <T extends ClientFormField>(field: T, value: ClientFieldValue) => void;

  // Прямий метод для оновлення поля форми (для сумісності з існуючим кодом)
  updateEditClientField: <T extends ClientFormField>(field: T, value: ClientFieldValue) => void;

  // Збереження відредагованого клієнта
  saveEditedClient: () => Promise<{
    client: ClientResponse | null;
    errors: ValidationErrors | null;
  }>;

  // Відміна редагування
  cancelEditing: () => void;

  // Очищення форми редагування
  clearEditClient: () => void;
}

/**
 * Інтерфейс для акцій вибору клієнта
 */
export interface ClientSelectionActions {
  // Встановлення режиму вибору клієнта
  setMode: (mode: ClientSelectionMode) => void;

  // Вибір клієнта
  selectClient: (client: ClientResponse | null) => void;

  // Очищення вибраного клієнта
  clearSelectedClient: () => void;

  // Підтвердження вибору клієнта
  confirmClientSelection: () => void;
}

/**
 * Інтерфейс для дій валідації
 */
export interface ClientValidationActions {
  // Перевірка валідності даних та перехід до наступного кроку
  validateAndProceed: () => boolean;

  // Оновлення стану валідації
  updateValidationState: () => boolean;

  // Отримання даних клієнта для візарда
  getClientDataForWizard: () => ClientResponse | null;
}

/**
 * Інтерфейс для дій інтеграції з глобальним станом
 */
export interface ClientIntegrationActions {
  // Синхронізація з глобальним станом
  syncWithGlobalState: (wizardState: WizardGlobalState) => void;

  // Скидання стану до початкового
  resetState: () => void;
}

/**
 * Інтерфейс для утилітних дій
 */
export interface ClientUtilityActions {
  // Встановлення стану завантаження
  setLoading: (isLoading: boolean) => void;

  // Встановлення помилки
  setError: (error: string | null) => void;

  // Очищення списку клієнтів
  clearClients: () => void;

  // Пошук клієнтів за номером сторінки
  searchClientsByPage: (page: number) => Promise<ClientPageResponse | null>;
}

/**
 * Загальний інтерфейс для всіх акцій клієнта
 */
export interface ClientActions
  extends ClientSearchActions,
    ClientCreationActions,
    ClientEditingActions,
    ClientSelectionActions,
    ClientValidationActions,
    ClientIntegrationActions,
    ClientUtilityActions {}
