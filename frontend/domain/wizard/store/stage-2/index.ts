/**
 * @fileoverview Stage 2 Stores - Stores для етапу "Менеджер предметів"
 * @module domain/wizard/store/stage-2
 * @author AKSI Team
 * @since 1.0.0
 */

// === МЕНЕДЖЕР ПРЕДМЕТІВ ===
export { useItemsManagerStore, type ItemsManagerStore } from './items-manager.store';

// === ПІДВІЗАРД ПРЕДМЕТІВ ===
export { useItemWizardStore, type ItemWizardStore, ItemWizardStep } from './item-wizard.store';

// === РОЗРАХУНОК ЦІН ===
export {
  usePriceCalculatorStore,
  type PriceCalculatorStore,
  PriceModifierType,
} from './price-calculator.store';

// === ПІДЕТАП 2.1: ОСНОВНА ІНФОРМАЦІЯ ===
export {
  useBasicInfoStore,
  type BasicInfoStore,
  ServiceCategory,
  MeasurementUnit,
} from './basic-info.store';

// === ПІДЕТАП 2.2: ХАРАКТЕРИСТИКИ ===
export {
  useCharacteristicsStore,
  type CharacteristicsStore,
  MaterialType,
  FillerType,
  WearLevel,
} from './characteristics.store';

// === ПІДЕТАП 2.3: ЗАБРУДНЕННЯ ТА ДЕФЕКТИ ===
export {
  useDefectsStainsStore,
  type DefectsStainsStore,
  StainType,
  DefectType,
} from './defects-stains.store';

// === ПІДЕТАП 2.5: ФОТОДОКУМЕНТАЦІЯ ===
export { usePhotosStore, type PhotosStore, PhotoType, PhotoUploadStatus } from './photos.store';
