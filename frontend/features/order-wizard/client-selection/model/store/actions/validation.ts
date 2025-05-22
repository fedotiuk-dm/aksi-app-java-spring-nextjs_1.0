import { useNavigationStore, WizardStep } from '../../../../wizard/store/navigation';
import { useValidationStore, ValidationStatus } from '../../../../wizard/store/validation';
import { ClientStore } from '../../types';

/**
 * Інтерфейс для дій валідації клієнтських даних
 */
export interface ValidationActions {
  updateValidationState: () => boolean;
  validateAndProceed: () => boolean;
}

/**
 * Створення дій для валідації даних клієнта
 */
export const createValidationActions = (
  set: (state: Partial<ClientStore>) => void,
  get: () => ClientStore
): ValidationActions => ({
  /**
   * Оновлення стану валідації на основі поточного стану
   */
  updateValidationState: () => {
    const { selectedClient, mode, newClient, editClient } = get();

    // Перевіряємо, чи вибрано клієнта або заповнено форму створення/редагування
    let isValid = false;
    let validationErrors = {};

    if (mode === 'existing' && selectedClient) {
      isValid = true;
    } else if (mode === 'new' && newClient.firstName && newClient.lastName && newClient.phone) {
      isValid = true;
    } else if (mode === 'edit' && editClient.firstName && editClient.lastName && editClient.phone) {
      isValid = true;
    } else {
      validationErrors = {
        client: "Необхідно вибрати існуючого клієнта або заповнити обов'язкові поля форми",
      };
    }

    // Оновлюємо стан валідації
    useValidationStore.getState().setStepValidation(WizardStep.CLIENT_SELECTION, {
      status: isValid ? ValidationStatus.VALID : ValidationStatus.INVALID,
      errors: validationErrors,
      isComplete: isValid,
      timestamp: Date.now(),
    });

    return isValid;
  },

  /**
   * Валідація даних та перехід до наступного кроку
   */
  validateAndProceed: () => {
    const { getClientDataForWizard } = get();
    const navigationStore = useNavigationStore.getState();

    // Перевіряємо валідність даних
    const isValid = get().updateValidationState();

    // Якщо валідація успішна, розблоковуємо та переходимо до наступного кроку
    if (isValid) {
      const clientData = getClientDataForWizard();

      if (clientData) {
        navigationStore.updateStepAvailability(WizardStep.BRANCH_SELECTION, true);
        navigationStore.goToStep(WizardStep.BRANCH_SELECTION);
        return true;
      }
    }

    return false;
  },
});
