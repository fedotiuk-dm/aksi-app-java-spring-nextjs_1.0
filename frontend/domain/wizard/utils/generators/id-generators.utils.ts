/**
 * Утиліти генерації ідентифікаторів - відповідальність за створення унікальних ID
 */

/**
 * Генерує унікальний ID на основі timestamp та випадкових символів
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Генерує номер квитанції за форматом RC{timestamp}{random}
 */
export const generateReceiptNumber = (): string => {
  const prefix = 'RC';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

/**
 * Генерує унікальний session ID для трекінга сесії користувача
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
};

/**
 * Генерує унікальний лейбл замовлення з префіксом
 */
export const generateUniqueOrderLabel = (prefix = 'ORD'): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};
