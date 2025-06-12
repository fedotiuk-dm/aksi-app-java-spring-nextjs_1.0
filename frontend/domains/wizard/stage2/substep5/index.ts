/**
 * @fileoverview Публічне API для Substep5 Photo Documentation
 *
 * Відповідальність: Експорт тільки публічного API
 * Принцип: Interface Segregation Principle
 */

// Головний хук (Facade pattern)
export { usePhotoDocumentation } from './use-photo-documentation.hook';
export type { UsePhotoDocumentationReturn } from './use-photo-documentation.hook';

// Схеми та типи для UI компонентів (якщо потрібні)
export type {
  PhotoUploadFormData,
  PhotoEditFormData,
  CameraSettingsFormData,
  PhotoFilterFormData,
  DocumentationValidationFormData,
  DocumentationCompletionFormData,
  GallerySettingsFormData,
  PhotoWithMetadata,
  PhotoMetadata,
  CameraCapabilities,
  UploadProgress,
} from './photo-documentation.schemas';

// Схеми для валідації (якщо потрібні в UI)
export {
  photoUploadSchema,
  photoEditSchema,
  cameraSettingsSchema,
  photoFilterSchema,
  documentationValidationSchema,
  documentationCompletionSchema,
  gallerySettingsSchema,
} from './photo-documentation.schemas';
