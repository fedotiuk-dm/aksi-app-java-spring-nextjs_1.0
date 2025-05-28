/**
 * @fileoverview Хуки для етапу 2 - управління предметами
 * @module domain/wizard/hooks/stage-2
 */

/**
 * Етап 2: Item Management Hooks
 *
 * Архітектура hooks відповідає сервісам:
 * - item-manager: координація + CRUD операції
 * - item-wizard: навігація по підвізарду
 * - item-wizard-steps: конкретні кроки підвізарду
 * - pricing-calculator: розрахунок цін
 */

// Основні хуки для управління предметами
export { useItemManager } from './use-item-manager.hook';
export { useItemWizard } from './use-item-wizard.hook';
export { useItemWizardNavigation } from './use-item-wizard-navigation.hook';

// Хуки для кроків під-візарда предметів
export { useBasicItemInfo } from './use-basic-item-info.hook';
export { useItemCharacteristics } from './use-item-characteristics.hook';
export { useItemDefectsAndStains } from './use-item-defects-and-stains.hook';
export { usePricingCalculator } from './use-pricing-calculator.hook';
export { useItemPhotos } from './use-item-photos.hook';
