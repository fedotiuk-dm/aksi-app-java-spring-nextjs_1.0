/**
 * @fileoverview Підетап 2.3 - Забруднення, дефекти та ризики (orval + zod)
 * @module domain/wizard/services/stage-2-item-management/defects-and-stains
 *
 * Експортує:
 * - DefectsStainsService з orval + zod валідацією
 * - Типи на основі orval схем (StainTypesResponse, DefectTypesResponse, ModifierRecommendation)
 * - Локальні композитні типи (DefectsStainsSelection, StainSelection, DefectSelection)
 * - Бізнес-логіка для фільтрації ризиків та рекомендацій модифікаторів
 *
 * ✅ ORVAL READY: повністю інтегровано з orval + zod
 */

export * from './defects-stains.service';
