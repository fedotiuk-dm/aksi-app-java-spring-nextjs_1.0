/**
 * @fileoverview Сервіс фотодокументації предметів
 * @module domain/wizard/services/item/item-photo
 */

import { OperationResultFactory } from '../interfaces';

import type { ItemPhotoDomain, CreateItemPhotoDomainRequest, PhotoType } from './item-domain.types';
import type { OperationResult, ValidationOperationResult } from '../interfaces';

/**
 * Константи
 */
const CONSTANTS = {
  ERROR_MESSAGES: {
    UPLOAD_FAILED: 'Помилка завантаження фото',
    PHOTO_NOT_FOUND: 'Фото не знайдено',
    VALIDATION_FAILED: 'Помилка валідації фото',
    COMPRESSION_FAILED: 'Помилка стиснення фото',
    DELETE_FAILED: 'Помилка видалення фото',
    UNKNOWN: 'Невідома помилка',
    ITEM_ID_REQUIRED: "ID предмета є обов'язковим",
    PHOTO_ID_REQUIRED: "ID фото є обов'язковим",
    CANVAS_CONTEXT_ERROR: 'Не вдалося створити контекст Canvas',
    IMAGE_LOAD_ERROR: 'Помилка завантаження зображення',
  },
  VALIDATION: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_PHOTOS_PER_ITEM: 5,
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
    MIN_WIDTH: 100,
    MIN_HEIGHT: 100,
    MAX_WIDTH: 4000,
    MAX_HEIGHT: 4000,
  },
  COMPRESSION: {
    QUALITY: 0.8,
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    THUMBNAIL_SIZE: 200,
    THUMBNAIL_QUALITY: 0.8,
    MIN_QUALITY: 0.1,
    MAX_QUALITY: 1.0,
    OUTPUT_MIME_TYPE: 'image/jpeg',
  },
} as const;

/**
 * Інтерфейс сервісу фотодокументації
 */
export interface IItemPhotoService {
  uploadPhoto(
    itemId: string,
    photoRequest: CreateItemPhotoDomainRequest
  ): Promise<OperationResult<ItemPhotoDomain>>;
  uploadMultiplePhotos(
    itemId: string,
    photoRequests: CreateItemPhotoDomainRequest[]
  ): Promise<OperationResult<ItemPhotoDomain[]>>;
  getPhotosByItem(itemId: string): Promise<OperationResult<ItemPhotoDomain[]>>;
  getPhotoById(id: string): Promise<OperationResult<ItemPhotoDomain | null>>;
  deletePhoto(id: string): Promise<OperationResult<boolean>>;
  updatePhotoDescription(
    id: string,
    description: string
  ): Promise<OperationResult<ItemPhotoDomain>>;
  validatePhotoRequest(
    request: CreateItemPhotoDomainRequest
  ): ValidationOperationResult<CreateItemPhotoDomainRequest>;
  compressPhoto(base64Data: string, quality?: number): Promise<OperationResult<string>>;
  generateThumbnail(base64Data: string): Promise<OperationResult<string>>;
}

/**
 * Сервіс фотодокументації предметів
 * Відповідальність: завантаження, обробка, стиснення та управління фото
 */
export class ItemPhotoService implements IItemPhotoService {
  public readonly name = 'ItemPhotoService';
  public readonly version = '1.0.0';

