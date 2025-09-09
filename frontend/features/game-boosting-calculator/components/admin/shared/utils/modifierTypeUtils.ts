/**
 * Utility functions for working with modifier types
 * Pure dynamic approach using only Orval-generated types
 */

import { GameModifierType, GameModifierOperation } from '@api/game';

export interface ModifierTypeOption {
  value: string;
  label: string;
}

/**
 * Configuration for modifier type display labels and icons
 * These are UI enhancements - icons and friendly names for better UX
 */
const MODIFIER_TYPE_CONFIG: Record<string, { icon: string; label: string }> = {
  TIMING: { icon: '⏱️', label: 'Timing' },
  SUPPORT: { icon: '🛠️', label: 'Support' },
  SERVICE: { icon: '⚙️', label: 'Service' },
  MODE: { icon: '🎮', label: 'Mode' },
  RANK: { icon: '🏆', label: 'Rank' },
  ACHIEVEMENT: { icon: '🏅', label: 'Achievement' },
  QUALITY: { icon: '⭐', label: 'Quality' },
  COSMETIC: { icon: '💄', label: 'Cosmetic' },
  PROGRESSION: { icon: '📈', label: 'Progression' },
  SPELLS: { icon: '🔮', label: 'Spells' },
  SOCIAL: { icon: '👥', label: 'Social' },
  GUIDANCE: { icon: '🎯', label: 'Guidance' },
  EXTRA: { icon: '➕', label: 'Extra' },
  PROMOTIONAL: { icon: '🎉', label: 'Promotional' },
  SEASONAL: { icon: '🎄', label: 'Seasonal' },
};

/**
 * Get full display label with icon for modifier type
 */
export function getModifierTypeFullLabel(type: string): string {
  const config = MODIFIER_TYPE_CONFIG[type];
  return config ? `${config.icon} ${config.label}` : getModifierTypeDisplayName(type);
}

/**
 * Get icon for modifier type
 */
export function getModifierTypeIcon(type: string): string {
  return MODIFIER_TYPE_CONFIG[type]?.icon || '⚪';
}

/**
 * Get clean label without icon for modifier type
 */
export function getModifierTypeCleanLabel(type: string): string {
  return MODIFIER_TYPE_CONFIG[type]?.label || getModifierTypeDisplayName(type);
}

/**
 * Get all modifier type options dynamically from API types
 * Uses UI enhancement config for better user experience
 */
export function getModifierTypeOptions(): ModifierTypeOption[] {
  return Object.values(GameModifierType).map((type) => ({
    value: type,
    label: getModifierTypeFullLabel(type),
  }));
}

/**
 * Generate user-friendly display name from enum value
 */
function getModifierTypeDisplayName(type: string): string {
  // Convert SCREAMING_SNAKE_CASE to Title Case
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
/**
 * Get all modifier operation options dynamically from API types
 */
export function getModifierOperationOptions(): ModifierTypeOption[] {
  return Object.values(GameModifierOperation).map((operation) => ({
    value: operation,
    label: getModifierOperationDisplayName(operation),
  }));
}

/**
 * Configuration for operation display labels and descriptions
 * UI enhancements for better user understanding
 */
const MODIFIER_OPERATION_CONFIG: Record<string, { label: string; description: string }> = {
  ADD: {
    label: 'Add Fixed Amount',
    description: 'Fixed amount to add (in cents, e.g., 500 = $5.00)',
  },
  SUBTRACT: {
    label: 'Subtract Fixed Amount',
    description: 'Fixed amount to subtract (in cents, e.g., 200 = -$2.00)',
  },
  MULTIPLY: {
    label: 'Multiply',
    description: 'Multiplier value (e.g., 150 = 1.5x multiplier)',
  },
  DIVIDE: {
    label: 'Divide',
    description: 'Divider value (e.g., 200 = divide by 2)',
  },
};

/**
 * Generate user-friendly display name for operations
 */
function getModifierOperationDisplayName(operation: string): string {
  return MODIFIER_OPERATION_CONFIG[operation]?.label || operation;
}

/**
 * Get full description for modifier operation
 */
export function getModifierOperationDescription(operation: string): string {
  return MODIFIER_OPERATION_CONFIG[operation]?.description || 'Value for the modifier operation';
}
/**
 * Calculate modifier adjustment for a single modifier
 */
export function calculateModifierAdjustment(
  operation: string,
  value: number,
  basePrice: number = 0
): number {
  switch (operation) {
    case 'ADD':
      return value;
    case 'SUBTRACT':
      return -value;
    case 'MULTIPLY':
      return Math.round((basePrice * value) / 100) - basePrice;
    case 'DIVIDE':
      const newPrice = Math.round((basePrice * 100) / Math.max(1, value));
      return newPrice - basePrice;
    default:
      return 0;
  }
}

/**
 * Get display value for modifier based on operation
 */
export function getModifierDisplayValue(operation: string, value: number): string {
  switch (operation) {
    case 'MULTIPLY':
      return `${value / 100}x`;
    case 'ADD':
      return `+$${value / 100}`;
    case 'SUBTRACT':
      return `-$${value / 100}`;
    case 'DIVIDE':
      return `÷${value / 100}`;
    default:
      return `${value}`;
  }
}

/**
 * Calculate total modifier effect on price
 */
export function calculateTotalModifierEffect(
  modifiers: Array<{ operation: string; value: number }>,
  basePrice: number = 0
): { finalPrice: number; adjustments: number[] } {
  const adjustments: number[] = [];

  for (const modifier of modifiers) {
    const adjustment = calculateModifierAdjustment(modifier.operation, modifier.value, basePrice);
    adjustments.push(adjustment);
  }

  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj, 0);
  const finalPrice = basePrice + totalAdjustment;

  return { finalPrice, adjustments };
}

/**
 * Get helper text for modifier value input based on operation
 * Uses centralized operation config for consistency
 */
export function getModifierValueHelperText(operation: string): string {
  return getModifierOperationDescription(operation);
}
