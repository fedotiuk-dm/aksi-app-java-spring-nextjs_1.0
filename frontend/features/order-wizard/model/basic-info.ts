// Модуль для базової інформації замовлення

/**
 * Інтерфейс для форми базової інформації замовлення
 */
export interface BasicOrderInfo {
  // Унікальна мітка (вводиться вручну або сканується)
  tagNumber?: string;
  
  // Пункт прийому замовлення (вибір філії)
  branchLocationId: string;

  // Очікувана дата завершення замовлення
  expectedCompletionDate?: string;
  
  // Чи це термінове замовлення
  express?: boolean;
}

/**
 * Початкові значення для форми базової інформації замовлення
 */
export const initialBasicOrderInfo: BasicOrderInfo = {
  tagNumber: '',
  branchLocationId: '',
  expectedCompletionDate: undefined,
  express: false,
};

/**
 * Валідація форми базової інформації замовлення
 */
export const validateBasicOrderInfo = (values: BasicOrderInfo): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.branchLocationId) {
    errors.branchLocationId = 'Виберіть філію';
  }
  
  if (!values.tagNumber?.trim()) {
    errors.tagNumber = 'Введіть номер бирки';
  }

  return errors;
};
