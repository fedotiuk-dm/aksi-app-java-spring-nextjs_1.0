/**
 * Calculation Type Utilities
 * UI enhancements and utilities for price calculation types
 * Uses Orval-generated enums from @api/game
 */

import { CreatePriceConfigurationRequestCalculationType } from '@api/game';

export interface CalculationTypeOption {
  value: string;
  label: string;
  description: string;
}

/**
 * Configuration for calculation types display labels and descriptions
 * UI enhancements for better user understanding of price calculation types
 * These are mapped to Orval-generated enum values
 */
const CALCULATION_TYPE_CONFIG: Record<string, { label: string; description: string }> = {
  LINEAR: {
    label: 'Linear',
    description: 'Simple linear calculation based on levels',
  },
  RANGE: {
    label: 'Range Based',
    description: 'Different rates for different level ranges',
  },
  FORMULA: {
    label: 'Formula Based',
    description: 'Custom mathematical formula calculation',
  },
  TIME_BASED: {
    label: 'Time Based',
    description: 'Pricing based on estimated completion time',
  },
};

/**
 * Get all calculation type options dynamically from Orval API types
 * Uses CreatePriceConfigurationRequestCalculationType enum from @api/game
 */
export function getCalculationTypeOptions(): CalculationTypeOption[] {
  // Get all enum values from Orval-generated enum
  const enumValues = Object.values(CreatePriceConfigurationRequestCalculationType) as string[];

  return enumValues.map((type) => ({
    value: type,
    label: CALCULATION_TYPE_CONFIG[type]?.label || type,
    description: CALCULATION_TYPE_CONFIG[type]?.description || 'Calculation type',
  }));
}