  /**
   * Завантаження одного фото
   */
  async uploadPhoto(
    itemId: string,
    photoRequest: CreateItemPhotoDomainRequest
  ): Promise<OperationResult<ItemPhotoDomain>> {
    try {
      if (!itemId?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ITEM_ID_REQUIRED);
      }

      // Валідація фото
      const validationResult = this.validatePhotoRequest(photoRequest);
      if (!validationResult.isValid) {
        const errorMessages = (validationResult.validationErrors || []).map((e) => e.message);
        return OperationResultFactory.error(
          `${CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED}: ${errorMessages.join(', ')}`
        );
      }

      // Стиснення фото
      const compressedResult = await this.compressPhoto(photoRequest.base64Data);
      if (!compressedResult.success || !compressedResult.data) {
        return OperationResultFactory.error(
          compressedResult.error || CONSTANTS.ERROR_MESSAGES.COMPRESSION_FAILED
        );
      }

      // Генерація мініатюри
      const thumbnailResult = await this.generateThumbnail(compressedResult.data);
      if (!thumbnailResult.success || !thumbnailResult.data) {
        return OperationResultFactory.error(
          thumbnailResult.error || CONSTANTS.ERROR_MESSAGES.COMPRESSION_FAILED
        );
      }

      // Створення доменного об'єкта фото
      // Адаптер викликається в хуках домену для збереження
      const photo: ItemPhotoDomain = {
        id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        itemId,
        filename: photoRequest.filename,
        originalName: photoRequest.originalName,
        mimeType: photoRequest.mimeType,
        size: photoRequest.size,
        url: `https://example.com/photos/${photoRequest.filename}`, // Буде отримано з адаптера
        thumbnailUrl: `https://example.com/thumbnails/${photoRequest.filename}`, // Буде отримано з адаптера
        photoType: photoRequest.photoType,
        description: photoRequest.description,
        uploadedAt: new Date(),
      };

      return OperationResultFactory.success(photo);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPLOAD_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Завантаження кількох фото
   */
  async uploadMultiplePhotos(
    itemId: string,
    photoRequests: CreateItemPhotoDomainRequest[]
  ): Promise<OperationResult<ItemPhotoDomain[]>> {
    try {
      if (!itemId?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ITEM_ID_REQUIRED);
      }

      if (photoRequests.length === 0) {
        return OperationResultFactory.error('Список фото не може бути порожнім');
      }

      if (photoRequests.length > CONSTANTS.VALIDATION.MAX_PHOTOS_PER_ITEM) {
        return OperationResultFactory.error(
          `Максимальна кількість фото: ${CONSTANTS.VALIDATION.MAX_PHOTOS_PER_ITEM}`
        );
      }

      const uploadedPhotos: ItemPhotoDomain[] = [];
      const errors: string[] = [];

      // Завантаження кожного фото
      for (let i = 0; i < photoRequests.length; i++) {
        const photoRequest = photoRequests[i];
        const uploadResult = await this.uploadPhoto(itemId, photoRequest);

        if (uploadResult.success && uploadResult.data) {
          uploadedPhotos.push(uploadResult.data);
        } else {
          errors.push(`Фото ${i + 1}: ${uploadResult.error}`);
        }
      }

      if (errors.length > 0) {
        return OperationResultFactory.error(`Помилки завантаження: ${errors.join('; ')}`);
      }

      return OperationResultFactory.success(uploadedPhotos);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.UPLOAD_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання фото предмета
   */
  async getPhotosByItem(itemId: string): Promise<OperationResult<ItemPhotoDomain[]>> {
    try {
      if (!itemId?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.ITEM_ID_REQUIRED);
      }

      // Адаптер викликається в хуках домену
      // Повертаємо порожній масив для демонстрації
      const photos: ItemPhotoDomain[] = [];

      return OperationResultFactory.success(photos);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка отримання фото: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Отримання фото за ID
   */
  async getPhotoById(id: string): Promise<OperationResult<ItemPhotoDomain | null>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.PHOTO_ID_REQUIRED);
      }

      // Адаптер викликається в хуках домену
      // Повертаємо null для демонстрації
      const photo: ItemPhotoDomain | null = null;

      return OperationResultFactory.success(photo);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.PHOTO_NOT_FOUND}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Видалення фото
   */
  async deletePhoto(id: string): Promise<OperationResult<boolean>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.PHOTO_ID_REQUIRED);
      }

      // Адаптер викликається в хуках домену для видалення
      // Повертаємо успіх для демонстрації
      const success = true;

      return OperationResultFactory.success(success);
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.DELETE_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Оновлення опису фото
   */
  async updatePhotoDescription(
    id: string,
    description: string
  ): Promise<OperationResult<ItemPhotoDomain>> {
    try {
      if (!id?.trim()) {
        return OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.PHOTO_ID_REQUIRED);
      }

      // Отримання поточного фото
      const currentPhotoResult = await this.getPhotoById(id);
      if (!currentPhotoResult.success || !currentPhotoResult.data) {
        return OperationResultFactory.error(
          currentPhotoResult.error || CONSTANTS.ERROR_MESSAGES.PHOTO_NOT_FOUND
        );
      }

      // Створення оновленого фото
      // Адаптер викликається в хуках домену для збереження
      const updatedPhoto: ItemPhotoDomain = {
        ...currentPhotoResult.data,
        description,
      };

      return OperationResultFactory.success(updatedPhoto);
    } catch (error) {
      return OperationResultFactory.error(
        `Помилка оновлення опису: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Валідація запиту фото
   */
  validatePhotoRequest(
    request: CreateItemPhotoDomainRequest
  ): ValidationOperationResult<CreateItemPhotoDomainRequest> {
    const validationErrors: Array<{ field: string; message: string; code: string }> = [];

    // Валідація імені файлу
    if (!request.filename?.trim()) {
      validationErrors.push({
        field: 'filename',
        message: "Ім'я файлу є обов'язковим",
        code: 'REQUIRED',
      });
    }

    // Валідація оригінального імені
    if (!request.originalName?.trim()) {
      validationErrors.push({
        field: 'originalName',
        message: "Оригінальне ім'я файлу є обов'язковим",
        code: 'REQUIRED',
      });
    }

    // Валідація MIME типу
    if (!CONSTANTS.VALIDATION.ALLOWED_MIME_TYPES.includes(request.mimeType as any)) {
      validationErrors.push({
        field: 'mimeType',
        message: `Дозволені типи файлів: ${CONSTANTS.VALIDATION.ALLOWED_MIME_TYPES.join(', ')}`,
        code: 'INVALID_TYPE',
      });
    }

    // Валідація розміру файлу
    if (request.size > CONSTANTS.VALIDATION.MAX_FILE_SIZE) {
      validationErrors.push({
        field: 'size',
        message: `Максимальний розмір файлу: ${CONSTANTS.VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB`,
        code: 'MAX_SIZE',
      });
    }

    // Валідація base64 даних
    if (!request.base64Data?.trim()) {
      validationErrors.push({
        field: 'base64Data',
        message: "Дані зображення є обов'язковими",
        code: 'REQUIRED',
      });
    } else if (!this.isValidBase64(request.base64Data)) {
      validationErrors.push({
        field: 'base64Data',
        message: 'Некоректний формат даних зображення',
        code: 'INVALID_FORMAT',
      });
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
   * Стиснення фото
   */
  async compressPhoto(
    base64Data: string,
    quality: number = CONSTANTS.COMPRESSION.QUALITY
  ): Promise<OperationResult<string>> {
    try {
      // Реалізація стиснення зображення
      // Використовуємо Canvas API для стиснення

      // Валідація якості
      const validQuality = Math.min(Math.max(quality, 0.1), 1.0);

      // Створення Image об'єкта для завантаження base64
      const img = new Image();

      return new Promise((resolve) => {
        img.onload = () => {
          try {
            // Створення Canvas для обробки
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              resolve(OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.CANVAS_CONTEXT_ERROR));
              return;
            }

            // Розрахунок нових розмірів зі збереженням пропорцій
            const { width, height } = this.calculateCompressedDimensions(
              img.width,
              img.height,
              CONSTANTS.COMPRESSION.MAX_WIDTH,
              CONSTANTS.COMPRESSION.MAX_HEIGHT
            );

            // Встановлення розмірів Canvas
            canvas.width = width;
            canvas.height = height;

            // Малювання зображення з новими розмірами
            ctx.drawImage(img, 0, 0, width, height);

            // Експорт в base64 з якістю
            const compressedBase64 = canvas.toDataURL(
              CONSTANTS.COMPRESSION.OUTPUT_MIME_TYPE,
              validQuality
            );

            resolve(OperationResultFactory.success(compressedBase64));
          } catch (error) {
            resolve(
              OperationResultFactory.error(
                `${CONSTANTS.ERROR_MESSAGES.COMPRESSION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
              )
            );
          }
        };

        img.onerror = () => {
          resolve(OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.IMAGE_LOAD_ERROR));
        };

        // Завантаження base64 в Image
        img.src = base64Data.startsWith('data:')
          ? base64Data
          : `data:${CONSTANTS.COMPRESSION.OUTPUT_MIME_TYPE};base64,${base64Data}`;
      });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.COMPRESSION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Генерація мініатюри
   */
  async generateThumbnail(base64Data: string): Promise<OperationResult<string>> {
    try {
      // Реалізація генерації мініатюри
      // Використовуємо Canvas API для створення мініатюри

      const img = new Image();

      return new Promise((resolve) => {
        img.onload = () => {
          try {
            // Створення Canvas для мініатюри
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              resolve(OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.CANVAS_CONTEXT_ERROR));
              return;
            }

            // Розрахунок розмірів мініатюри зі збереженням пропорцій
            const { width, height } = this.calculateThumbnailDimensions(
              img.width,
              img.height,
              CONSTANTS.COMPRESSION.THUMBNAIL_SIZE
            );

            // Встановлення розмірів Canvas
            canvas.width = width;
            canvas.height = height;

            // Малювання мініатюри
            ctx.drawImage(img, 0, 0, width, height);

            // Експорт в base64
            const thumbnailBase64 = canvas.toDataURL(
              CONSTANTS.COMPRESSION.OUTPUT_MIME_TYPE,
              CONSTANTS.COMPRESSION.THUMBNAIL_QUALITY
            );

            resolve(OperationResultFactory.success(thumbnailBase64));
          } catch (error) {
            resolve(
              OperationResultFactory.error(
                `${CONSTANTS.ERROR_MESSAGES.COMPRESSION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
              )
            );
          }
        };

        img.onerror = () => {
          resolve(OperationResultFactory.error(CONSTANTS.ERROR_MESSAGES.IMAGE_LOAD_ERROR));
        };

        // Завантаження base64 в Image
        img.src = base64Data.startsWith('data:')
          ? base64Data
          : `data:${CONSTANTS.COMPRESSION.OUTPUT_MIME_TYPE};base64,${base64Data}`;
      });
    } catch (error) {
      return OperationResultFactory.error(
        `${CONSTANTS.ERROR_MESSAGES.COMPRESSION_FAILED}: ${error instanceof Error ? error.message : CONSTANTS.ERROR_MESSAGES.UNKNOWN}`
      );
    }
  }

  /**
   * Розрахунок розмірів для стиснення зі збереженням пропорцій
   */
  private calculateCompressedDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Якщо зображення менше максимальних розмірів, залишаємо як є
    if (width <= maxWidth && height <= maxHeight) {
      return { width, height };
    }

    // Розрахунок коефіцієнта масштабування
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const ratio = Math.min(widthRatio, heightRatio);

    return {
      width: Math.round(width * ratio),
      height: Math.round(height * ratio),
    };
  }

  /**
   * Розрахунок розмірів мініатюри зі збереженням пропорцій
   */
  private calculateThumbnailDimensions(
    originalWidth: number,
    originalHeight: number,
    thumbnailSize: number
  ): { width: number; height: number } {
    const ratio = Math.min(thumbnailSize / originalWidth, thumbnailSize / originalHeight);

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio),
    };
  }

  /**
   * Перевірка валідності base64 рядка
   */
  private isValidBase64(str: string): boolean {
    try {
      // Видаляємо data URL префікс якщо є
      const base64String = str.replace(/^data:image\/[a-z]+;base64,/, '');

      // Перевіряємо чи це валідний base64
      return btoa(atob(base64String)) === base64String;
    } catch {
      return false;
    }
  }
}

/**
 * Експорт екземпляра сервісу (Singleton)
 */
export const itemPhotoService = new ItemPhotoService();
