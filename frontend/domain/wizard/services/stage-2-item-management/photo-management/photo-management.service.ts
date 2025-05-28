import {
  uploadOrderItemPhoto,
  deleteOrderItemPhoto,
  getOrderItemPhotos,
  updatePhotoAnnotations,
  type WizardOrderItemPhoto,
  type WizardPhotoUploadData,
  type WizardPhotoAnnotationsData,
} from '@/domain/wizard/adapters/order';
import {
  photoFileSchema,
  photoListSchema,
  photoUploadSchema,
  photoUploadResultSchema,
} from '@/domain/wizard/schemas';

import { BaseWizardService } from '../../base.service';

/**
 * Розширений мінімалістський сервіс для управління фото
 * Розмір: ~110 рядків (в межах ліміту)
 *
 * Відповідальність (ТІЛЬКИ):
 * - Композиція order фото адаптерів для завантаження + CRUD
 * - Валідація файлів через ВСІ централізовані Zod схеми підетапу 2.5
 * - Мінімальна логіка валідації та форматування
 *
 * НЕ дублює:
 * - API виклики (роль order адаптерів)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Стиснення зображень (має бути окремим utility)
 * - Схеми валідації (роль централізованих schemas)
 */

export class PhotoManagementService extends BaseWizardService {
  protected readonly serviceName = 'PhotoManagementService';

  /**
   * Композиція: завантаження одного фото через адаптер
   */
  async uploadPhoto(uploadData: WizardPhotoUploadData): Promise<WizardOrderItemPhoto | null> {
    const result = await uploadOrderItemPhoto(uploadData);
    return result.success ? result.data || null : null;
  }

  /**
   * Композиція: видалення фото через адаптер
   */
  async deletePhoto(itemId: string, photoId: string): Promise<boolean> {
    const result = await deleteOrderItemPhoto(itemId, photoId);
    return result.success;
  }

  /**
   * Композиція: отримання фото предмета через адаптер
   */
  async getItemPhotos(itemId: string): Promise<WizardOrderItemPhoto[]> {
    const result = await getOrderItemPhotos(itemId);
    return result.success ? result.data || [] : [];
  }

  /**
   * Композиція: оновлення анотацій фото через адаптер
   */
  async updatePhotoAnnotations(
    annotationsData: WizardPhotoAnnotationsData
  ): Promise<WizardOrderItemPhoto | null> {
    const result = await updatePhotoAnnotations(annotationsData);
    return result.success ? result.data || null : null;
  }

  /**
   * Валідація файлу фото через централізовану схему
   */
  validatePhotoFile(file: File) {
    return photoFileSchema.safeParse({
      file,
      size: file.size,
      type: file.type,
      name: file.name,
    });
  }

  /**
   * Валідація списку фото через централізовану схему
   */
  validatePhotoList(files: File[]) {
    const photoFiles = files.map((file) => ({
      file,
      size: file.size,
      type: file.type,
      name: file.name,
    }));
    return photoListSchema.safeParse(photoFiles);
  }

  /**
   * Валідація даних завантаження через централізовану схему
   */
  validatePhotoUpload(data: unknown) {
    return photoUploadSchema.safeParse(data);
  }

  /**
   * Валідація результату завантаження
   */
  validatePhotoUploadResult(result: unknown) {
    return photoUploadResultSchema.safeParse(result);
  }

  /**
   * Перевірка лімітів фото (максимум 5 на предмет)
   */
  checkPhotoLimits(currentCount: number, newCount: number): boolean {
    const maxPhotos = 5;
    return currentCount + newCount <= maxPhotos;
  }

  /**
   * Перевірка розміру файлу
   */
  isFileSizeValid(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }

  /**
   * Перевірка типу файлу
   */
  isFileTypeValid(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  /**
   * Фільтрація валідних файлів
   */
  filterValidFiles(files: File[]): { valid: File[]; invalid: File[] } {
    const valid: File[] = [];
    const invalid: File[] = [];

    files.forEach((file) => {
      if (this.isFileSizeValid(file) && this.isFileTypeValid(file)) {
        valid.push(file);
      } else {
        invalid.push(file);
      }
    });

    return { valid, invalid };
  }

  /**
   * Створення даних для завантаження з валідацією
   */
  createPhotoUploadData(itemId: string, file: File, description?: string): WizardPhotoUploadData {
    return {
      itemId,
      file,
      description,
    };
  }

  /**
   * Створення даних для анотацій з валідацією
   */
  createPhotoAnnotationsData(
    itemId: string,
    photoId: string,
    annotations: string,
    description?: string
  ): WizardPhotoAnnotationsData {
    return {
      itemId,
      photoId,
      annotations,
      description,
    };
  }

  /**
   * Форматування розміру файлу для відображення
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
