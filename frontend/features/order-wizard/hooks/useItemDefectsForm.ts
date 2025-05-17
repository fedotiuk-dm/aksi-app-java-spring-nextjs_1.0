import { useCallback, useMemo, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { z } from 'zod';
import {
  itemDefectsSchema,
  Defect,
  Stain,
  DefectType,
  StainType,
} from '@/features/order-wizard/model/schema/item-defects.schema';
import {
  WizardStep,
  ItemWizardSubStep,
} from '@/features/order-wizard/model/types';
import useItemDefects from '@/features/order-wizard/api/stages/stage2/item-defects';

// Використовуємо z.infer для отримання типу зі схеми, це вирішує проблеми типізації
type ItemDefectsFormValues = z.infer<typeof itemDefectsSchema>;

/**
 * Хук для форми плям та дефектів предмета (підетап 2.3)
 */
export const useItemDefectsForm = () => {
  // Отримуємо дані з глобального стану
  const currentItem = useOrderWizardStore((state) => state.currentItem);
  const setCurrentItem = useOrderWizardStore((state) => state.setCurrentItem);
  const navigateToStep = useOrderWizardStore((state) => state.navigateToStep);

  // Отримуємо типи плям і дефектів з API
  const { useStainTypes, useDefectsAndRisks } = useItemDefects();
  const { data: stainTypes = [], isLoading: isLoadingStains } = useStainTypes();
  const { data: defectTypes = [], isLoading: isLoadingDefects } =
    useDefectsAndRisks();

  // Ініціалізація форми з react-hook-form + zod
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<ItemDefectsFormValues>({
    // Використовуємо as any для вирішення конфлікту типів між zodResolver та useForm
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(itemDefectsSchema) as any,
    mode: 'onChange',
    defaultValues: {
      stains: [],
      defects: [],
      notes: '',
    },
  });

  // Дивимось за змінами в формі для відлагодження
  const formValues = watch();

  // Відстежуємо зміни в формі для логування
  useEffect(() => {
    console.log('Поточний стан форми DefectsStains:', {
      stains: formValues.stains,
      defects: formValues.defects,
      notes: formValues.notes,
      isValid,
      isDirty,
    });
  }, [formValues, isValid, isDirty]);

  // Ініціалізація fieldArray для роботи з масивами плям та дефектів
  const stainsFieldArray = useFieldArray({
    control,
    name: 'stains',
  });

  const defectsFieldArray = useFieldArray({
    control,
    name: 'defects',
  });

  // Доступні типи плям для вибору
  const availableStainTypes = useMemo(() => {
    console.log('Завантаження типів плям з API:', {
      isLoading: isLoadingStains,
      typesCount: stainTypes.length,
      types: stainTypes,
    });

    // Конвертуємо строкові значення з API у відповідні enum
    return stainTypes.map((stainType) => {
      // Приводимо до формату, який відповідає StainType enum
      const formattedType = stainType
        .toUpperCase()
        .replace(/ /g, '_') as StainType;

      return {
        value: formattedType,
        label: stainType,
      };
    });
  }, [stainTypes, isLoadingStains]);

  // Доступні типи дефектів та ризиків для вибору
  const availableDefectTypes = useMemo(() => {
    console.log('Завантаження типів дефектів з API:', {
      isLoading: isLoadingDefects,
      typesCount: defectTypes.length,
      types: defectTypes,
    });

    // Конвертуємо строкові значення з API у відповідні enum
    return defectTypes.map((defectType) => {
      // Приводимо до формату, який відповідає DefectType enum
      const formattedType = defectType
        .toUpperCase()
        .replace(/ /g, '_') as DefectType;

      return {
        value: formattedType,
        label: defectType,
      };
    });
  }, [defectTypes, isLoadingDefects]);

  // Додавання нової плями
  const handleAddStain = useCallback(
    (stainType: StainType, description?: string) => {
      console.log('Додавання нової плями:', { type: stainType, description });

      const newStain: Stain = {
        type: stainType,
        description: stainType === StainType.OTHER ? description : undefined,
      };

      stainsFieldArray.append(newStain);
    },
    [stainsFieldArray]
  );

  // Видалення плями
  const handleRemoveStain = useCallback(
    (index: number) => {
      console.log('Видалення плями:', {
        index,
        stain: stainsFieldArray.fields[index],
      });
      stainsFieldArray.remove(index);
    },
    [stainsFieldArray]
  );

  // Додавання нового дефекту
  const handleAddDefect = useCallback(
    (defectType: DefectType, description?: string) => {
      console.log('Додавання нового дефекту:', {
        type: defectType,
        description,
      });

      const newDefect: Defect = {
        type: defectType,
        description:
          defectType === DefectType.NO_GUARANTEE ? description : undefined,
      };

      defectsFieldArray.append(newDefect);
    },
    [defectsFieldArray]
  );

  // Видалення дефекту
  const handleRemoveDefect = useCallback(
    (index: number) => {
      console.log('Видалення дефекту:', {
        index,
        defect: defectsFieldArray.fields[index],
      });
      defectsFieldArray.remove(index);
    },
    [defectsFieldArray]
  );

  // Обробник успішної валідації форми
  const handleSaveDefects = useCallback(
    (formData: ItemDefectsFormValues) => {
      console.log('Збереження плям та дефектів:', formData);

      if (!currentItem) {
        console.error('Неможливо зберегти - відсутній currentItem в стані');
        return;
      }

      // Отримуємо функцію оновлення поточного предмета
      const { updateCurrentItem } = useOrderWizardStore.getState();

      // Оновлюємо currentItem у глобальному стані
      const newItem = {
        ...currentItem,
        stains: formData.stains,
        defects: formData.defects,
        defectsNotes: formData.notes,
      };

      console.log('Оновлені дані предмета перед збереженням:', newItem);
      setCurrentItem(newItem);

      // Зберігаємо оновлений предмет в масиві предметів, якщо це редагування існуючого
      updateCurrentItem();

      // Навігація до наступного підетапу
      navigateToStep(
        WizardStep.ITEM_WIZARD,
        ItemWizardSubStep.PRICE_CALCULATOR
      );
    },
    [currentItem, setCurrentItem, navigateToStep]
  );

  // Обробник повернення на попередній підетап
  const handleBack = useCallback(() => {
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.ITEM_PROPERTIES);
  }, [navigateToStep]);

  // Завантаження початкових даних з currentItem, якщо є
  useEffect(() => {
    if (
      currentItem?.stains ||
      currentItem?.defects ||
      currentItem?.defectsNotes
    ) {
      console.log('Завантаження початкових даних з currentItem:', {
        stains: currentItem.stains,
        defects: currentItem.defects,
        notes: currentItem.defectsNotes,
      });

      reset({
        stains: currentItem.stains || [],
        defects: currentItem.defects || [],
        notes: currentItem.defectsNotes || '',
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
    isValid,
    isLoading: isLoadingStains || isLoadingDefects,
  };
};

export default useItemDefectsForm;
