/**
 * @fileoverview Сервіс для валідації даних предметів у Order Wizard
 * @module domain/wizard/services/stage-3-item-management/item-wizard/services/item-wizard-validation
 */

import { IItemWizardValidationService } from '../interfaces';
import {
  ItemOperationResult,
  ItemValidationResult,
  ItemWizardState,
  ItemWizardStep
} from '../types';
import { ItemWizardStateService } from './item-wizard-state.service';

/** Повідомлення про помилки валідації */
const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Поле обов\'язкове для заповнення',
  INVALID_NAME: 'Некоректна назва предмета',
  INVALID_TYPE: 'Некоректний тип предмета',
  INVALID_DESCRIPTION: 'Некоректний опис предмета',
  INVALID_PRICE: 'Ціна повинна бути більше 0',
  INVALID_QUANTITY: 'Кількість повинна бути більше 0',
  INVALID_CATEGORY: 'Необхідно вибрати категорію',
  INVALID_ITEM: 'Необхідно вибрати предмет з прайс-листа',
  ITEM_NOT_INITIALIZED: 'Предмет не ініціалізовано',
  STEPS_NOT_COMPLETED: 'Не всі етапи додавання предмета завершені'
};

/**
 * Сервіс для валідації даних предметів
 * @implements IItemWizardValidationService
 */
export class ItemWizardValidationService implements IItemWizardValidationService {
  /**
   * Конструктор сервісу валідації
   * @param stateService Сервіс для управління станом
   */
  constructor(private readonly stateService: ItemWizardStateService) {}
  
  /**
   * Базова перевірка наявності предмета
   * @param state Стан візарда
   * @returns Результат валідації з помилкою, якщо предмет не існує
   */
  private validateItemExists(state: ItemWizardState): ItemValidationResult {
    const errors: Record<string, string> = {};
    const { currentItem } = state;
    
    if (!currentItem) {
      errors.item = ERROR_MESSAGES.ITEM_NOT_INITIALIZED;
      return { valid: false, errors };
    }
    
    return { valid: true, errors: {} };
  }

