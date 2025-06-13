// Публічне API для Stage2 Item Manager домену
// Експортуємо тільки головний хук та Orval схеми

// =================== ГОЛОВНИЙ ХУК ===================
export { useStage2ItemManager } from './use-stage2-item-manager.hook';
export type { UseStage2ItemManagerReturn } from './use-stage2-item-manager.hook';

// =================== ORVAL СХЕМИ (якщо потрібні в UI) ===================
export {
  // TypeScript типи
  type InitializeItemManagerParamsSchema,
  type InitializeItemManagerResponseSchema,
  type AddItemParamsSchema,
  type AddItemBodySchema,
  type AddItemResponseSchema,
  type UpdateItemParamsSchema,
  type UpdateItemBodySchema,
  type UpdateItemResponseSchema,
  type DeleteItemParamsSchema,
  type DeleteItemResponseSchema,
  type GetCurrentManagerParamsSchema,
  type GetCurrentManagerResponseSchema,
} from './schemas';
