/**
 * Експорт типів для моделі даних OrderWizard з використанням OpenAPI
 */

// Типи для клієнтів
import type { ClientDTO } from '@/lib/api';
import type { ClientCreateRequest } from '@/lib/api';
import type { ClientResponse } from '@/lib/api';

// Типи для замовлень
import type { OrderDto } from '@/lib/api';
import type { OrderCreateRequest } from '@/lib/api';
import type { OrderDraftDto } from '@/lib/api';

// Типи для предметів замовлення
import type { OrderItemDto } from '@/lib/api';
import type { OrderItemCreateRequest } from '@/lib/api';
import type { OrderItemDefectDto } from '@/lib/api';
import type { OrderItemStainDto } from '@/lib/api';
import type { OrderItemPhotoDto } from '@/lib/api';
import type { OrderItemPriceCalculationDto } from '@/lib/api';

// Типи для довідників та категорій
import type { ServiceCategoryDto } from '@/lib/api';
import type { PriceListItemDto } from '@/lib/api';
import type { PriceModifierDto } from '@/lib/api';
import type { ColorDto } from '@/lib/api';
import type { WearDegreeDto } from '@/lib/api';
import type { MeasurementUnitDto } from '@/lib/api';
import type { ReceptionPointDTO } from '@/lib/api';

// Реекспорт типів для зручності
export type {
  // Клієнти
  ClientDTO,
  ClientCreateRequest,
  ClientResponse,

  // Замовлення
  OrderDto,
  OrderCreateRequest,
  OrderDraftDto,

  // Предмети замовлення
  OrderItemDto,
  OrderItemCreateRequest,
  OrderItemDefectDto,
  OrderItemStainDto,
  OrderItemPhotoDto,
  OrderItemPriceCalculationDto,

  // Довідники та категорії
  ServiceCategoryDto,
  PriceListItemDto,
  PriceModifierDto,
  ColorDto,
  WearDegreeDto,
  MeasurementUnitDto,
  ReceptionPointDTO,
};

// Експорт типів специфічних для UI візарда
export * from './wizard.types';
