import { useState, useCallback, useMemo } from 'react';

import { PriceCalculator } from '../utils/price.calculator';

export interface PriceModifier {
  id: string;
  label: string;
  description: string;
  value: number;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  applicable?: boolean;
  customizable?: boolean;
  min?: number;
  max?: number;
}

export interface ModifierCategory {
  id: string;
  label: string;
  description?: string;
  modifiers: PriceModifier[];
  applicable?: boolean;
  badge?: string;
}

export interface PriceCalculationData {
  basePrice: number;
  modifiersTotal: number;
  servicesTotal: number;
  finalPrice: number;
  steps: Array<{
    description: string;
    amount: number;
    total: number;
  }>;
}

/**
 * Хук для роботи з розрахунком ціни в item wizard
 */
export const usePriceCalculator = () => {
  // === STATE ===
  const [expandedSections, setExpandedSections] = useState<string[]>(['general']);
  const [isCalculating, setIsCalculating] = useState(false);
  const [customValues, setCustomValues] = useState<Record<string, number>>({});

  // === MODIFIER DEFINITIONS ===

  /**
   * Загальні коефіцієнти (доступні для всіх категорій)
   */
  const generalModifiers: PriceModifier[] = useMemo(
    () => [
      {
        id: 'childSized',
        label: 'Дитячі речі (до 30 розміру)',
        description: '30% знижка від вартості',
        value: -30,
        type: 'PERCENTAGE',
        applicable: true,
      },
      {
        id: 'manualCleaning',
        label: 'Ручна чистка',
        description: '+20% до вартості',
        value: 20,
        type: 'PERCENTAGE',
        applicable: true,
      },
      {
        id: 'heavilySoiled',
        label: 'Дуже забруднені речі',
        description: 'Додаткова надбавка (20-100%)',
        value: 50,
        type: 'PERCENTAGE',
        applicable: true,
        customizable: true,
        min: 20,
        max: 100,
      },
    ],
    []
  );

  /**
   * Модифікатори для текстильних виробів
   */
  const textileModifiers: PriceModifier[] = useMemo(
    () => [
      {
        id: 'furCollarsCuffs',
        label: 'Вироби з хутряними комірами та манжетами',
        description: '+30% до вартості чистки',
        value: 30,
        type: 'PERCENTAGE',
      },
      {
        id: 'waterRepellent',
        label: 'Нанесення водовідштовхуючого покриття',
        description: '+30% до вартості',
        value: 30,
        type: 'PERCENTAGE',
      },
      {
        id: 'silkChiffon',
        label: 'Натуральний шовк, атлас, шифон',
        description: '+50% до вартості',
        value: 50,
        type: 'PERCENTAGE',
      },
      {
        id: 'combinedLeatherTextile',
        label: 'Комбіновані вироби (шкіра+текстиль)',
        description: '+100% до вартості чистки текстилю',
        value: 100,
        type: 'PERCENTAGE',
      },
      {
        id: 'largeToys',
        label: "Великі м'які іграшки (ручна чистка)",
        description: '+100% до вартості чистки',
        value: 100,
        type: 'PERCENTAGE',
      },
      {
        id: 'buttonSewing',
        label: 'Пришивання гудзиків',
        description: 'Фіксована вартість за одиницю',
        value: 25,
        type: 'FIXED_AMOUNT',
      },
      {
        id: 'blackWhiteColors',
        label: 'Чорні та світлі тони',
        description: '+20% до вартості',
        value: 20,
        type: 'PERCENTAGE',
      },
      {
        id: 'weddingDress',
        label: 'Весільна сукня зі шлейфом',
        description: '+30% до вартості',
        value: 30,
        type: 'PERCENTAGE',
      },
    ],
    []
  );

  /**
   * Модифікатори для шкіряних виробів
   */
  const leatherModifiers: PriceModifier[] = useMemo(
    () => [
      {
        id: 'leatherIroning',
        label: 'Прасування шкіряних виробів',
        description: '70% від вартості чистки',
        value: 70,
        type: 'PERCENTAGE',
      },
      {
        id: 'leatherWaterRepellent',
        label: 'Водовідштовхуюче покриття',
        description: '+30% до вартості послуги',
        value: 30,
        type: 'PERCENTAGE',
      },
      {
        id: 'dyeingAfterOur',
        label: 'Фарбування (після нашої чистки)',
        description: '+50% до вартості послуги',
        value: 50,
        type: 'PERCENTAGE',
      },
      {
        id: 'dyeingAfterOther',
        label: 'Фарбування (після чистки деінде)',
        description: '100% вартість чистки',
        value: 100,
        type: 'PERCENTAGE',
      },
      {
        id: 'leatherInserts',
        label: 'Вироби із вставками',
        description: '+30% до вартості (шкіра іншого кольору, текстиль, хутро)',
        value: 30,
        type: 'PERCENTAGE',
      },
      {
        id: 'pearlCoating',
        label: 'Перламутрове покриття',
        description: '+30% до вартості послуги',
        value: 30,
        type: 'PERCENTAGE',
      },
      {
        id: 'syntheticFur',
        label: 'Натуральні дублянки на штучному хутрі',
        description: '-20% від вартості',
        value: -20,
        type: 'PERCENTAGE',
      },
      {
        id: 'leatherButtonSewing',
        label: 'Пришивання гудзиків',
        description: 'Фіксована вартість за одиницю',
        value: 25,
        type: 'FIXED_AMOUNT',
      },
      {
        id: 'manualLeatherCleaning',
        label: 'Ручна чистка виробів зі шкіри',
        description: '+30% до вартості чистки',
        value: 30,
        type: 'PERCENTAGE',
      },
    ],
    []
  );

  // === CATEGORY HELPERS ===

  /**
   * Перевірка чи категорія підтримує текстильні модифікатори
   */
  const isTextileCategory = useCallback((category: string): boolean => {
    return ['CLEANING_TEXTILES', 'LAUNDRY', 'IRONING', 'TEXTILE_DYEING'].includes(category);
  }, []);

  /**
   * Перевірка чи категорія підтримує шкіряні модифікатори
   */
  const isLeatherCategory = useCallback((category: string): boolean => {
    return ['LEATHER_CLEANING', 'SHEEPSKIN_CLEANING'].includes(category);
  }, []);

  /**
   * Отримання доступних категорій модифікаторів для категорії предмета
   */
  const getAvailableCategories = useCallback(
    (itemCategory: string): ModifierCategory[] => {
      const categories: ModifierCategory[] = [
        {
          id: 'general',
          label: 'Загальні коефіцієнти',
          description: 'Модифікатори, що діють для всіх категорій послуг',
          modifiers: generalModifiers,
          applicable: true,
          badge: 'Для всіх категорій',
        },
      ];

      if (isTextileCategory(itemCategory)) {
        categories.push({
          id: 'textile',
          label: 'Текстильні модифікатори',
          description: 'Спеціальні модифікатори для текстильних виробів',
          modifiers: textileModifiers,
          applicable: true,
          badge: 'Тільки для текстилю',
        });
      }

      if (isLeatherCategory(itemCategory)) {
        categories.push({
          id: 'leather',
          label: 'Шкіряні модифікатори',
          description: 'Спеціальні модифікатори для шкіряних виробів',
          modifiers: leatherModifiers,
          applicable: true,
          badge: 'Тільки для шкіри',
        });
      }

      return categories;
    },
    [generalModifiers, textileModifiers, leatherModifiers, isTextileCategory, isLeatherCategory]
  );

  // === CALCULATION LOGIC ===

  /**
   * Розрахунок ціни в реальному часі
   */
  const calculatePrice = useCallback(
    (
      itemData: any,
      selectedModifiers: string[],
      customValues: Record<string, number>
    ): PriceCalculationData | null => {
      if (!itemData.name || !itemData.unitPrice || itemData.quantity <= 0) {
        return null;
      }

      try {
        const basePrice = itemData.unitPrice * itemData.quantity;
        let currentTotal = basePrice;
        const steps: Array<{ description: string; amount: number; total: number }> = [];

        // Базова ціна
        steps.push({
          description: 'Базова ціна',
          amount: basePrice,
          total: currentTotal,
        });

        // Застосування модифікаторів
        let modifiersTotal = 0;
        const allCategories = getAvailableCategories(itemData.category);

        for (const category of allCategories) {
          for (const modifier of category.modifiers) {
            if (selectedModifiers.includes(modifier.id)) {
              const effectiveValue = customValues[modifier.id] ?? modifier.value;
              let modifierAmount = 0;

              if (modifier.type === 'PERCENTAGE') {
                modifierAmount = (basePrice * effectiveValue) / 100;
              } else {
                modifierAmount = effectiveValue;
              }

              modifiersTotal += modifierAmount;
              currentTotal += modifierAmount;

              steps.push({
                description: modifier.label,
                amount: modifierAmount,
                total: currentTotal,
              });
            }
          }
        }

        return {
          basePrice,
          modifiersTotal,
          servicesTotal: 0, // Поки що не враховуємо додаткові послуги
          finalPrice: currentTotal,
          steps,
        };
      } catch (error) {
        console.error('Error calculating price:', error);
        return null;
      }
    },
    [getAvailableCategories]
  );

  // === EVENT HANDLERS ===

  /**
   * Обробник зміни модифікаторів
   */
  const handleModifierChange = useCallback(
    (modifierId: string, checked: boolean, customValue?: number) => {
      if (customValue !== undefined) {
        setCustomValues((prev) => ({
          ...prev,
          [modifierId]: customValue,
        }));
      }
    },
    []
  );

  /**
   * Обробник зміни кастомного значення
   */
  const handleCustomValueChange = useCallback((modifierId: string, value: number) => {
    setCustomValues((prev) => ({
      ...prev,
      [modifierId]: value,
    }));
  }, []);

  /**
   * Обробник розгортання секцій
   */
  const handleSectionToggle = useCallback((section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  }, []);

  /**
   * Отримання списку застосованих модифікаторів з itemData
   */
  const getAppliedModifiersFromItemData = useCallback((itemData: any): string[] => {
    const applied: string[] = [];

    if (itemData.childSized) applied.push('childSized');
    if (itemData.manualCleaning) applied.push('manualCleaning');
    if (itemData.heavilySoiled) applied.push('heavilySoiled');

    return applied;
  }, []);

  /**
   * Симуляція розрахунку з затримкою
   */
  const simulateCalculation = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 300);
  }, []);

  return {
    // STATE
    expandedSections,
    isCalculating,
    customValues,

    // MODIFIER DEFINITIONS
    generalModifiers,
    textileModifiers,
    leatherModifiers,

    // CATEGORY HELPERS
    isTextileCategory,
    isLeatherCategory,
    getAvailableCategories,

    // CALCULATION
    calculatePrice,
    simulateCalculation,

    // EVENT HANDLERS
    handleModifierChange,
    handleCustomValueChange,
    handleSectionToggle,

    // UTILITIES
    getAppliedModifiersFromItemData,
    setCustomValues,
    setExpandedSections,
  };
};
