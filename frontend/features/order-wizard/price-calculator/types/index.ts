import { ModifierDTO, PriceCalculationResponseDTO } from '@/lib/api';

export interface PriceModifier {
  id: string;
  name: string;
  type: string;
  description: string;
  category: 'GENERAL' | 'TEXTILE' | 'LEATHER';
  isPercentage: boolean;
  value: number;
  minValue?: number;
  maxValue?: number;
  isDiscount: boolean;
}

export interface AppliedModifier {
  modifierId: string;
  selectedValue?: number;
}

export interface ModifierImpact {
  modifierId: string;
  name: string;
  value: number;
  impact: number;
}

export interface PriceCalculationResult {
  basePrice: number;
  finalPrice: number;
  modifiersImpact: ModifierImpact[];
}

export interface PriceCalculationRequest {
  basePrice: number;
  categoryCode: string;
  itemName: string;
  appliedModifiers: AppliedModifier[];
  availableModifiers: PriceModifier[];
}

export interface ApiError {
  status?: number;
  message?: string;
}

export type { ModifierDTO, PriceCalculationResponseDTO };

export * from './price-calculator.types';
