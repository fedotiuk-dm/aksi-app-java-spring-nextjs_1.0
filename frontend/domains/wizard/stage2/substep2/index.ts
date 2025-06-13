// Публічне API для Substep2 домену
// Експортуємо головний хук та Orval схеми

// =================== ГОЛОВНИЙ ХУК ===================
export { useSubstep2ItemCharacteristics } from './use-substep2-item-characteristics.hook';
export type { UseSubstep2ItemCharacteristicsReturn } from './use-substep2-item-characteristics.hook';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // TypeScript типи
  type ItemCharacteristicsDTO,
  type SubstepResultDTO,

  // Zod схеми
  InitializeSubstepParamsSchema,
  InitializeSubstepQueryParamsSchema,
  SelectMaterialParamsSchema,
  SelectMaterialQueryParamsSchema,
  SelectColorParamsSchema,
  SelectColorQueryParamsSchema,
  SelectFillerParamsSchema,
  SelectFillerQueryParamsSchema,
  SelectWearLevelParamsSchema,
  SelectWearLevelQueryParamsSchema,
  ValidateCharacteristicsParamsSchema,
  CompleteSubstepParamsSchema,
  CancelSubstepParamsSchema,
  GetAvailableMaterialsParamsSchema,
  GetCurrentCharacteristicsParamsSchema,
  InitializeSubstepResponseSchema,
  SelectMaterialResponseSchema,
  SelectColorResponseSchema,
  SelectFillerResponseSchema,
  SelectWearLevelResponseSchema,
  ValidateCharacteristicsResponseSchema,
  CompleteSubstepResponseSchema,
  GetAvailableMaterialsResponseSchema,
  GetCurrentCharacteristicsResponseSchema,
} from './schemas';
