import { ClientResponse } from '@/lib/api';

/**
 * Опції джерел клієнтів для використання у формах та UI-компонентах
 */
export const clientSourceOptions = [
  { value: ClientResponse.source.INSTAGRAM, label: 'Instagram' },
  { value: ClientResponse.source.GOOGLE, label: 'Google' },
  { value: ClientResponse.source.RECOMMENDATION, label: 'Рекомендація' },
  { value: ClientResponse.source.OTHER, label: 'Інше' },
];

/**
 * Отримати назву джерела клієнта за його значенням
 */
export const getClientSourceLabel = (sourceValue?: string): string => {
  if (!sourceValue) return '';

  const source = clientSourceOptions.find((option) => option.value === sourceValue);
  return source?.label || '';
};
