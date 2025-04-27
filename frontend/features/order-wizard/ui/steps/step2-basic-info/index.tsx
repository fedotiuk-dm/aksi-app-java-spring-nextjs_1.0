import React from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import type { UUID } from 'node:crypto';
import {
  BranchLocationSelect,
  TagNumberInput
} from './components';
import { StepContainer } from '@/features/order-wizard/ui/components/step-container';

/**
 * Компонент для 1.2 кроку майстра замовлень - "Базова інформація"
 */
export const BasicInfoStep: React.FC = () => {
  // Використовуємо окремі селектори для кожного поля, щоб уникнути безкінечних циклів
  const branchLocationId = useOrderWizardStore((state) => state.branchLocationId);
  const tagNumber = useOrderWizardStore((state) => state.tagNumber);
  const setBranchLocationId = useOrderWizardStore((state) => state.setBranchLocationId);
  const setTagNumber = useOrderWizardStore((state) => state.setTagNumber);
  
  // Обробник зміни значення філії
  const handleBranchLocationChange = React.useCallback((value: string | null) => {
    if (value && value !== '') {
      setBranchLocationId(value as UUID);
    } else {
      setBranchLocationId(null);
    }
  }, [setBranchLocationId]);

  // Стан для зберігання помилок валідації
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Валідація перед переходом до наступного кроку
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!branchLocationId) {
      newErrors.branchLocationId = 'Виберіть філію';
    }

    if (!tagNumber?.trim()) {
      newErrors.tagNumber = 'Введіть номер бирки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <StepContainer 
      title="1.2 Базова інформація замовлення"
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Вкажіть базову інформацію для створення замовлення
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Номер квитанції (генерується автоматично) */}
            <Typography variant="body1" gutterBottom>
              <strong>Номер квитанції:</strong> Буде згенеровано автоматично
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Дата створення замовлення (автоматично) */}
            <Typography variant="body1" gutterBottom>
              <strong>Дата створення:</strong> {new Date().toLocaleDateString('uk-UA')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Унікальна мітка (вводиться вручну або сканується) */}
            <TagNumberInput
              value={tagNumber || ''}
              onChange={setTagNumber}
              error={errors.tagNumber}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Пункт прийому замовлення (вибір філії) */}
            <BranchLocationSelect
              value={branchLocationId}
              onChange={handleBranchLocationChange}
              error={errors.branchLocationId}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={validate}
        >
          Далі
        </Button>
      </Box>
    </StepContainer>
  );
};
