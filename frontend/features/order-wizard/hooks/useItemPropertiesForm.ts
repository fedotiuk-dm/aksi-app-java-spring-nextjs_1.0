import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { 
  itemPropertiesSchema, 
  ItemPropertiesFormValues,
  MaterialType,
  BaseColor,
  FillerType,
  WearDegree
} from '@/features/order-wizard/model/schema/item-properties.schema';
import { ItemWizardSubStep, WizardStep } from '@/features/order-wizard/model/types';

/**
 * Хук для форми характеристик предмета (підетап 2.2)
 */
export const useItemPropertiesForm = () => {
  // Дані з глобального стану - використовуємо окремі селектори для зменшення перерендерів
  const currentItem = useOrderWizardStore(state => state.currentItem);
  const setCurrentItem = useOrderWizardStore(state => state.setCurrentItem);
  const navigateToStep = useOrderWizardStore(state => state.navigateToStep);
  const categoryId = useOrderWizardStore(state => state.currentItem?.category);
  
  // Ініціалізація форми з react-hook-form + zod
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
    reset,
    trigger
  } = useForm<ItemPropertiesFormValues>({
    // @ts-expect-error - Проблема з типізацією zod resolver, буде виправлено в майбутніх версіях
    resolver: zodResolver(itemPropertiesSchema),
    mode: 'onChange',
    defaultValues: {
      material: MaterialType.COTTON,
      colorType: BaseColor.BLACK,
      customColor: '',
      hasFiller: false,
      fillerType: undefined,
      customFiller: '',
      isFillerLumpy: false,
      wearDegree: WearDegree.WEAR_10,
      notes: ''
    }
  });
  
  // Отримуємо поточні значення полів для реактивності
  const watchColorType = watch('colorType');
  const watchHasFiller = watch('hasFiller');
  const watchFillerType = watch('fillerType');

  // Визначаємо, які матеріали доступні для вибраної категорії
  const availableMaterials = useMemo(() => {
    // В цьому місці можна додати логіку для фільтрації матеріалів за categoryId
    // Наразі повертаємо всі матеріали
    return Object.values(MaterialType);
  }, []);
  
  // Визначаємо, чи потрібен наповнювач для вибраної категорії
  const isFillerApplicable = useMemo(() => {
    if (!categoryId) return false;
    
    // TODO: Додати логіку для визначення, чи потрібен наповнювач для вибраної категорії
    // Наприклад, для верхнього одягу та ковдр - потрібен
    // Наразі повертаємо true для демонстрації
    return true;
  }, [categoryId]); // Залежність від categoryId потрібна, тому залишаємо
  
  // Обробник зміни типу кольору
  const handleColorTypeChange = useCallback((colorType: BaseColor) => {
    setValue('colorType', colorType);
    
    // Якщо вибрано не CUSTOM, то очищаємо поле customColor
    if (colorType !== BaseColor.CUSTOM) {
      setValue('customColor', '');
    }
    
    // Валідуємо поля
    trigger(['colorType', 'customColor']);
  }, [setValue, trigger]);
  
  // Обробник зміни наявності наповнювача
  const handleHasFillerChange = useCallback((hasFiller: boolean) => {
    setValue('hasFiller', hasFiller);
    
    // Якщо немає наповнювача, очищаємо пов'язані поля
    if (!hasFiller) {
      setValue('fillerType', undefined);
      setValue('customFiller', '');
      setValue('isFillerLumpy', false);
    }
    
    // Валідуємо поля
    trigger(['hasFiller', 'fillerType', 'customFiller']);
  }, [setValue, trigger]);
  
  // Обробник зміни типу наповнювача
  const handleFillerTypeChange = useCallback((fillerType: FillerType) => {
    setValue('fillerType', fillerType);
    
    // Якщо вибрано не OTHER, то очищаємо поле customFiller
    if (fillerType !== FillerType.OTHER) {
      setValue('customFiller', '');
    }
    
    // Валідуємо поля
    trigger(['fillerType', 'customFiller']);
  }, [setValue, trigger]);
  
  // Обробник успішної валідації форми
  const handleSaveProperties = useCallback((formData: ItemPropertiesFormValues) => {
    if (!currentItem) return;
    
    // Зберігаємо колір
    const color = formData.colorType === BaseColor.CUSTOM
      ? formData.customColor || ''
      : formData.colorType;
    
    // Зберігаємо наповнювач
    let filler = undefined;
    if (formData.hasFiller && formData.fillerType) {
      filler = formData.fillerType === FillerType.OTHER
        ? formData.customFiller
        : formData.fillerType;
    }
    
    // Оновлюємо currentItem у глобальному стані
    const newItem = {
      ...currentItem,
      material: formData.material,
      color: String(color),
      filler: filler ? String(filler) : undefined,
      isFillerLumpy: formData.hasFiller ? formData.isFillerLumpy : undefined,
      wearDegree: formData.wearDegree,
      propertyNotes: formData.notes
    };
    
    setCurrentItem(newItem);
    
    // Навігація до наступного підетапу
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.DEFECTS_STAINS);
  }, [currentItem, setCurrentItem, navigateToStep]);
  
  // Обробник повернення на попередній підетап
  const handleBack = useCallback(() => {
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.BASIC_INFO);
  }, [navigateToStep]);
  
  // Мемоізуємо об'єкт для запобігання зайвим перерендерам
  return useMemo(() => ({
    // Форма
    form: {
      control,
      formState: { errors, isValid, isDirty },
      handleSubmit,
      watch,
      setValue,
      reset
    },
    
    // Дані
    availableMaterials,
    isFillerApplicable,
    showCustomColorField: watchColorType === BaseColor.CUSTOM,
    showFillerFields: watchHasFiller,
    showCustomFillerField: watchHasFiller && watchFillerType === FillerType.OTHER,
    
    // Обробники подій
    handleColorTypeChange,
    handleHasFillerChange,
    handleFillerTypeChange,
    handleSaveProperties,
    handleBack
  }), [
    control, errors, isValid, isDirty, handleSubmit, watch, setValue, reset,
    availableMaterials, isFillerApplicable, watchColorType, watchHasFiller, watchFillerType,
    handleColorTypeChange, handleHasFillerChange, handleFillerTypeChange, 
    handleSaveProperties, handleBack
  ]);
};