  /**
   * Валідація даних поточного етапу
   */
  async validateCurrentStep(
    state: ItemWizardState
  ): Promise<ItemOperationResult<boolean>> {
    const { currentStep } = state;

    try {
      let validationResult: ItemValidationResult;

      switch (currentStep) {
        case ItemWizardStep.BASIC_INFO:
          validationResult = this.validateBasicInfo(state);
          break;
        case ItemWizardStep.ITEM_CHARACTERISTICS:
          validationResult = this.validateCharacteristics(state);
          break;
        case ItemWizardStep.DEFECTS_AND_RISKS:
          validationResult = this.validateDefectsAndRisks(state);
          break;
        case ItemWizardStep.PRICE_CALCULATION:
          validationResult = this.validatePrice(state);
          break;
        case ItemWizardStep.PHOTO_MANAGEMENT:
          validationResult = this.validatePhotos(state);
          break;
        case ItemWizardStep.SUMMARY:
          validationResult = this.validateSummary(state);
          break;
        default:
          return {
            success: false,
            error: `Невідомий етап: ${currentStep}`,
            data: false
          };
      }

      if (!validationResult.valid) {
        return {
          success: false,
          error: 'Валідація не пройдена',
          data: false,
          validationErrors: validationResult.errors
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка валідації',
        data: false
      };
    }
  }

  /**
   * Валідація всіх етапів
   */
  async validateAllSteps(
    state: ItemWizardState
  ): Promise<ItemOperationResult<boolean>> {
    try {
      // Поетапна валідація кожного етапу
      const validationResults = await Promise.all([
        this.validateBasicInfo(state),
        this.validateCharacteristics(state),
        this.validateDefectsAndRisks(state),
        this.validatePrice(state),
        this.validatePhotos(state),
        this.validateSummary(state)
      ]);

      // Перевірка на наявність помилок
      const invalidResults = validationResults.filter(result => !result.valid);

      if (invalidResults.length > 0) {
        // Збираємо всі помилки
        const errors: Record<string, string> = {};
        invalidResults.forEach(result => {
          Object.assign(errors, result.errors);
        });

        return {
          success: false,
          error: 'Валідація не пройдена',
          data: false,
          validationErrors: errors
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Невідома помилка валідації',
        data: false
      };
    }
  }

  /**
   * Перевірка готовності предмета до збереження
   */
  isItemReadyToSave(state: ItemWizardState): boolean {
    // Перевіряємо, що всі етапи завершені успішно
    for (const stepKey in state.steps) {
      const step = state.steps[stepKey as ItemWizardStep];
      if (!step.isCompleted) {
        return false;
      }
    }
    return true;
  }

  /**
   * Валідація базової інформації про предмет
   */
  private validateBasicInfo(state: ItemWizardState): ItemValidationResult {
    const errors: Record<string, string> = {};
    const { currentItem } = state;

    if (!currentItem) {
      errors.item = ERROR_MESSAGES.ITEM_NOT_INITIALIZED;
      return { valid: false, errors };
    }

    // Перевірка категорії
    if (!currentItem.categoryName) {
      errors.categoryName = ERROR_MESSAGES.INVALID_CATEGORY;
    }

    // Перевірка назви предмета
    if (!currentItem.itemName) {
      errors.itemName = ERROR_MESSAGES.INVALID_ITEM;
    }

    // Перевірка кількості
    if (!currentItem.quantity || currentItem.quantity <= 0) {
      errors.quantity = ERROR_MESSAGES.INVALID_QUANTITY;
    }

    // Перевірка одиниці виміру
    if (!currentItem.unit) {
      errors.unit = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Валідація характеристик предмета
   */
  private validateCharacteristics(state: ItemWizardState): ItemValidationResult {
    // Спочатку перевіряємо наявність предмета
    const baseValidation = this.validateItemExists(state);
    if (!baseValidation.valid) {
      return baseValidation;
    }
    
    const errors: Record<string, string> = {};
    const { currentItem } = state;
    
    if (currentItem) {
      // Перевірка матеріалу та кольору
      if (currentItem.material) {
        // В майбутньому тут можна додати валідацію матеріалу
      }
      
      if (currentItem.color) {
        // В майбутньому тут можна додати валідацію кольору
      }
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Валідація дефектів та ризиків
   */
  private validateDefectsAndRisks(state: ItemWizardState): ItemValidationResult {
    // Спочатку перевіряємо наявність предмета
    const baseValidation = this.validateItemExists(state);
    if (!baseValidation.valid) {
      return baseValidation;
    }
    
    const errors: Record<string, string> = {};
    const { currentItem } = state;
    
    if (currentItem) {
      // Перевірка нотаток, які можуть містити інформацію про дефекти та ризики
      if (currentItem.notes) {
        // В майбутньому тут можна додати валідацію нотаток
        // Наприклад, перевірка на наявність слів "дефект", "ризик" тощо
      }
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Валідація цін
   */
  private validatePrice(state: ItemWizardState): ItemValidationResult {
    const errors: Record<string, string> = {};
    const { currentItem } = state;

    if (!currentItem) {
      errors.item = ERROR_MESSAGES.ITEM_NOT_INITIALIZED;
      return { valid: false, errors };
    }

    // Перевірка базової ціни
    if (!currentItem.basePrice || currentItem.basePrice <= 0) {
      errors.basePrice = ERROR_MESSAGES.INVALID_PRICE;
    }

    // Перевірка фінальної ціни
    if (!currentItem.finalPrice || currentItem.finalPrice <= 0) {
      errors.finalPrice = ERROR_MESSAGES.INVALID_PRICE;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Валідація фотографій
   */
  private validatePhotos(state: ItemWizardState): ItemValidationResult {
    // Спочатку перевіряємо наявність предмета
    const baseValidation = this.validateItemExists(state);
    if (!baseValidation.valid) {
      return baseValidation;
    }
    
    const errors: Record<string, string> = {};
    const { currentItem } = state;
    
    if (currentItem) {
      // Перевірка ціни предмета
      // Це вже робить validatePrice, але ми можемо додати специфічну перевірку тут
      if (currentItem.basePrice && currentItem.basePrice > 1000) {
        // Це не помилка, але ми можемо додати попередження, якщо ціна висока
      }
      
      // Перевірка одиниць виміру
      if (currentItem.unit) {
        // Можемо перевірити, чи є в списку дозволених одиниць
        const allowedUnits = ['шт', 'кг', 'м', 'м2', 'компл'];
        if (!allowedUnits.includes(currentItem.unit)) {
          errors.unit = `Невідома одиниця виміру: ${currentItem.unit}. Дозволені: ${allowedUnits.join(', ')}`;
        }
      }
    }
    
    return { valid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Валідація підсумкової інформації
   */
  private validateSummary(state: ItemWizardState): ItemValidationResult {
    // У підсумку перевіряємо, що всі попередні етапи пройдені успішно
    if (!this.isItemReadyToSave(state)) {
      return {
        valid: false,
        errors: {
          summary: ERROR_MESSAGES.STEPS_NOT_COMPLETED
        }
      };
    }

    return { valid: true, errors: {} };
  }
}
