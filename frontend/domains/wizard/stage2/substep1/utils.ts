// Адаптери для перетворення Orval DTO типів в UI типи
// Виправляємо невідповідності між API та UI інтерфейсами

import type { ServiceCategoryDTO, PriceListItemDTO } from '@api/substep1';

// =================== UI ТИПИ ===================
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  estimatedDuration?: string;
}

export interface PriceListItem {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  categoryId?: string;
}

// =================== АДАПТЕРИ ===================
export const adaptServiceCategory = (dto: ServiceCategoryDTO): ServiceCategory | null => {
  if (!dto.id || !dto.name) {
    return null;
  }

  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    estimatedDuration: dto.standardProcessingDays
      ? `${dto.standardProcessingDays} днів`
      : undefined,
  };
};

export const adaptServiceCategories = (dtos: ServiceCategoryDTO[]): ServiceCategory[] => {
  return dtos
    .map(adaptServiceCategory)
    .filter((category): category is ServiceCategory => category !== null);
};

export const adaptPriceListItem = (dto: PriceListItemDTO): PriceListItem | null => {
  if (!dto.id || !dto.name || dto.basePrice === undefined) {
    return null;
  }

  return {
    id: dto.id,
    name: dto.name,
    basePrice: dto.basePrice,
    unit: dto.unitOfMeasure || 'шт',
    categoryId: dto.categoryId,
  };
};

export const adaptPriceListItems = (dtos: PriceListItemDTO[]): PriceListItem[] => {
  return dtos.map(adaptPriceListItem).filter((item): item is PriceListItem => item !== null);
};
