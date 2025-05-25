/**
 * @fileoverview Сервіс створення предметів
 * @module domain/wizard/services/item/item-creation
 */

import { OperationResultFactory } from '../interfaces';
import { priceCalculationService } from '../pricing';

import type {
  ItemDomain,
  CreateItemDomainRequest,
  UpdateItemDomainRequest,
  ItemCharacteristicsDomain,
  ItemDefectsAndRisksDomain,
} from './item-domain.types';
import type { OperationResult, ValidationOperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    CREATION_FAILED: 'Помилка створення предмета',
    VALIDATION_FAILED: 'Помилка валідації предмета',
    PRICE_CALCULATION_FAILED: 'Помилка розрахунку ціни',
    ORDER_ID_REQUIRED: "ID замовлення є обов'язковим",
    SERVICE_ID_REQUIRED: "ID послуги є обов'язковим",
    INVALID_QUANTITY: 'Некоректна кількість',
    UNKNOWN: 'Невідома помилка',
  },
  VALIDATION: {
    MIN_QUANTITY: 0.01,
    MAX_QUANTITY: 1000,
    MAX_NOTES_LENGTH: 500,
    MAX_PHOTOS: 5,
    MAX_PHOTO_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_STAINS: 10,
    MAX_DEFECTS: 10,
    MAX_RISKS: 10,
  },
} as const;

/**
 * Інтерфейс сервісу створення предметів
 */
export interface IItemCreationService {
  createItem(request: CreateItemDomainRequest): Promise<OperationResult<ItemDomain>>;
  updateItem(id: string, request: UpdateItemDomainRequest): Promise<OperationResult<ItemDomain>>;
  validateItemRequest(
    request: CreateItemDomainRequest
  ): ValidationOperationResult<CreateItemDomainRequest>;
  validateCharacteristics(
    characteristics: ItemCharacteristicsDomain
  ): ValidationOperationResult<ItemCharacteristicsDomain>;
  validateDefectsAndRisks(
    defectsAndRisks: ItemDefectsAndRisksDomain
  ): ValidationOperationResult<ItemDefectsAndRisksDomain>;
  calculateItemPrice(request: CreateItemDomainRequest): Promise<OperationResult<number>>;
}

/**
 * Сервіс створення предметів
 * Відповідальність: створення, валідація та розрахунок ціни предметів
 */
export class ItemCreationService implements IItemCreationService {
  public readonly name = 'ItemCreationService';
  public readonly version = '1.0.0';

