/**
 * @fileoverview Підетап 2.4 - Розрахунок цін та модифікаторів (orval + zod)
 * @module domain/wizard/services/stage-2-item-management/pricing-calculation
 *
 * Експортує:
 * - PricingCalculationService з orval + zod валідацією
 * - Типи на основі orval схем (PriceCalculationRequest, PriceCalculationResponse, BasePriceParams)
 * - Локальні композитні типи (PricingFormattingOptions, PricingModifierApplication, PricingBreakdown)
 * - Бізнес-логіка для валідації модифікаторів та розрахунку цін
 *
 * ✅ ORVAL READY: повністю інтегровано з orval + zod
 */

export * from './pricing-calculation.service';
