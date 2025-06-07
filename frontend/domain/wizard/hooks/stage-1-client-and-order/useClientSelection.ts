/**
 * @fileoverview Хук для управління вибором клієнта
 *
 * Відповідальність:
 * - Управління станом вибраного клієнта
 * - Перемикання між режимами (пошук/створення)
 * - Валідація вибору клієнта
 */

import { useState, useCallback } from 'react';

// Типи
import type { UseClientSelectionReturn, Client } from './types';

/**
 * Хук для управління вибором клієнта
 *
 * @example
 * ```tsx
 * const {
 *   selectedClient,
 *   mode,
 *   isClientSelected,
 *   selectClient,
 *   setMode,
 *   clearSelection
 * } = useClientSelection();
 *
 * // Вибрати клієнта зі списку
 * selectClient(client);
 *
 * // Перемкнути в режим створення
 * setMode('create');
 * ```
 */
export function useClientSelection(): UseClientSelectionReturn {
  // =====================================
  // Локальний стан
  // =====================================

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [mode, setModeState] = useState<'search' | 'create'>('search');

  // =====================================
  // Обчислювані значення
  // =====================================

  const isClientSelected = selectedClient !== null;

  // =====================================
  // Функції дій
  // =====================================

  /**
   * Вибрати клієнта
   */
  const selectClient = useCallback((client: Client) => {
    setSelectedClient(client);
    // Автоматично перемикаємося в режим пошуку, якщо клієнт вибраний
    setModeState('search');
  }, []);

  /**
   * Встановити режим роботи
   */
  const setMode = useCallback((newMode: 'search' | 'create') => {
    setModeState(newMode);

    // Якщо переходимо в режим створення, очищуємо вибір
    if (newMode === 'create') {
      setSelectedClient(null);
    }
  }, []);

  /**
   * Очистити вибір клієнта
   */
  const clearSelection = useCallback(() => {
    setSelectedClient(null);
    setModeState('search');
  }, []);

  /**
   * Оновити дані вибраного клієнта (після редагування)
   */
  const updateSelectedClient = useCallback((updatedClient: Client) => {
    setSelectedClient(updatedClient);
  }, []);

  // =====================================
  // Повернення стану та дій
  // =====================================

  return {
    // Стан
    selectedClient,
    mode,
    isClientSelected,

    // Дії
    selectClient,
    setMode,
    clearSelection,
    updateSelectedClient,
  };
}
