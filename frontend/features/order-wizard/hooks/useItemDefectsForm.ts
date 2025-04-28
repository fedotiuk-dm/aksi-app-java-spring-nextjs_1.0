import { useCallback, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import {
  itemDefectsSchema,
  ItemDefectsFormValues,
  StainType,
  DefectType,
  Stain,
  Defect
} from '@/features/order-wizard/model/schema/item-defects.schema';
import { WizardStep, ItemWizardSubStep } from '@/features/order-wizard/model/types';
import useItemDefects from '@/features/order-wizard/api/stages/stage2/item-defects';

/**
 * Хук для форми плям та дефектів предмета (підетап 2.3)
 */
export const useItemDefectsForm = () => {
  // Отримуємо дані з глобального стану
  const currentItem = useOrderWizardStore(state => state.currentItem);
  const setCurrentItem = useOrderWizardStore(state => state.setCurrentItem);
  const navigateToStep = useOrderWizardStore(state => state.navigateToStep);

  // Отримуємо типи плям і дефектів з API
  const { useStainTypes, useDefectsAndRisks } = useItemDefects();
  const { data: stainTypes = [] } = useStainTypes();
  const { data: defectTypes = [] } = useDefectsAndRisks();

  // Ініціалізація форми з react-hook-form + zod
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<ItemDefectsFormValues>({
    // @ts-expect-error - Проблема з типізацією zod resolver
    resolver: zodResolver(itemDefectsSchema),
    mode: 'onChange',
    defaultValues: {
      stains: [],
      defects: [],
      notes: ''
    }
  });

  // Ініціалізація fieldArray для роботи з масивами плям та дефектів
  const stainsFieldArray = useFieldArray({
    control,
    name: 'stains'
  });

  const defectsFieldArray = useFieldArray({
    control,
    name: 'defects'
  });

  // Доступні типи плям для вибору 
  const availableStainTypes = useMemo(() => {
    // Конвертуємо строкові значення з API у відповідні enum
    return stainTypes.map(stainType => {
      // Приводимо до формату, який відповідає StainType enum
      const formattedType = stainType
        .toUpperCase()
        .replace(/ /g, '_') as StainType;
      
      return {
        value: formattedType,
        label: stainType
      };
    });
  }, [stainTypes]);

  // Доступні типи дефектів та ризиків для вибору
  const availableDefectTypes = useMemo(() => {
    // Конвертуємо строкові значення з API у відповідні enum
    return defectTypes.map(defectType => {
      // Приводимо до формату, який відповідає DefectType enum
      const formattedType = defectType
        .toUpperCase()
        .replace(/ /g, '_') as DefectType;
      
      return {
        value: formattedType,
        label: defectType
      };
    });
  }, [defectTypes]);

  // Додавання нової плями
  const handleAddStain = useCallback((stainType: StainType) => {
    const newStain: Stain = {
      type: stainType,
      description: stainType === StainType.OTHER ? '' : undefined
    };
    
    stainsFieldArray.append(newStain);
  }, [stainsFieldArray]);

  // Видалення плями
  const handleRemoveStain = useCallback((index: number) => {
    stainsFieldArray.remove(index);
  }, [stainsFieldArray]);

  // Додавання нового дефекту
  const handleAddDefect = useCallback((defectType: DefectType) => {
    const newDefect: Defect = {
      type: defectType,
      description: defectType === DefectType.NO_GUARANTEE ? '' : undefined
    };
    
    defectsFieldArray.append(newDefect);
  }, [defectsFieldArray]);

  // Видалення дефекту
  const handleRemoveDefect = useCallback((index: number) => {
    defectsFieldArray.remove(index);
  }, [defectsFieldArray]);

  // Обробник успішної валідації форми
  const handleSaveDefects = useCallback((formData: ItemDefectsFormValues) => {
    if (!currentItem) return;
    
    // Оновлюємо currentItem у глобальному стані
    const newItem = {
      ...currentItem,
      stains: formData.stains,
      defects: formData.defects,
      defectsNotes: formData.notes
    };
    
    setCurrentItem(newItem);
    
    // Навігація до наступного підетапу
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.PRICE_CALCULATOR);
  }, [currentItem, setCurrentItem, navigateToStep]);

  // Обробник повернення на попередній підетап
  const handleBack = useCallback(() => {
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.ITEM_PROPERTIES);
  }, [navigateToStep]);

  // Завантаження початкових даних з currentItem, якщо є
  useMemo(() => {
    if (currentItem?.stains || currentItem?.defects) {
      reset({
        stains: currentItem.stains || [],
        defects: currentItem.defects || [],
        notes: currentItem.defectsNotes || ''
      });
    }
  }, [currentItem, reset]);

  return {
    control,
    errors,
    stainsFields: stainsFieldArray.fields,
    defectsFields: defectsFieldArray.fields,
    handleSubmit,
    handleAddStain,
    handleRemoveStain,
    handleAddDefect,
    handleRemoveDefect,
    handleSaveDefects,
    handleBack,
    availableStainTypes,
    availableDefectTypes,
    isValid
  };
};

export default useItemDefectsForm;
