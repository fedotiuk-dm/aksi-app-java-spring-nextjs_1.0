'use client';

import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { StepContainer } from '@/features/order-wizard/ui/components/step-container';
import { WizardStep } from '@/features/order-wizard/model/types/types';
import { StepNavigation } from '@/features/order-wizard/ui/components/step-navigation';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * Компонент для завершального кроку майстра замовлень - "Підтвердження замовлення"
 */
export const CompletionStep: React.FC = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Використовуємо селектори для отримання даних
  const totalAmount = useOrderWizardStore((state) => state.totalAmount);
  const items = useOrderWizardStore((state) => state.items);
  const selectedClient = useOrderWizardStore((state) => state.selectedClient);
  const navigateToStep = useOrderWizardStore((state) => state.navigateToStep);
  const resetWizard = useOrderWizardStore((state) => state.resetWizard);

  // Обробник повернення до попереднього кроку
  const handleBack = () => {
    navigateToStep(WizardStep.ITEM_MANAGER);
  };

  // Обробник оформлення замовлення
  const handleCompleteOrder = () => {
    // Тут буде логіка фінального збереження замовлення до бази даних
    alert('Замовлення успішно оформлено!');

    // Після успішного оформлення скидаємо всі дані
    resetWizard();

    // І повертаємо користувача на перший крок
    navigateToStep(WizardStep.CLIENT_SELECTION);
  };

  return (
    <StepContainer title="Підтвердження замовлення">
      <Paper
        elevation={0}
        sx={{
          p: isTablet ? 3 : 2,
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <VerifiedIcon
            color="success"
            fontSize={isTablet ? 'large' : 'medium'}
          />
          <Typography
            variant={isTablet ? 'h5' : 'h6'}
            color="success.dark"
            sx={{ fontWeight: 'medium' }}
          >
            Замовлення готове до оформлення
          </Typography>
        </Box>

        <Alert
          icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          severity="success"
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Перевірте деталі замовлення перед фінальним оформленням
        </Alert>

        <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Інформація про клієнта
            </Typography>
            <Typography>
              {selectedClient?.firstName} {selectedClient?.lastName}
            </Typography>
            <Typography>Телефон: {selectedClient?.phone}</Typography>
            {selectedClient?.email && (
              <Typography>Email: {selectedClient.email}</Typography>
            )}
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Інформація про замовлення
            </Typography>
            <Typography>
              Загальна кількість предметів: {items.length}
            </Typography>
            <Typography gutterBottom>
              Загальна вартість:{' '}
              {new Intl.NumberFormat('uk-UA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(totalAmount)}{' '}
              грн
            </Typography>

            {/* Тут у повній реалізації буде детальна інформація про замовлення */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              У повній реалізації тут буде відображатися детальна інформація про
              предмети замовлення, ціни, знижки та інші параметри.
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={2}
          sx={{ mb: 3, borderRadius: 2, bgcolor: theme.palette.primary.light }}
        >
          <CardContent>
            <Typography
              variant="subtitle1"
              color="primary.contrastText"
              gutterBottom
              fontWeight="bold"
            >
              Ви ознайомилися з умовами надання послуг?
            </Typography>
            <Typography variant="body2" color="primary.contrastText">
              Натискаючи кнопку &quot;Завершити та оформити замовлення&quot;, ви
              підтверджуєте, що ознайомилися з усіма умовами та правилами
              надання послуг хімчистки.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleCompleteOrder}
            sx={{
              minWidth: 240,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
            }}
          >
            Завершити та оформити замовлення
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: isTablet ? 4 : 3 }} />

      <StepNavigation
        onBack={handleBack}
        onNext={handleCompleteOrder}
        nextLabel="Завершити та оформити замовлення"
        buttonSize={isTablet ? 'large' : 'medium'}
      />
    </StepContainer>
  );
};
