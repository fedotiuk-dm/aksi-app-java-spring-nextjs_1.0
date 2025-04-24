/**
 * Хук для роботи з формою характеристик предмета (підетап 2.2)
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { itemPropertiesSchema } from '@/features/order-wizard/model/schema/item.schema';
import { z } from 'zod';
import { useEffect } from 'react';
import type { BaseSyntheticEvent } from 'react';

// Типи форми, з використанням zod-схеми
export type ItemPropertiesFormValues = z.infer<typeof itemPropertiesSchema>;

/**
 * Тип для результату функції useItemPropertiesForm
 */
export interface UseItemPropertiesFormReturn {
  // Використовуємо тип any під eslint-disable, оскільки це необхідно для сумісності
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // react-hook-form control
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any; // форма помилок
  handleFormSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: (fieldName?: string) => any; // функція перегляду значень
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (name: string, value: any, options?: { shouldValidate?: boolean; shouldDirty?: boolean; shouldTouch?: boolean }) => void; // функція встановлення значень
  trigger: (name?: string) => Promise<boolean>; // функція тригеру валідації
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValues: (fieldName?: string) => any; // функція отримання значень
  isValid: boolean;
  categoryId?: string; // опціональний ID категорії
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reset?: (values?: any) => void; // функція скидання форми
}

interface UseItemPropertiesFormProps {
  initialValues?: Partial<ItemPropertiesFormValues>;
  onSubmit: (values: ItemPropertiesFormValues) => void;
  categoryId: string; // Необхідно для умовного відображення полів
}

/**
 * Хук для керування формою характеристик предмета замовлення
 */
export const useItemPropertiesForm = ({ 
  initialValues, 
  onSubmit,
  categoryId 
}: UseItemPropertiesFormProps) => {
  // Налаштування форми з валідацією
  const { 
    control, 
    watch, 
    setValue, 
    handleSubmit, 
    getValues, 
    formState: { errors, isValid }, 
    trigger, 
    reset 
  } = useForm<ItemPropertiesFormValues>({
    // @ts-ignore - обхід помилки типізації zodResolver
    resolver: zodResolver(itemPropertiesSchema),
    defaultValues: {
      materialType: initialValues?.materialType || '',
      color: initialValues?.color || '',
      customColor: initialValues?.customColor || '',
      filling: initialValues?.filling || '',
      isFillingFlattened: initialValues?.isFillingFlattened || false,
      wearDegree: initialValues?.wearDegree || 10,
    },
    mode: 'onChange',
  });

  // Спостерігаємо за зміною кольору - якщо вибрано 'custom', активуємо поле кастомного кольору
  const colorValue = watch('color');

  useEffect(() => {
    // Якщо колір не "custom", очищуємо поле кастомного кольору
    if (colorValue !== 'custom') {
      setValue('customColor', '');
    }
  }, [colorValue, setValue]);

  // При зміні категорії скидаємо значення матеріалу
  useEffect(() => {
    if (categoryId) {
      setValue('materialType', '');
    }
  }, [categoryId, setValue]);

  // Обробник відправки форми
  // @ts-ignore - обхід помилки типізації handleSubmit
  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data as unknown as ItemPropertiesFormValues);
  });

  // Використовуємо повернення усіх необхідних проперті форми
  // Використовуємо явне перетворення типів для виправлення помилок типізації
  return {
    control,
    setValue,
    errors,
    isValid,
    handleFormSubmit,
    watch,
    reset,
    getValues,
    trigger,
    categoryId,
  } as unknown as UseItemPropertiesFormReturn;
};
