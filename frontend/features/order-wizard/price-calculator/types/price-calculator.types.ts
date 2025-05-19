import {
  PriceModifierDTO,
  RangeModifierValue,
  FixedModifierQuantity,
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  CalculationDetailsDTO,
} from '@/lib/api/';

export interface PriceModifier extends Omit<PriceModifierDTO, 'type'> {
  id: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'MULTIPLIER';
  minValue?: number;
  maxValue?: number;
  isPercentage: boolean;
  category: 'GENERAL' | 'TEXTILE' | 'LEATHER';
}

export interface AppliedModifier {
  modifierId: string;
  selectedValue: number;
}

export interface ModifierImpact extends CalculationDetailsDTO {}

export interface PriceCalculationResult extends PriceCalculationResponseDTO {
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
  quantity: number;
  color?: string;
  expedited?: boolean;
  expeditePercent?: number;
  discountPercent?: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export type {
  PriceCalculationRequestDTO,
  PriceCalculationResponseDTO,
  FixedModifierQuantity,
  RangeModifierValue,
};
