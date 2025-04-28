import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { Control, FieldErrors, UseFormHandleSubmit, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { WizardStep, ItemWizardSubStep } from '@/features/order-wizard/model/types';
import { z } from 'zod';
import {
  itemPropertiesSchema,
  MaterialType,
  BaseColor,
  FillerType,
  WearDegree
} from '@/features/order-wizard/model/schema/item-properties.schema';

// Використовуємо z.infer для отримання типу зі схеми, це вирішує проблеми типізації
type ItemPropertiesFormValues = z.infer<typeof itemPropertiesSchema>;

/**
 * Інтерфейс результату хука useItemPropertiesForm
 * Описує всі дані та функції, які повертає хук
 */
export interface ItemPropertiesFormHookResult {
  form: {
    control: Control<ItemPropertiesFormValues>;
    formState: { 
      isValid: boolean; 
      errors: FieldErrors<ItemPropertiesFormValues> 
    };
  };
  handleSubmit: UseFormHandleSubmit<ItemPropertiesFormValues>;
  availableMaterials: MaterialType[];
  watchColorType: BaseColor;
  watchHasFiller: boolean;
  watchFillerType: FillerType | undefined;
  isFillerApplicable: boolean;
  handleColorTypeChange: (color: BaseColor) => void;
  handleCustomColorChange: (color: string) => void;
  handleFillerToggle: (hasFilter: boolean) => void;
  handleFillerTypeChange: (type: FillerType) => void;
  handleCustomFillerChange: (value: string) => void;
  handleFillerLumpyToggle: (isLumpy: boolean) => void;
  handleWearDegreeChange: (degree: WearDegree) => void;
  // Оновлений тип для handleSaveAndNext, щоб відповідав типу з useForm
  handleSaveAndNext: ReturnType<UseFormHandleSubmit<ItemPropertiesFormValues>>;
  handleBack: () => void;
  loading: boolean;
}

/**
 * Хук для форми характеристик предмета (підетап 2.2)
 * @returns {ItemPropertiesFormHookResult} Об'єкт з даними та методами для роботи з формою
 */
export const useItemPropertiesForm = (): ItemPropertiesFormHookResult => {
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
    formState: { errors, isValid },
    trigger
  } = useForm<ItemPropertiesFormValues>({
    // Використовуємо as any для вирішення конфлікту типів між zodResolver та useForm
    // Це тимчасове рішення до оновлення бібліотек
    resolver: zodResolver(itemPropertiesSchema) as any,
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
  
  /**
   * Обробник збереження властивостей та переходу до наступного кроку
   * @param formData - дані форми
   */
  const handleSaveProperties: SubmitHandler<ItemPropertiesFormValues> = useCallback((formData) => {
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
  
  // Обробник для збереження поточного кольору
  const handleCustomColorChange = useCallback((color: string) => {
    setValue('customColor', color);
    trigger('customColor');
  }, [setValue, trigger]);
  
  // Обробник для зміни ступеня зносу
  const handleWearDegreeChange = useCallback((degree: WearDegree) => {
    setValue('wearDegree', degree);
    trigger('wearDegree');
  }, [setValue, trigger]);
  
  // Обробник для перемикача грудкуватості наповнювача
  const handleFillerLumpyToggle = useCallback((isLumpy: boolean) => {
    setValue('isFillerLumpy', isLumpy);
    trigger('isFillerLumpy');
  }, [setValue, trigger]);
  
  // Обробник для зміни кастомного наповнювача
  const handleCustomFillerChange = useCallback((value: string) => {
    setValue('customFiller', value);
    trigger('customFiller');
  }, [setValue, trigger]);
  
  // Загортання функції handleSubmit для зручнішого використання
  const handleSaveAndNext = handleSubmit(handleSaveProperties as any);
  
  // Перейменовуємо деякі функції для відповідності інтерфейсу
  const handleFillerToggle = handleHasFillerChange;
  
  const loading = false; // Тут можна додати стейт завантаження, якщо потрібно
  
  // Мемоізуємо результат хука для уникнення зайвих перерендерів
  return useMemo(() => ({
    form: {
      control,
      formState: { isValid, errors }
    },
    handleSubmit,
    availableMaterials,
    watchColorType,
    watchHasFiller,
    watchFillerType,
    isFillerApplicable,
    handleColorTypeChange,
    handleCustomColorChange,
    handleFillerToggle,
    handleFillerTypeChange,
    handleCustomFillerChange,
    handleFillerLumpyToggle,
    handleWearDegreeChange,
    handleSaveAndNext,
    handleBack,
    loading
  }), [
    control, errors, isValid, handleSubmit,
    availableMaterials, watchColorType, watchHasFiller, watchFillerType, isFillerApplicable,
    handleColorTypeChange, handleCustomColorChange, handleFillerToggle,
    handleFillerTypeChange, handleCustomFillerChange, handleFillerLumpyToggle,
    handleWearDegreeChange, handleSaveAndNext, handleBack, loading
  ]);
};