  /**
   * Створення предмета
   */
  async createItem(request: CreateItemDomainRequest): Promise<OperationResult<ItemDomain>> {
    try {
      // Валідація запиту
      const validationResult = this.validateItemRequest(request);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Розрахунок ціни
      const priceResult = await this.calculateItemPrice(request);
      if (!priceResult.success || priceResult.data === undefined) {
        return OperationResultFactory.error(
          priceResult.error || CONSTANTS.ERROR_MESSAGES.PRICE_CALCULATION_FAILED
        );
      }

      // Створення доменного об'єкта предмета
      // Адаптер викликається в хуках домену для збереження
      const item: ItemDomain = {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        orderId: request.orderId,
        serviceId: request.serviceId,
        serviceName: 'Послуга', // Буде отримано з адаптера
        categoryId: 'category1', // Буде отримано з адаптера
        categoryName: 'Категорія', // Буде отримано з адаптера
        quantity: request.quantity,
        unitOfMeasure: request.unitOfMeasure,
        basePrice: 100, // Буде отримано з прайсу через адаптер
        modifiers: [], // Буде конвертовано з modifierIds через адаптер
        totalPrice: priceResult.data,
        characteristics: request.characteristics,
        defectsAndRisks: request.defectsAndRisks,
        photos: [], // Буде конвертовано з request.photos через адаптер
        notes: request.notes,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return OperationResultFactory.success(item);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CREATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Оновлення предмета
   */
  async updateItem(
    id: string,
    request: UpdateItemDomainRequest
  ): Promise<OperationResult<ItemDomain>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error("ID предмета є обов'язковим");
      }

      // Створення оновленого доменного об'єкта
      // Адаптер викликається в хуках домену для збереження
      const defaultCharacteristics: ItemCharacteristicsDomain = {
        material: 'COTTON',
        color: '',
        filler: 'NONE',
        wearDegree: '10%',
        size: 'ADULT',
        brand: '',
        fabricComposition: '',
      };

      const defaultDefectsAndRisks: ItemDefectsAndRisksDomain = {
        stains: [],
        defects: [],
        risks: [],
        hasNoGuarantee: false,
        noGuaranteeReason: '',
      };

      const updatedItem: ItemDomain = {
        id,
        orderId: 'order1', // Буде отримано з адаптера
        serviceId: 'service1', // Буде отримано з адаптера
        serviceName: 'Послуга', // Буде отримано з адаптера
        categoryId: 'category1', // Буде отримано з адаптера
        categoryName: 'Категорія', // Буде отримано з адаптера
        quantity: request.quantity || 1,
        unitOfMeasure: 'PIECE',
        basePrice: 100, // Буде отримано з адаптера
        modifiers: [], // Буде отримано з адаптера
        totalPrice: 100, // Буде перераховано
        characteristics: { ...defaultCharacteristics, ...request.characteristics },
        defectsAndRisks: { ...defaultDefectsAndRisks, ...request.defectsAndRisks },
        photos: [], // Буде отримано з адаптера
        notes: request.notes,
        status: request.status || 'PENDING',
        createdAt: new Date(), // Буде отримано з адаптера
        updatedAt: new Date(),
      };

      return OperationResultFactory.success(updatedItem);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.CREATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація запиту створення предмета
   */
  validateItemRequest(
    request: CreateItemDomainRequest
  ): ValidationOperationResult<CreateItemDomainRequest> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація замовлення
    if (!request.orderId?.trim()) {
      validationErrors.push({
        field: 'orderId',
        message: CONSTANTS.ERROR_MESSAGES.ORDER_ID_REQUIRED,
        code: 'REQUIRED',
      });
    }

    // Валідація послуги
    if (!request.serviceId?.trim()) {
      validationErrors.push({
        field: 'serviceId',
        message: CONSTANTS.ERROR_MESSAGES.SERVICE_ID_REQUIRED,
        code: 'REQUIRED',
      });
    }

    // Валідація кількості
    if (request.quantity <= 0) {
      validationErrors.push({
        field: 'quantity',
        message: 'Кількість повинна бути більше 0',
        code: 'INVALID_VALUE',
      });
    } else if (
      request.quantity < CONSTANTS.VALIDATION.MIN_QUANTITY ||
      request.quantity > CONSTANTS.VALIDATION.MAX_QUANTITY
    ) {
      validationErrors.push({
        field: 'quantity',
        message: `Кількість повинна бути від ${CONSTANTS.VALIDATION.MIN_QUANTITY} до ${CONSTANTS.VALIDATION.MAX_QUANTITY}`,
        code: 'OUT_OF_RANGE',
      });
    }

    // Валідація приміток
    if (request.notes && request.notes.length > CONSTANTS.VALIDATION.MAX_NOTES_LENGTH) {
      validationErrors.push({
        field: 'notes',
        message: `Примітки не можуть перевищувати ${CONSTANTS.VALIDATION.MAX_NOTES_LENGTH} символів`,
        code: 'MAX_LENGTH',
      });
    }

    // Валідація фото
    if (request.photos.length > CONSTANTS.VALIDATION.MAX_PHOTOS) {
      validationErrors.push({
        field: 'photos',
        message: `Максимальна кількість фото: ${CONSTANTS.VALIDATION.MAX_PHOTOS}`,
        code: 'MAX_LENGTH',
      });
    }

    // Валідація розміру фото
    request.photos.forEach((photo, index) => {
      if (photo.size > CONSTANTS.VALIDATION.MAX_PHOTO_SIZE) {
        validationErrors.push({
          field: `photos[${index}].size`,
          message: `Розмір фото не може перевищувати ${CONSTANTS.VALIDATION.MAX_PHOTO_SIZE / (1024 * 1024)}MB`,
          code: 'MAX_SIZE',
        });
      }
    });

    // Валідація характеристик
    const characteristicsValidation = this.validateCharacteristics(request.characteristics);
    if (!characteristicsValidation.isValid) {
      validationErrors.push(...(characteristicsValidation.validationErrors || []));
    }

    // Валідація дефектів та ризиків
    const defectsValidation = this.validateDefectsAndRisks(request.defectsAndRisks);
    if (!defectsValidation.isValid) {
      validationErrors.push(...(defectsValidation.validationErrors || []));
    }

    const isValid = validationErrors.length === 0;

    return {
      success: isValid,
      data: isValid ? request : undefined,
      error: isValid ? undefined : CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      validationErrors,
      isValid,
      timestamp: new Date(),
    };
  }

  /**
   * Валідація характеристик предмета
   */
  validateCharacteristics(
    characteristics: ItemCharacteristicsDomain
  ): ValidationOperationResult<ItemCharacteristicsDomain> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація кольору
    if (characteristics.color && characteristics.color.trim().length === 0) {
      validationErrors.push({
        field: 'characteristics.color',
        message: 'Колір не може бути порожнім',
        code: 'INVALID_VALUE',
      });
    }

    // Валідація бренду
    if (characteristics.brand && characteristics.brand.trim().length === 0) {
      validationErrors.push({
        field: 'characteristics.brand',
        message: 'Бренд не може бути порожнім',
        code: 'INVALID_VALUE',
      });
    }

    // Валідація складу тканини
    if (
      characteristics.fabricComposition &&
      characteristics.fabricComposition.trim().length === 0
    ) {
      validationErrors.push({
        field: 'characteristics.fabricComposition',
        message: 'Склад тканини не може бути порожнім',
        code: 'INVALID_VALUE',
      });
    }

    const isValid = validationErrors.length === 0;

    return {
      success: isValid,
      data: isValid ? characteristics : undefined,
      error: isValid ? undefined : 'Помилка валідації характеристик',
      validationErrors,
      isValid,
      timestamp: new Date(),
    };
  }

