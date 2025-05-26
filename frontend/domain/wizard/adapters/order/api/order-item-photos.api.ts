/**
 * @fileoverview API функції для роботи з фотографіями предметів замовлення
 * @module domain/wizard/adapters/order/api
 */

import { OrderItemPhotosService, type OrderItemPhotoDTO } from '@/lib/api';

import type {
  WizardOrderItemPhoto,
  WizardPhotoUploadData,
  WizardPhotoAnnotationsData,
  WizardOrderOperationResult,
} from '../types';

// Константи для помилок
const UNKNOWN_ERROR = 'Невідома помилка';

/**
 * Маппер з API моделі в доменну модель
 */
function mapPhotoResponseToDomain(apiPhoto: OrderItemPhotoDTO): WizardOrderItemPhoto {
  return {
    id: apiPhoto.id || '',
    itemId: apiPhoto.itemId || '',
    fileName: extractFileNameFromUrl(apiPhoto.fileUrl),
    filePath: apiPhoto.fileUrl || '',
    fileSize: 0, // OrderItemPhotoDTO не містить розмір файлу
    mimeType: 'image/jpeg', // OrderItemPhotoDTO не містить MIME тип
    description: apiPhoto.description,
    annotations: apiPhoto.annotations,
    uploadedAt: apiPhoto.createdAt || new Date().toISOString(),
    updatedAt: undefined, // OrderItemPhotoDTO не містить updatedAt
  };
}

/**
 * Витягує ім'я файлу з URL
 */
function extractFileNameFromUrl(url?: string): string {
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split('/').pop() || '';
  } catch {
    // Якщо URL невалідний, спробуємо витягти ім'я файлу простим способом
    return url.split('/').pop() || '';
  }
}

/**
 * Завантаження фотографії предмета замовлення
 */
export async function uploadOrderItemPhoto(
  uploadData: WizardPhotoUploadData
): Promise<WizardOrderOperationResult<WizardOrderItemPhoto>> {
  try {
    const formData = {
      file: uploadData.file,
    };

    const apiResponse = await OrderItemPhotosService.uploadPhoto({
      itemId: uploadData.itemId,
      description: uploadData.description,
      formData,
    });

    const photo = mapPhotoResponseToDomain(apiResponse);

    return {
      success: true,
      data: photo,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося завантажити фотографію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання всіх фотографій предмета замовлення
 */
export async function getOrderItemPhotos(
  itemId: string
): Promise<WizardOrderOperationResult<WizardOrderItemPhoto[]>> {
  try {
    const apiResponse = await OrderItemPhotosService.getPhotosByItemId({ itemId });
    const photos = apiResponse.map(mapPhotoResponseToDomain);

    return {
      success: true,
      data: photos,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати фотографії: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Отримання фотографії за ID
 */
export async function getOrderItemPhotoById(
  itemId: string,
  photoId: string
): Promise<WizardOrderOperationResult<WizardOrderItemPhoto>> {
  try {
    const apiResponse = await OrderItemPhotosService.getPhotoById({ itemId, photoId });
    const photo = mapPhotoResponseToDomain(apiResponse);

    return {
      success: true,
      data: photo,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося отримати фотографію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Оновлення анотацій фотографії
 */
export async function updatePhotoAnnotations(
  annotationsData: WizardPhotoAnnotationsData
): Promise<WizardOrderOperationResult<WizardOrderItemPhoto>> {
  try {
    const apiResponse = await OrderItemPhotosService.updatePhotoAnnotations({
      itemId: annotationsData.itemId,
      photoId: annotationsData.photoId,
      annotations: annotationsData.annotations,
      description: annotationsData.description,
    });

    const photo = mapPhotoResponseToDomain(apiResponse);

    return {
      success: true,
      data: photo,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося оновити анотації: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}

/**
 * Видалення фотографії предмета замовлення
 */
export async function deleteOrderItemPhoto(
  itemId: string,
  photoId: string
): Promise<WizardOrderOperationResult<void>> {
  try {
    await OrderItemPhotosService.deletePhoto({ itemId, photoId });

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: `Не вдалося видалити фотографію: ${error instanceof Error ? error.message : UNKNOWN_ERROR}`,
    };
  }
}
