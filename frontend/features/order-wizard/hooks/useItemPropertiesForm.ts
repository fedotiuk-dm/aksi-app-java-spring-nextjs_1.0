import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import {
  WizardStep,
  ItemWizardSubStep,
  OrderItem,
} from '@/features/order-wizard/model/types';
import { z } from 'zod';
import {
  itemPropertiesSchema,
  MaterialType,
  BaseColor,
  FillerType,
  WearDegree,
} from '@/features/order-wizard/model/schema/item-properties.schema';
import useItemProperties from '@/features/order-wizard/api/stages/stage2/item-properties';

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
      errors: FieldErrors<ItemPropertiesFormValues>;
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
  currentItem: OrderItem | null; // Використовуємо OrderItem замість власного типу
}

/**
 * Хук для форми характеристик предмета (підетап 2.2)
 * @returns {ItemPropertiesFormHookResult} Об'єкт з даними та методами для роботи з формою
 */
export const useItemPropertiesForm = (): ItemPropertiesFormHookResult => {
  // Дані з глобального стану - використовуємо окремі селектори для зменшення перерендерів
  const currentItem = useOrderWizardStore((state) => state.currentItem);
  const setCurrentItem = useOrderWizardStore((state) => state.setCurrentItem);
  const navigateToStep = useOrderWizardStore((state) => state.navigateToStep);
  const categoryId = useOrderWizardStore(
    (state) => state.currentItem?.categoryId
  );

  // Отримуємо дані з API
  const { useMaterialsForCategory } = useItemProperties();
  const { data: apiMaterials, isLoading: isMaterialsLoading } =
    useMaterialsForCategory(categoryId);

  // Створюємо локальний стан для відстеження стану завантаження
  const [loading, setLoading] = useState(false);

  // Ініціалізація форми з react-hook-form + zod
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
    trigger,
    reset,
  } = useForm<ItemPropertiesFormValues>({
    // Використовуємо as any для вирішення конфлікту типів між zodResolver та useForm
    // Це тимчасове рішення до оновлення бібліотек
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      notes: '',
    },
  });

  // Отримуємо поточні значення полів для реактивності
  const watchColorType = watch('colorType');
  const watchHasFiller = watch('hasFiller');
  const watchFillerType = watch('fillerType');
  const formValues = watch();

  // Логування змін форми для відлагодження
  useEffect(() => {
    console.log('Зміни в формі властивостей предмета:', {
      ...formValues,
      isValid,
      isDirty,
    });
  }, [formValues, isValid, isDirty]);

  // Визначаємо, які матеріали доступні для вибраної категорії
  const availableMaterials = useMemo(() => {
    console.log('API матеріали для категорії:', {
      categoryId,
      apiMaterials,
      isLoading: isMaterialsLoading,
    });

    // Якщо є дані з API, використовуємо їх
    if (apiMaterials && apiMaterials.length > 0) {
      return apiMaterials.map((material) => {
        // Конвертуємо API формат до нашого enum
        return material as MaterialType;
      });
    }

    // Інакше повертаємо всі доступні матеріали
    return Object.values(MaterialType);
  }, [apiMaterials, categoryId, isMaterialsLoading]);

  // Визначаємо, чи потрібен наповнювач для вибраної категорії
  const isFillerApplicable = useMemo(() => {
    if (!categoryId) return false;

    // Категорії, які можуть мати наповнювач
    const fillerCategories = [
      'OUTERWEAR', // Верхній одяг
      'BEDDING', // Постільна білизна
      'QUILTED', // Стьобані вироби
      'PILLOWS', // Подушки
      'BLANKETS', // Ковдри
    ];

    // Перевіряємо, чи належить категорія до списку
    return (
      fillerCategories.includes(categoryId.toString()) ||
      categoryId.toString().includes('FILL')
    );
  }, [categoryId]);

  // Обробник зміни типу кольору
  const handleColorTypeChange = useCallback(
    (colorType: BaseColor) => {
      setValue('colorType', colorType);

      // Якщо вибрано не CUSTOM, то очищаємо поле customColor
      if (colorType !== BaseColor.CUSTOM) {
        setValue('customColor', '');
      }

      // Валідуємо поля
      trigger(['colorType', 'customColor']);
    },
    [setValue, trigger]
  );

  // Обробник зміни наявності наповнювача
  const handleHasFillerChange = useCallback(
    (hasFiller: boolean) => {
      setValue('hasFiller', hasFiller);

      // Якщо немає наповнювача, очищаємо пов'язані поля
      if (!hasFiller) {
        setValue('fillerType', undefined);
        setValue('customFiller', '');
        setValue('isFillerLumpy', false);
      }

      // Валідуємо поля
      trigger(['hasFiller', 'fillerType', 'customFiller']);
    },
    [setValue, trigger]
  );

  // Обробник зміни типу наповнювача
  const handleFillerTypeChange = useCallback(
    (fillerType: FillerType) => {
      setValue('fillerType', fillerType);

      // Якщо вибрано не OTHER, то очищаємо поле customFiller
      if (fillerType !== FillerType.OTHER) {
        setValue('customFiller', '');
      }

      // Валідуємо поля
      trigger(['fillerType', 'customFiller']);
    },
    [setValue, trigger]
  );

  /**
   * Перевіряє, чи значення є валідним enum
   */
  const isValidEnum = <T extends Record<string, string>>(
    value: string | undefined,
    enumObject: T
  ): boolean => {
    if (!value) return false;
    return Object.values(enumObject).includes(value as T[keyof T]);
  };

  /**
   * Обробник збереження властивостей та переходу до наступного кроку
   * @param formData - дані форми
   */
  const handleSaveProperties: SubmitHandler<ItemPropertiesFormValues> =
    useCallback(
      (formData) => {
        if (!currentItem) {
          console.error('Неможливо зберегти - відсутній currentItem в стані');
          return;
        }

        console.log('Збереження властивостей предмета:', formData);

        // Отримуємо функцію оновлення поточного предмета
        const { updateCurrentItem } = useOrderWizardStore.getState();

        // Зберігаємо колір
        const color =
          formData.colorType === BaseColor.CUSTOM
            ? formData.customColor || ''
            : formData.colorType;

        // Зберігаємо наповнювач
        let filler = undefined;
        if (formData.hasFiller && formData.fillerType) {
          filler =
            formData.fillerType === FillerType.OTHER
              ? formData.customFiller
              : formData.fillerType;
        }

        // Оновлюємо currentItem у глобальному стані
        // Зберігаємо всі необхідні поля для типу OrderItem, включаючи обов'язкові
        const newItem: OrderItem = {
          ...currentItem,
          // Зберігаємо обов'язкові поля з попереднього стану
          id: currentItem.id,
          name: currentItem.name,
          quantity: currentItem.quantity,
          unitPrice: currentItem.unitPrice || 0,
          totalPrice: currentItem.totalPrice || 0,

          // Оновлюємо властивості характеристик предмета
          material: formData.material,
          color: String(color),
          filler: filler ? String(filler) : undefined,
          isFillerLumpy: formData.hasFiller
            ? formData.isFillerLumpy
            : undefined,
          wearDegree: formData.wearDegree,
          propertyNotes: formData.notes,

          // Зберігаємо інші важливі поля
          category: currentItem.category,
          categoryId: currentItem.categoryId,
          description: currentItem.description,
          stains: currentItem.stains || [],
          defects: currentItem.defects || [],
          defectsNotes: currentItem.defectsNotes,
          photos: currentItem.photos || [],
          specialInstructions: currentItem.specialInstructions,
        };

        console.log('Оновлений предмет перед збереженням:', newItem);
        setCurrentItem(newItem);

        // Зберігаємо оновлений предмет в масиві предметів, якщо це редагування існуючого
        updateCurrentItem();

        // Навігація до наступного підетапу
        navigateToStep(
          WizardStep.ITEM_WIZARD,
          ItemWizardSubStep.DEFECTS_STAINS
        );
      },
      [currentItem, setCurrentItem, navigateToStep]
    );

  // Обробник повернення на попередній підетап
  const handleBack = useCallback(() => {
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.BASIC_INFO);
  }, [navigateToStep]);

  // Обробник для збереження поточного кольору
  const handleCustomColorChange = useCallback(
    (color: string) => {
      setValue('customColor', color);
      trigger('customColor');
    },
    [setValue, trigger]
  );

  // Обробник для зміни ступеня зносу
  const handleWearDegreeChange = useCallback(
    (degree: WearDegree) => {
      setValue('wearDegree', degree);
      trigger('wearDegree');
    },
    [setValue, trigger]
  );

  // Обробник для перемикача грудкуватості наповнювача
  const handleFillerLumpyToggle = useCallback(
    (isLumpy: boolean) => {
      setValue('isFillerLumpy', isLumpy);
      trigger('isFillerLumpy');
    },
    [setValue, trigger]
  );

  // Обробник для зміни кастомного наповнювача
  const handleCustomFillerChange = useCallback(
    (value: string) => {
      setValue('customFiller', value);
      trigger('customFiller');
    },
    [setValue, trigger]
  );

  // Загортання функції handleSubmit для зручнішого використання
  const handleSaveAndNext = handleSubmit(handleSaveProperties);

  // Перейменовуємо деякі функції для відповідності інтерфейсу
  const handleFillerToggle = handleHasFillerChange;

  // Відстеження стану завантаження
  useEffect(() => {
    setLoading(isMaterialsLoading);
  }, [isMaterialsLoading]);

  // Заповнення форми при першому завантаженні або зміні currentItem
  useEffect(() => {
    if (currentItem) {
      console.log('Завантаження початкових даних з currentItem:', {
        material: currentItem.material,
        color: currentItem.color,
        filler: currentItem.filler,
        isFillerLumpy: currentItem.isFillerLumpy,
        wearDegree: currentItem.wearDegree,
        notes: currentItem.propertyNotes,
      });

      // Визначаємо тип кольору (базовий або кастомний)
      let colorType = BaseColor.BLACK;
      let customColor = '';

      // Перевіряємо, чи колір є одним із базових
      const isBaseColor = isValidEnum(currentItem.color, BaseColor);
      if (isBaseColor) {
        colorType = currentItem.color as BaseColor;
      } else if (currentItem.color) {
        colorType = BaseColor.CUSTOM;
        customColor = currentItem.color;
      }

      // Визначаємо тип наповнювача (якщо є)
      let hasFiller = !!currentItem.filler;
      let fillerType: FillerType | undefined = undefined;
      let customFiller = '';

      if (hasFiller) {
        // Перевіряємо, чи наповнювач є одним із стандартних типів
        const isStandardFiller = isValidEnum(currentItem.filler, FillerType);
        if (isStandardFiller) {
          fillerType = currentItem.filler as FillerType;
        } else if (currentItem.filler) {
          fillerType = FillerType.OTHER;
          customFiller = currentItem.filler || '';
        }
      }

      // Визначаємо ступінь зносу
      let wearDegree = WearDegree.WEAR_10;
      if (isValidEnum(currentItem.wearDegree, WearDegree)) {
        wearDegree = currentItem.wearDegree as WearDegree;
      }

      // Скидаємо форму з новими значеннями
      reset({
        material: isValidEnum(currentItem.material, MaterialType)
          ? (currentItem.material as MaterialType)
          : MaterialType.COTTON,
        colorType,
        customColor,
        hasFiller,
        fillerType,
        customFiller,
        isFillerLumpy: currentItem.isFillerLumpy || false,
        wearDegree,
        notes: currentItem.propertyNotes || '',
      });
    }
  }, [currentItem, reset]);

  // Мемоізуємо результат хука для уникнення зайвих перерендерів
  return useMemo(
    () => ({
      form: {
        control,
        formState: { isValid, errors },
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
      loading,
      currentItem,
    }),
    [
      control,
      errors,
      isValid,
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
      loading,
      currentItem,
    ]
  );
};
