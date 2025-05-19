import { ModifierDTO, ModifierCalculationDetail } from '@/lib/api';
import { PriceModifier, ModifierImpact } from '../types';

export const mapModifierFromApi = (apiModifier: ModifierDTO): PriceModifier => {
  const type = apiModifier.type || '';
  let value = apiModifier.value || 0;
  let minValue = apiModifier.minValue;
  let maxValue = apiModifier.maxValue;
  let isPercentage = apiModifier.percentage ?? false;
  let isDiscount = apiModifier.discount ?? false;

  let category = apiModifier.category || 'GENERAL';

  if (!apiModifier.category) {
    if (type.includes('TEXTILE')) {
      category = 'TEXTILE';
    } else if (type.includes('LEATHER')) {
      category = 'LEATHER';
    }
  }

  if (apiModifier.value === undefined) {
    const description = apiModifier.description || '';
    const changeDesc = apiModifier.changeDescription || '';

    const percentMatches =
      changeDesc.match(/([\d.]+)%/) || description.match(/([\d.]+)%/);
    const rangeMatches =
      description.match(/від\s+([\d.]+)\s+до\s+([\d.]+)/) ||
      changeDesc.match(/від\s+([\d.]+)\s+до\s+([\d.]+)/);
    const valueMatches =
      changeDesc.match(/([\d.]+)/) || description.match(/([\d.]+)/);

    if (rangeMatches && minValue === undefined && maxValue === undefined) {
      minValue = parseFloat(rangeMatches[1]);
      maxValue = parseFloat(rangeMatches[2]);
      value = minValue;
    } else if (percentMatches && value === 0) {
      value = parseFloat(percentMatches[1]);
      isPercentage = true;
    } else if (valueMatches && value === 0) {
      value = parseFloat(valueMatches[1]);
    }
  }

  return {
    id: apiModifier.id || '',
    name: apiModifier.name || '',
    type,
    description: apiModifier.description || '',
    category: category as 'GENERAL' | 'TEXTILE' | 'LEATHER',
    isPercentage,
    value,
    minValue,
    maxValue,
    isDiscount,
  };
};

export const mapModifiersFromApi = (
  apiModifiers: ModifierDTO[] = []
): PriceModifier[] => {
  return apiModifiers.map(mapModifierFromApi);
};

export const mapCalculationDetailsFromApi = (
  apiDetails: ModifierCalculationDetail[] = []
): ModifierImpact[] => {
  return apiDetails.map((detail: ModifierCalculationDetail) => ({
    modifierId: detail.modifierId || '',
    name: detail.modifierName || '',
    value: 0,
    impact: detail.priceDifference || 0,
  }));
};
