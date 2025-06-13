// Схеми для Substep5 - ТІЛЬКИ Orval схеми
// Використовуємо готові Orval схеми БЕЗ кастомних UI форм

// =================== ORVAL СХЕМИ ===================

// Реекспорт TypeScript типів
export type {
  PhotoDocumentationDTO,
  Substep5AddPhotoBody,
  SubstepResultDTO,
} from '@/shared/api/generated/substep5';

// Реекспорт Zod схем для валідації
export {
  // Body схеми
  substep5AddPhotoBody as AddPhotoBodySchema,

  // Params схеми
  substep5AddPhotoParams as AddPhotoParamsSchema,
  substep5CompletePhotoDocumentationParams as CompletePhotoDocumentationParamsSchema,
  substep5InitializePhotoDocumentationParams as InitializePhotoDocumentationParamsSchema,
  substep5GetDocumentationStatusParams as GetDocumentationStatusParamsSchema,
  substep5GetDocumentationDataParams as GetDocumentationDataParamsSchema,

  // Response схеми
  substep5AddPhoto200Response as AddPhotoResponseSchema,
  substep5CompletePhotoDocumentation200Response as CompletePhotoDocumentationResponseSchema,
  substep5InitializePhotoDocumentation200Response as InitializePhotoDocumentationResponseSchema,
  substep5GetDocumentationStatus200Response as GetDocumentationStatusResponseSchema,
  substep5GetDocumentationData200Response as GetDocumentationDataResponseSchema,
} from '@/shared/api/generated/substep5';
