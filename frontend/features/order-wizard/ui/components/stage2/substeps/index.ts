/**
 * @fileoverview Експорти для підетапів Stage 2 Item Wizard
 */

// Типи підетапів
export interface BasicItemInfoData {
  categoryId: string;
  itemId: string;
  quantity: number;
  unitOfMeasure: string;
}

// Компоненти підетапів
export { BasicItemInfoStep } from './BasicItemInfoStep';

// TODO: Додати експорти для інших підетапів коли вони будуть готові
// export { ItemCharacteristicsStep } from './ItemCharacteristicsStep';
// export { StainsAndDefectsStep } from './StainsAndDefectsStep';
// export { PriceCalculatorStep } from './PriceCalculatorStep';
// export { PhotoDocumentationStep } from './PhotoDocumentationStep';

// Загальний тип для всіх даних віза
export interface ItemWizardData {
  basicInfo: BasicItemInfoData;
  // characteristics: ItemCharacteristicsData;
  // stainsAndDefects: StainsAndDefectsData;
  // priceCalculator: PriceCalculatorData;
  // photoDocumentation: PhotoDocumentationData;
}
