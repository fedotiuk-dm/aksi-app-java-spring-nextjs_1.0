import { z } from 'zod';

import {
  getPhotosByItemIdParams,
  getPhotosByItemId200Response,
  getPhotosByItemId200ResponseItem,
  getPhotoById200Response,
  uploadPhotoParams,
  uploadPhotoQueryParams,
  uploadPhotoBody,
  uploadPhoto201Response,
  updatePhotoAnnotationsParams,
  updatePhotoAnnotationsQueryParams,
  updatePhotoAnnotations200Response,
  deletePhotoParams,
  deletePhoto204Response,
  safeValidate,
  validateOrThrow,
} from '@/shared/api/generated/order/zod';

import { BaseWizardService } from '../../base.service';

/**
 * Сервіс управління фотографіями з orval + zod інтеграцією
 *
 * Відповідальність (ТІЛЬКИ бізнес-логіка):
 * - Валідація фотографій та файлів через orval Zod схеми
 * - Бізнес-правила для завантаження та управління фото
 * - Валідація параметрів запитів та відповідей API
 * - Логіка лімітів та обмежень фотографій
 *
 * НЕ робить:
 * - API виклики (роль хуків + Orval)
 * - Збереження стану (роль Zustand)
 * - Кешування (роль TanStack Query)
 * - Стиснення зображень (має бути окремим utility)
 */

// Використовуємо orval схеми напряму
export type PhotoItemResponse = z.infer<typeof getPhotosByItemId200ResponseItem>;
export type PhotosListResponse = z.infer<typeof getPhotosByItemId200Response>;
export type PhotoResponse = z.infer<typeof getPhotoById200Response>;
export type UploadPhotoRequest = z.infer<typeof uploadPhotoBody>;
export type UploadPhotoQueryParams = z.infer<typeof uploadPhotoQueryParams>;
export type PhotoItemParams = z.infer<typeof getPhotosByItemIdParams>;
export type UpdateAnnotationsParams = z.infer<typeof updatePhotoAnnotationsParams>;
export type UpdateAnnotationsQuery = z.infer<typeof updatePhotoAnnotationsQueryParams>;

// Локальні схеми для валідації файлів та бізнес-логіки
const photoFileValidationSchema = z.object({
  file: z.instanceof(File),
  size: z.number().max(5 * 1024 * 1024, 'Розмір файлу не повинен перевищувати 5MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    errorMap: () => ({ message: 'Дозволені тільки файли JPEG, PNG, WEBP' }),
  }),
  name: z.string().min(1, "Ім'я файлу не може бути порожнім"),
});

const photoUploadDataSchema = z.object({
  itemId: z.string().uuid('Некоректний ID предмета'),
  file: z.instanceof(File),
  description: z.string().optional(),
});

const photoAnnotationsDataSchema = z.object({
  itemId: z.string().uuid('Некоректний ID предмета'),
  photoId: z.string().uuid('Некоректний ID фотографії'),
  annotations: z.string().min(1, 'Анотації не можуть бути порожніми'),
  description: z.string().optional(),
});

const photoLimitsSchema = z.object({
  maxPhotos: z.number().min(1).max(10).default(5),
  maxFileSize: z
    .number()
    .min(1)
    .default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
});

// Експортуємо типи з префіксом для унікальності
export type PhotoFileValidation = z.infer<typeof photoFileValidationSchema>;
export type PhotoUploadData = z.infer<typeof photoUploadDataSchema>;
export type PhotoAnnotationsData = z.infer<typeof photoAnnotationsDataSchema>;
export type PhotoLimits = z.infer<typeof photoLimitsSchema>;

export interface PhotoValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: PhotoItemResponse;
}

export interface PhotosListValidationResult {
  isValid: boolean;
  errors: string[];
  validatedData?: PhotosListResponse;
}

export interface PhotoFileValidationResult {
  isValid: boolean;
  errors: string[];
  validFile?: File;
}

