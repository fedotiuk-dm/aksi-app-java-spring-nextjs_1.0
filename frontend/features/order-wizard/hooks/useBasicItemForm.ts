/**
 * Хук для роботи з формою базової інформації про предмет
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicItemSchema } from '@/features/order-wizard/model/schema/item.schema';
import { z } from 'zod';

// Типи форми, з використанням zod-схеми
export type BasicItemFormValues = z.infer<typeof basicItemSchema>;

// Тип для форми, щоб забезпечити правильну типізацію
export type FormValues = {
  name: string;
  categoryId: string;
  priceListItemId: string;
  quantity: number;
  unitOfMeasurement: 'PIECE' | 'KILOGRAM';
  defectNotes?: string;
  id?: string;
  localId?: string;
};

interface UseBasicItemFormProps {
  initialValues?: Partial<BasicItemFormValues>;
  onSubmit: (values: BasicItemFormValues) => void;
}

/**
 * Хук для керування формою базової інформації про предмет
 */
export const useBasicItemForm = ({ initialValues, onSubmit }: UseBasicItemFormProps) => {
  // Налаштування форми з валідацією
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    // @ts-ignore - zodResolver має несумісність типів, але працює коректно
    resolver: zodResolver(basicItemSchema),
    defaultValues: {
      name: initialValues?.name || '',
      categoryId: initialValues?.categoryId || '',
      priceListItemId: initialValues?.priceListItemId || '',
      quantity: initialValues?.quantity || 1,
      unitOfMeasurement: initialValues?.unitOfMeasurement || 'PIECE',
      defectNotes: initialValues?.defectNotes || '',
      id: initialValues?.id,
      localId: initialValues?.localId,
    },
    mode: 'onChange',
  });

  // Обробник відправки форми
  const handleFormSubmit = handleSubmit((data) => {
    // Явне приведення типів
    const formData: BasicItemFormValues = {
      name: data.name,
      categoryId: data.categoryId,
      priceListItemId: data.priceListItemId,
      quantity: data.quantity,
      unitOfMeasurement: data.unitOfMeasurement,
    };
    
    // Копіюємо необов'язкові поля
    if (data.defectNotes) formData.defectNotes = data.defectNotes;
    if (data.id) formData.id = data.id;
    if (data.localId) formData.localId = data.localId;
    
    onSubmit(formData);
  });

  // Значення полів для зовнішнього використання
  const categoryId = watch('categoryId');
  const priceListItemId = watch('priceListItemId');

  return {
    control,
    setValue,
    errors,
    isValid,
    handleFormSubmit,
    categoryId,
    priceListItemId,
  };
};
