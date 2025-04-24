/**
 * Форма з характеристиками предмета замовлення (Підетап 2.2)
 * Дозволяє вибрати матеріал, колір, наповнювач та ступінь зносу
 */
import React, { FC } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Button,
} from '@mui/material';

// Імпорт хуків та типів
import { 
  useItemPropertiesForm, 
  ItemPropertiesFormValues 
} from '@/features/order-wizard/hooks/useItemPropertiesForm';

// Імпорт API хуків для отримання реальних даних
import {
  useColors,
  useWearDegrees,
  useMaterialsByCategory,
  useCategoryNeedsFilling,
  useFillings
} from '@/features/order-wizard/api/hooks/useItemAttributes';

// Імпорт компонента контенту
import { ItemPropertiesContent } from './ItemPropertiesContent';

export interface ItemPropertiesFormProps {
  initialValues?: Partial<ItemPropertiesFormValues>;
  onSubmit: (values: ItemPropertiesFormValues) => void;
  onBack: () => void;
  isSubmitting?: boolean;
  categoryId: string;
}

/**
 * Компонент форми з характеристиками предмета замовлення (Підетап 2.2)
 * Включає матеріал, колір, наповнювач та ступінь зносу
 */
export const ItemPropertiesForm: FC<ItemPropertiesFormProps> = ({
  initialValues,
  onSubmit,
  onBack,
  isSubmitting = false,
  categoryId,
}) => {
  // Хук для роботи з формою
  const formProps = useItemPropertiesForm({
    initialValues,
    onSubmit,
    categoryId,
  });

  // Отримання всіх атрибутів через API
  const colors = useColors();
  const wearDegrees = useWearDegrees();
  const materials = useMaterialsByCategory(categoryId);
  const needsFilling = useCategoryNeedsFilling(categoryId);
  const fillings = useFillings();

  // Перевірка завантаження даних
  const isLoading = 
    colors.isLoading || 
    wearDegrees.isLoading || 
    materials.isLoading || 
    needsFilling.isLoading || 
    (needsFilling.needsFilling && fillings.isLoading);

  // Перевірка помилок
  const error = 
    colors.error || 
    wearDegrees.error || 
    materials.error || 
    needsFilling.error || 
    (needsFilling.needsFilling && fillings.error);

  // Показуємо індикатор завантаження
  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Завантаження характеристик предмета...
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Показуємо повідомлення про помилку
  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Помилка завантаження даних
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onBack} 
          sx={{ mt: 2 }}
        >
          Назад
        </Button>
      </Paper>
    );
  }

  // Перевірка, чи всі потрібні дані доступні
  const dataAvailable = 
    colors.colors.length > 0 && 
    wearDegrees.wearDegrees.length > 0 && 
    materials.materials.length > 0 && 
    (!needsFilling.needsFilling || fillings.fillings.length > 0);

  // Якщо даних немає, показуємо повідомлення
  if (!dataAvailable) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Деякі потрібні дані недоступні
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Доступні дані:
          <ul>
            <li>Кольори: {colors.colors.length}</li>
            <li>Ступені зносу: {wearDegrees.wearDegrees.length}</li>
            <li>Матеріали для категорії: {materials.materials.length}</li>
            {needsFilling.needsFilling && (
              <li>Наповнювачі: {fillings.fillings.length}</li>
            )}
          </ul>
        </Typography>
        <Button 
          variant="outlined" 
          onClick={onBack} 
          sx={{ mt: 2 }}
        >
          Назад
        </Button>
      </Paper>
    );
  }

  // Передаємо всі необхідні дані в компонент контенту
  return (
    <ItemPropertiesContent
      formProps={formProps}
      colorsData={colors.colors}
      wearDegreesData={wearDegrees.wearDegrees}
      materialsData={materials.materials}
      needsFilling={needsFilling.needsFilling}
      fillingsData={fillings.fillings}
      onBack={onBack}
      isSubmitting={isSubmitting}
    />
  );
};
