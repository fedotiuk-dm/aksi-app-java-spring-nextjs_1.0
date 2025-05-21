/**
 * Утиліти для OrderWizard
 * Містять допоміжні функції для перевірки умов та бізнес-правил
 */

import { WizardMainStep, ItemWizardSubStep } from '../types/wizard.types';

/**
 * Інтерфейси для даних різних кроків
 */
interface ClientData {
  id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

interface ItemData {
  id?: string;
  name?: string;
  category?: string;
  material?: string;
  color?: string;
  defects?: Array<{type: string; description: string}>;
  hasPhotos?: boolean;
}

interface OrderData {
  client?: ClientData;
  items?: ItemData[];
  branch?: { id: string; name: string };
  expedited?: boolean;
  specialNotes?: string;
}

interface WizardData {
  currentStep: {
    mainStep: WizardMainStep;
    itemSubStep: ItemWizardSubStep | null;
  };
  order: OrderData;
}

/**
 * Перевірки для навігації між кроками
 */

/**
 * Перевірка можливості переходу до наступного кроку
 * @param currentStep Поточний крок
 * @param orderData Дані замовлення
 */
export const canProceedToNextStep = (currentStep: WizardMainStep, orderData: OrderData): boolean => {
  switch (currentStep) {
    case 'client-selection':
      return !!orderData.client && isClientSelectionComplete(orderData.client);
    case 'basic-info':
      return !!orderData.branch;
    case 'item-manager':
      return Array.isArray(orderData.items) && orderData.items.length > 0;
    case 'item-wizard':
      // Для візарда предметів логіка знаходиться в окремій функції isItemWizardStepComplete
      return true;
    default:
      return true;
  }
};

/**
 * Перевірка заповненості даних клієнта
 * @param clientData Дані клієнта
 */
export const isClientSelectionComplete = (clientData: ClientData): boolean => {
  // Якщо є ID, вважаємо що обрано існуючого клієнта
  if (clientData.id) return true;
  
  // Інакше перевіряємо обов'язкові поля для нового клієнта
  return !!(
    clientData.firstName && 
    clientData.lastName && 
    clientData.phone && 
    clientData.phone.length >= 10
  );
};

/**
 * Перевірка валідності форми предмета для конкретного підкроку
 * @param itemData Дані предмета
 * @param subStep Поточний підкрок візарда предметів
 */
export const isItemFormValid = (itemData: ItemData, subStep: ItemWizardSubStep): boolean => {
  switch (subStep) {
    case 'basic-info':
      return !!(itemData.name && itemData.category);
    case 'item-properties':
      return !!(itemData.material && itemData.color);
    case 'defects-stains':
      return true; // Необов'язковий крок
    case 'price-calculator':
      return true; // Завжди валідний, оскільки ціна розраховується автоматично
    case 'photo-documentation':
      return true; // Необов'язковий крок
    default:
      return false;
  }
};

/**
 * Перевірка валідності всіх підкроків візарда предметів
 * @param itemData Дані предмета
 */
export const isItemWizardComplete = (itemData: ItemData): boolean => {
  return !!(
    itemData.name &&
    itemData.category &&
    itemData.material &&
    itemData.color
    // Інші обов'язкові поля по потребі
  );
};

/**
 * Перевірки доступності кроків
 */

/**
 * Перевірка чи доступний крок оплати
 * @param orderData Дані замовлення
 */
export const isPaymentStepAvailable = (orderData: OrderData): boolean => {
  return Array.isArray(orderData.items) && 
         orderData.items.length > 0 && 
         !!orderData.client && 
         !!orderData.branch;
};

/**
 * Перевірка чи доступне завантаження фото для предмета
 * @param itemData Дані предмета
 */
export const isPhotoUploadAllowed = (itemData: ItemData): boolean => {
  // Для прикладу: припустимо, що тільки певні категорії підтримують фото
  const categoriesWithPhotoSupport = ['coat', 'suit', 'dress', 'jacket', 'leather'];
  return !!itemData.category && categoriesWithPhotoSupport.includes(itemData.category);
};

/**
 * Перевірка чи потрібно пропустити крок вибору філії
 * @param branchesCount Кількість доступних філій
 */
export const shouldSkipBranchStep = (branchesCount: number): boolean => {
  // Якщо є лише одна філія, автоматично вибираємо її
  return branchesCount === 1;
};

/**
 * Перевірка чи можна завершити створення замовлення
 * @param wizardData Дані візарда
 */
export const canCompleteOrder = (wizardData: WizardData): boolean => {
  const { order } = wizardData;
  
  return !!(
    order.client &&
    order.branch &&
    Array.isArray(order.items) &&
    order.items.length > 0 &&
    order.items.every(isItemWizardComplete)
  );
};

/**
 * Перевірки бізнес-правил
 */

/**
 * Перевірка чи можна застосувати термінову чистку до категорії
 * @param itemCategory Категорія предмета
 */
export const canApplyExpressService = (itemCategory?: string): boolean => {
  if (!itemCategory) return false;
  
  // Категорії, що не підтримують термінову чистку
  const nonExpeditableCategories = ['leather', 'suede', 'fur', 'wedding_dress'];
  return !nonExpeditableCategories.includes(itemCategory);
};

/**
 * Перевірка чи можна застосувати модифікатор кольору
 * @param itemData Дані предмета
 */
export const canApplyColorModifier = (itemData: ItemData): boolean => {
  // Для прикладу: модифікатор кольору застосовується тільки для чорних або білих предметів
  return itemData.color === 'black' || itemData.color === 'white';
};

/**
 * Перевірка чи можна застосувати знижку
 * @param orderData Дані замовлення
 */
export const isDiscountApplicable = (orderData: OrderData): boolean => {
  // Для прикладу: знижка застосовується, якщо в замовленні більше 3 предметів
  return Array.isArray(orderData.items) && orderData.items.length > 3;
};

/**
 * Перевірка чи доступна додаткова послуга для типу предмета
 * @param itemType Тип предмета
 * @param serviceName Назва послуги
 */
export const isAdditionalServiceAvailable = (itemType?: string, serviceName?: string): boolean => {
  if (!itemType || !serviceName) return false;
  
  // Мапа доступних послуг для різних типів предметів
  const availableServicesByType: Record<string, string[]> = {
    'coat': ['waterproofing', 'ironing', 'repair'],
    'suit': ['ironing', 'repair', 'steam_cleaning'],
    'dress': ['ironing', 'stain_removal', 'repair'],
    'leather': ['coloring', 'repair', 'waterproofing'],
    'suede': ['brushing', 'waterproofing'],
  };
  
  return availableServicesByType[itemType]?.includes(serviceName) || false;
};