  /**
   * Валідація дефектів та ризиків
   */
  validateDefectsAndRisks(
    defectsAndRisks: ItemDefectsAndRisksDomain
  ): ValidationOperationResult<ItemDefectsAndRisksDomain> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація кількості плям
    if (defectsAndRisks.stains.length > CONSTANTS.VALIDATION.MAX_STAINS) {
      validationErrors.push({
        field: 'defectsAndRisks.stains',
        message: `Максимальна кількість плям: ${CONSTANTS.VALIDATION.MAX_STAINS}`,
        code: 'MAX_LENGTH',
      });
    }

    // Валідація кількості дефектів
    if (defectsAndRisks.defects.length > CONSTANTS.VALIDATION.MAX_DEFECTS) {
      validationErrors.push({
        field: 'defectsAndRisks.defects',
        message: `Максимальна кількість дефектів: ${CONSTANTS.VALIDATION.MAX_DEFECTS}`,
        code: 'MAX_LENGTH',
      });
    }

    // Валідація кількості ризиків
    if (defectsAndRisks.risks.length > CONSTANTS.VALIDATION.MAX_RISKS) {
      validationErrors.push({
        field: 'defectsAndRisks.risks',
        message: `Максимальна кількість ризиків: ${CONSTANTS.VALIDATION.MAX_RISKS}`,
        code: 'MAX_LENGTH',
      });
    }

    // Валідація причини відсутності гарантії
    if (defectsAndRisks.hasNoGuarantee && !defectsAndRisks.noGuaranteeReason?.trim()) {
      validationErrors.push({
        field: 'defectsAndRisks.noGuaranteeReason',
        message: "Причина відсутності гарантії є обов'язковою",
        code: 'REQUIRED',
      });
    }

    const isValid = validationErrors.length === 0;

    return {
      success: isValid,
      data: isValid ? defectsAndRisks : undefined,
      error: isValid ? undefined : 'Помилка валідації дефектів та ризиків',
      validationErrors,
      isValid,
      timestamp: new Date(),
    };
  }

  /**
   * Розрахунок ціни предмета
   */
  async calculateItemPrice(request: CreateItemDomainRequest): Promise<OperationResult<number>> {
    try {
      const priceResult = await priceCalculationService.calculatePrice({
        serviceId: request.serviceId,
        quantity: request.quantity,
        unitOfMeasure: request.unitOfMeasure,
        modifierIds: request.modifierIds,
        itemSpecifics: {
          material: request.characteristics.material,
          color: request.characteristics.color,
          wearDegree: request.characteristics.wearDegree,
          hasStains: request.defectsAndRisks.stains.length > 0,
          hasDefects: request.defectsAndRisks.defects.length > 0,
        },
      });

      if (!priceResult.success || !priceResult.data) {
        return OperationResultFactory.error(
          priceResult.error || CONSTANTS.ERROR_MESSAGES.PRICE_CALCULATION_FAILED
        );
      }

      return OperationResultFactory.success(priceResult.data.totalPrice);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.PRICE_CALCULATION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const itemCreationService = new ItemCreationService();
