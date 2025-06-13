// 📋 ПІДЕТАП 2.5: Публічне API домену - фотодокументація
// Експорт тільки необхідних елементів для використання в UI компонентах

// ✅ Головний хук - єдина точка входу
export { useSubstep5PhotoDocumentation } from './use-substep5-photo-documentation.hook';
export type { UseSubstep5PhotoDocumentationReturn } from './use-substep5-photo-documentation.hook';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // TypeScript типи
  type PhotoDocumentationDTO,
  type Substep5AddPhotoBody,
  type SubstepResultDTO,

  // Zod схеми
  AddPhotoBodySchema,
  AddPhotoParamsSchema,
  CompletePhotoDocumentationParamsSchema,
  InitializePhotoDocumentationParamsSchema,
  GetDocumentationStatusParamsSchema,
  GetDocumentationDataParamsSchema,
  AddPhotoResponseSchema,
  CompletePhotoDocumentationResponseSchema,
  InitializePhotoDocumentationResponseSchema,
  GetDocumentationStatusResponseSchema,
  GetDocumentationDataResponseSchema,
} from './schemas';
