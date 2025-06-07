/**
 * @fileoverview Хук для управління додатковою інформацією замовлення
 *
 * Відповідальність:
 * - Примітки до замовлення (загальні)
 * - Додаткові вимоги клієнта
 */

import { useState, useCallback } from 'react';

import type { OrderAdditionalInfo, UseOrderAdditionalInfoReturn } from './types';

/**
 * Хук для управління додатковою інформацією замовлення
 *
 * @example
 * ```tsx
 * const {
 *   additionalInfo,
 *   setNotes,
 *   setClientRequirements
 * } = useOrderAdditionalInfo();
 *
 * // Встановити загальні примітки
 * setNotes('Особливі інструкції');
 *
 * // Встановити вимоги клієнта
 * setClientRequirements('Без пари, делікатне прання');
 * ```
 */
export function useOrderAdditionalInfo(): UseOrderAdditionalInfoReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [additionalInfo, setAdditionalInfo] = useState<OrderAdditionalInfo>({
    notes: '',
    clientRequirements: '',
  });

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Встановити загальні примітки до замовлення
   */
  const setNotes = useCallback((notes: string) => {
    setAdditionalInfo((prev) => ({ ...prev, notes: notes.trim() }));
  }, []);

  /**
   * Встановити додаткові вимоги клієнта
   */
  const setClientRequirements = useCallback((requirements: string) => {
    setAdditionalInfo((prev) => ({ ...prev, clientRequirements: requirements.trim() }));
  }, []);

  /**
   * Очистити всю додаткову інформацію
   */
  const clearAdditionalInfo = useCallback(() => {
    setAdditionalInfo({
      notes: '',
      clientRequirements: '',
    });
  }, []);

  /**
   * Перевірити чи є додаткова інформація
   */
  const hasAdditionalInfo = useCallback((): boolean => {
    return additionalInfo.notes.trim() !== '' || additionalInfo.clientRequirements.trim() !== '';
  }, [additionalInfo.notes, additionalInfo.clientRequirements]);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    additionalInfo,
    hasAdditionalInfo: hasAdditionalInfo(),

    // Дії
    setNotes,
    setClientRequirements,
    clearAdditionalInfo,
  };
}
