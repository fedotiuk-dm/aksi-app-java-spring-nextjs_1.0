/**
 * @fileoverview Підетап 2.5 - Фотодокументація предметів (orval + zod)
 * @module domain/wizard/services/stage-2-item-management/photo-management
 *
 * Експортує:
 * - PhotoManagementService з orval + zod валідацією
 * - Типи на основі orval схем (PhotoItemResponse, PhotosListResponse, UploadPhotoRequest)
 * - Локальні композитні типи (PhotoUploadData, PhotoAnnotationsData, PhotoLimits)
 * - Бізнес-логіка для завантаження, валідації та управління фотографіями
 *
 * ✅ ORVAL READY: повністю інтегровано з orval + zod
 */

export * from './photo-management.service';