export class PhotoManagementService extends BaseWizardService {
  protected readonly serviceName = 'PhotoManagementService';

  private readonly limits: PhotoLimits;

  constructor() {
    super();
    this.limits = photoLimitsSchema.parse({});
  }

  /**
   * Валідація параметрів для отримання фотографій предмета
   */
  validateGetPhotosParams(itemId: string): {
    isValid: boolean;
    errors: string[];
    validatedParams?: PhotoItemParams;
  } {
    const params = { itemId };
    const validation = safeValidate(getPhotosByItemIdParams, params);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedParams: validation.data,
    };
  }

  /**
   * Валідація відповіді зі списком фотографій
   */
  validatePhotosListResponse(data: unknown): PhotosListValidationResult {
    const validation = safeValidate(getPhotosByItemId200Response, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація однієї фотографії
   */
  validatePhotoResponse(data: unknown): PhotoValidationResult {
    const validation = safeValidate(getPhotoById200Response, data);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validatedData: validation.data,
    };
  }

  /**
   * Валідація файлу фотографії
   */
  validatePhotoFile(file: File): PhotoFileValidationResult {
    const fileData = {
      file,
      size: file.size,
      type: file.type,
      name: file.name,
    };

    const validation = safeValidate(photoFileValidationSchema, fileData);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      validFile: validation.data.file,
    };
  }

  /**
   * Валідація списку файлів фотографій
   */
  validatePhotoFiles(files: File[]): {
    valid: File[];
    invalid: Array<{ file: File; errors: string[] }>;
  } {
    const valid: File[] = [];
    const invalid: Array<{ file: File; errors: string[] }> = [];

    files.forEach((file) => {
      const validation = this.validatePhotoFile(file);
      if (validation.isValid && validation.validFile) {
        valid.push(validation.validFile);
      } else {
        invalid.push({ file, errors: validation.errors });
      }
    });

    return { valid, invalid };
  }

  /**
   * Створення даних для завантаження фотографії
   */
  createUploadPhotoData(
    itemId: string,
    file: File,
    description?: string
  ): {
    isValid: boolean;
    errors: string[];
    uploadData?: {
      params: z.infer<typeof uploadPhotoParams>;
      query?: UploadPhotoQueryParams;
      body: UploadPhotoRequest;
    };
  } {
    // Валідація даних завантаження
    const uploadDataValidation = safeValidate(photoUploadDataSchema, {
      itemId,
      file,
      description,
    });

    if (!uploadDataValidation.success) {
      return {
        isValid: false,
        errors: uploadDataValidation.errors,
      };
    }

    // Валідація файлу
    const fileValidation = this.validatePhotoFile(file);
    if (!fileValidation.isValid) {
      return {
        isValid: false,
        errors: fileValidation.errors,
      };
    }

    // Створення структури для API
    const params = { itemId };
    const body = { file };
    const query = description ? { description } : undefined;

    return {
      isValid: true,
      errors: [],
      uploadData: { params, body, query },
    };
  }

  /**
   * Створення даних для оновлення анотацій
   */
  createUpdateAnnotationsData(
    itemId: string,
    photoId: string,
    annotations: string,
    description?: string
  ): {
    isValid: boolean;
    errors: string[];
    updateData?: {
      params: UpdateAnnotationsParams;
      query: UpdateAnnotationsQuery;
    };
  } {
    const annotationsData = {
      itemId,
      photoId,
      annotations,
      description,
    };

    const validation = safeValidate(photoAnnotationsDataSchema, annotationsData);
    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      updateData: {
        params: { itemId, photoId },
        query: { annotations, description },
      },
    };
  }

  /**
   * Перевірка лімітів фотографій
   */
  checkPhotoLimits(
    currentCount: number,
    newCount: number
  ): {
    canUpload: boolean;
    remainingSlots: number;
    maxPhotos: number;
    error?: string;
  } {
    const total = currentCount + newCount;

    if (total > this.limits.maxPhotos) {
      return {
        canUpload: false,
        remainingSlots: Math.max(0, this.limits.maxPhotos - currentCount),
        maxPhotos: this.limits.maxPhotos,
        error: `Перевищено ліміт фотографій (максимум ${this.limits.maxPhotos})`,
      };
    }

    return {
      canUpload: true,
      remainingSlots: this.limits.maxPhotos - currentCount,
      maxPhotos: this.limits.maxPhotos,
    };
  }

  /**
   * Перевірка розміру файлу
   */
  isFileSizeValid(file: File): boolean {
    return file.size <= this.limits.maxFileSize;
  }

  /**
   * Перевірка типу файлу
   */
  isFileTypeValid(file: File): boolean {
    return this.limits.allowedTypes.includes(file.type);
  }

  /**
   * Отримання інформації про файл
   */
  getFileInfo(file: File): {
    name: string;
    size: number;
    formattedSize: string;
    type: string;
    isValidSize: boolean;
    isValidType: boolean;
  } {
    return {
      name: file.name,
      size: file.size,
      formattedSize: this.formatFileSize(file.size),
      type: file.type,
      isValidSize: this.isFileSizeValid(file),
      isValidType: this.isFileTypeValid(file),
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

  /**
   * Генерація опису фотографії
   */
  generatePhotoDescription(photo: PhotoItemResponse): string {
    const parts: string[] = [];

    if (photo.description) {
      parts.push(photo.description);
    }

    if (photo.createdAt) {
      const date = new Date(photo.createdAt);
      parts.push(`Створено: ${date.toLocaleDateString('uk-UA')}`);
    }

    if (photo.annotations) {
      parts.push('Є анотації');
    }

    return parts.join(' • ') || 'Фотографія предмета';
  }

  /**
   * Перевірка чи має фотографія анотації
   */
  hasAnnotations(photo: PhotoItemResponse): boolean {
    return !!(photo.annotations && photo.annotations.trim().length > 0);
  }

  /**
   * Групування фотографій за наявністю анотацій
   */
  groupPhotosByAnnotations(photos: PhotosListResponse): {
    withAnnotations: PhotosListResponse;
    withoutAnnotations: PhotosListResponse;
  } {
    const withAnnotations: PhotosListResponse = [];
    const withoutAnnotations: PhotosListResponse = [];

    photos.forEach((photo) => {
      if (this.hasAnnotations(photo)) {
        withAnnotations.push(photo);
      } else {
        withoutAnnotations.push(photo);
      }
    });

    return { withAnnotations, withoutAnnotations };
  }

  /**
   * Перевірка готовності фотодокументації
   */
  isPhotoDocumentationComplete(photos: PhotosListResponse): {
    isComplete: boolean;
    missingElements: string[];
    recommendations: string[];
  } {
    const missingElements: string[] = [];
    const recommendations: string[] = [];

    if (photos.length === 0) {
      missingElements.push('Немає жодної фотографії');
      recommendations.push('Додайте принаймні одну фотографію предмета');
    } else {
      const { withoutAnnotations } = this.groupPhotosByAnnotations(photos);

      if (withoutAnnotations.length > 0) {
        recommendations.push(
          `${withoutAnnotations.length} фото без анотацій - рекомендуємо додати позначки дефектів`
        );
      }

      if (photos.length < 2) {
        recommendations.push('Рекомендуємо додати кілька фото з різних ракурсів');
      }
    }

    return {
      isComplete: missingElements.length === 0,
      missingElements,
      recommendations,
    };
  }

  /**
   * Створення мініатюри URL (якщо доступно)
   */
  getThumbnailUrl(photo: PhotoItemResponse): string | null {
    return photo.thumbnailUrl || photo.fileUrl || null;
  }

  /**
   * Створення повного URL фотографії
   */
  getFullPhotoUrl(photo: PhotoItemResponse): string | null {
    return photo.fileUrl || null;
  }
}
