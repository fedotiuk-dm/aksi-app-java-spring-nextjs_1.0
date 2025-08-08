import type { PriceListItemInfoCategoryCode } from '@/shared/api/generated/priceList';

// Category labels - should come from i18n or API in future
export const CATEGORY_LABELS: Record<PriceListItemInfoCategoryCode, string> = {
  CLOTHING: 'Чистка одягу та текстилю',
  LAUNDRY: 'Прання білизни',
  IRONING: 'Прасування',
  LEATHER: 'Чистка та відновлення шкіряних виробів',
  PADDING: 'Дублянки',
  FUR: 'Вироби із натурального хутра',
  DYEING: 'Фарбування текстильних виробів',
  ADDITIONAL_SERVICES: 'Додаткові послуги',
};

// Materials by category - should come from API in future
export const MATERIALS_BY_CATEGORY: Record<string, string[]> = {
  CLOTHING: ['Бавовна', 'Шерсть', 'Шовк', 'Синтетика'],
  LEATHER: ['Гладка шкіра', 'Нубук', 'Спілок', 'Замша'],
  PADDING: ['Натуральна шкіра', 'Штучна шкіра'],
  FUR: ['Натуральне хутро', 'Штучне хутро'],
};

// Common colors - should come from API in future  
export const COMMON_COLORS = [
  'Чорний', 'Білий', 'Сірий', 'Коричневий', 'Бежевий',
  'Червоний', 'Синій', 'Зелений', 'Жовтий', 'Помаранчевий',
];

export const FILLER_OPTIONS = [
  { value: 'Пух', label: 'Пух' },
  { value: 'Синтепон', label: 'Синтепон' },
  { value: 'Інше', label: 'Інше' },
];