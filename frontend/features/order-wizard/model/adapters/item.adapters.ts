/**
 * Адаптери для конвертації даних предметів замовлення
 * між UI та API форматами
 */
import { v4 as uuidv4 } from 'uuid';
import type { OrderItemDto, OrderItemCreateRequest } from '@/lib/api';
import type { OrderItemUI } from '../types/wizard.types';
import type { FullItemFormValues } from '../schema/item.schema';

/**
 * Конвертує дані форми в об'єкт OrderItemUI для збереження в контексті
 */
export const itemFormToOrderItemUI = (formValues: FullItemFormValues): OrderItemUI => {
  // Розрахунок фінальної ціни, якщо вона не задана
  const finalPrice = formValues.finalPrice ?? calculateFinalPrice(
    formValues.basePrice,
    formValues.additionalServicesCost ?? 0,
    formValues.discount ?? 0
  );
  
  // Створюємо об'єкт за структурою OrderItemDto з додатковими полями UI
  return {
    // Поля з OrderItemDto
    id: formValues.id,
    name: formValues.name,
    basePrice: formValues.basePrice,
    finalPrice: finalPrice,
    material: formValues.material,
    color: formValues.color,
    quantity: formValues.quantity,
    defectNotes: formValues.defectNotes,
    filler: formValues.filler,
    
    // Спеціальні властивості
    childSized: formValues.childSized,
    clumpedFiller: formValues.clumpedFiller,
    manualCleaning: formValues.manualCleaning,
    heavilySoiled: formValues.heavilySoiled,
    heavilySoiledPercentage: formValues.heavilySoiledPercentage,
    noWarranty: formValues.noWarranty,
    noWarrantyReason: formValues.noWarrantyReason,
    
    // Додаткові поля для UI
    localId: formValues.localId ?? uuidv4(), // Генеруємо локальний ID для нових предметів
    isValid: true, // За замовчуванням вважаємо, що предмет валідний
  };
};

/**
 * Конвертує OrderItemUI в дані форми для редагування
 */
export const orderItemUIToFormValues = (item: OrderItemUI): FullItemFormValues => {
  return {
    // Основні поля
    id: item.id,
    localId: item.localId,
    name: item.name ?? '',
    // Для форми нам потрібне categoryId, яке можна отримати з priceListItem якщо він є
    categoryId: item.priceListItem?.categoryId ?? '',
    quantity: item.quantity ?? 1,
    unitOfMeasurement: 'PIECE', // За замовчуванням використовуємо штуки
    
    // Властивості та характеристики
    material: item.material ?? '',
    color: item.color ?? '',
    filler: item.filler ?? '',
    defectNotes: item.defectNotes ?? '',
    
    // Спеціальні властивості
    childSized: item.childSized ?? false,
    clumpedFiller: item.clumpedFiller ?? false,
    manualCleaning: item.manualCleaning ?? false,
    heavilySoiled: item.heavilySoiled ?? false,
    heavilySoiledPercentage: item.heavilySoiledPercentage ?? 0,
    noWarranty: item.noWarranty ?? false,
    noWarrantyReason: item.noWarrantyReason ?? '',
    
    // Ціноутворення
    basePrice: item.basePrice ?? 0,
    additionalServicesCost: 0, // Вертаємо дефолтне значення для форми
    discount: 0, // Вертаємо дефолтне значення для форми
    finalPrice: item.finalPrice ?? item.basePrice ?? 0,
  };
};

/**
 * Конвертує OrderItemUI в запит для API
 */
export const orderItemUIToCreateRequest = (item: OrderItemUI): OrderItemCreateRequest => {
  // ID категорії послуги можемо отримати з priceListItem
  const serviceCategoryId = item.priceListItem?.categoryId || '';
  // ID елемента прайс-листа
  const priceListItemId = item.priceListItem?.id || '';
  
  // Формуємо запит відповідно до реальної структури API
  return {
    // Обов'язкові поля
    quantity: item.quantity || 1,
    priceListItemId, 
    serviceCategoryId,
    
    // Основні властивості
    name: item.name || '',
    material: item.material,
    color: item.color,
    filler: item.filler,
    defectNotes: item.defectNotes,
    unitOfMeasurement: item.unitOfMeasurement || 'PIECE',
    
    // Спеціальні властивості
    childSized: item.childSized,
    clumpedFiller: item.clumpedFiller,
    manualCleaning: item.manualCleaning,
    heavilySoiled: item.heavilySoiled,
    heavilySoiledPercentage: item.heavilySoiledPercentage,
    noWarranty: item.noWarranty,
    noWarrantyReason: item.noWarrantyReason,
    // Пусті масиви для дефектів, модифікаторів та плям
    defects: [],
    modifiers: [],
    stains: []
  };
};

/**
 * Конвертує OrderItemDto в OrderItemUI для відображення
 */
export const orderItemDtoToUI = (dto: OrderItemDto): OrderItemUI => {
  return {
    ...dto,
    isValid: true,
  };
};

/**
 * Функція для розрахунку фінальної ціни з урахуванням знижки
 */
export const calculateFinalPrice = (
  basePrice: number,
  additionalCost: number = 0,
  discountPercent: number = 0
): number => {
  const totalBeforeDiscount = basePrice + additionalCost;
  const discountAmount = (totalBeforeDiscount * discountPercent) / 100;
  return totalBeforeDiscount - discountAmount;
};
