'use client';

import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Alert,
  Fade,
} from '@mui/material';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { StepContainer } from '@/features/order-wizard/ui/shared/step-container';
import { WizardStep, ItemWizardSubStep } from '@/features/order-wizard/model/types/types';
import { ItemsTable, TotalAmount } from './components';
import { StepNavigation } from '@/features/order-wizard/ui/shared/step-navigation';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalculateIcon from '@mui/icons-material/Calculate';

/**
 * Компонент для 2.0 кроку майстра замовлень - "Менеджер предметів"
 */
export const ItemManagerStep: React.FC = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Використовуємо селектори для отримання даних про предмети
  const items = useOrderWizardStore((state) => state.items);
  const totalAmount = useOrderWizardStore((state) => state.totalAmount);
  const navigateToStep = useOrderWizardStore((state) => state.navigateToStep);
  const removeItem = useOrderWizardStore((state) => state.removeItem);
  const setCurrentItemIndex = useOrderWizardStore((state) => state.setCurrentItemIndex);

  // Стан для сповіщень
  const [showEmptyOrderAlert, setShowEmptyOrderAlert] = React.useState(false);

  // Обробники подій
  const handleAddItem = () => {
    // Перехід до підвізарда для додавання предмета з першим підетапом
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.BASIC_INFO);
  };

  const handleEditItem = (id: number) => {
    // Встановлюємо поточний предмет та переходимо до підвізарда з першим підетапом
    setCurrentItemIndex(id);
    navigateToStep(WizardStep.ITEM_WIZARD, ItemWizardSubStep.BASIC_INFO);
  };

  const handleDeleteItem = (id: number) => {
    // Видаляємо предмет
    removeItem(id);
  };

  const handleNext = () => {
    // Перевіряємо, чи є додані предмети
    if (items.length === 0) {
      setShowEmptyOrderAlert(true);
      setTimeout(() => setShowEmptyOrderAlert(false), 3000);
      return false;
    }
    // Перехід до наступного етапу
    navigateToStep(WizardStep.ORDER_PARAMS);
    return true;
  };

  const handleBack = () => {
    // Повернення до попереднього етапу
    navigateToStep(WizardStep.BASIC_INFO);
  };

  return (
    <StepContainer title="Менеджер предметів">
      <Paper
        elevation={0}
        sx={{
          p: isTablet ? 3 : 2,
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant={isTablet ? 'h5' : 'h6'}
            gutterBottom
            color="primary.dark"
            sx={{ fontWeight: 'medium' }}
          >
            Додані предмети замовлення
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Додайте один або більше предметів до замовлення. Ви можете редагувати або видаляти
            предмети у будь-який час.
          </Typography>
        </Box>

        <Fade in={showEmptyOrderAlert}>
          <Alert
            severity="warning"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setShowEmptyOrderAlert(false)}
          >
            Неможливо продовжити без додавання хоча б одного предмета до замовлення
          </Alert>
        </Fade>

        <Card
          elevation={2}
          sx={{
            mb: 3,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <ItemsTable items={items} onEdit={handleEditItem} onDelete={handleDeleteItem} />
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddItem}
              fullWidth
              size={isTablet ? 'large' : 'medium'}
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                py: isTablet ? 1.5 : 1,
                borderRadius: 2,
                fontWeight: 'medium',
              }}
            >
              Додати предмет
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CalculateIcon fontSize={isTablet ? 'large' : 'medium'} />
                <TotalAmount amount={totalAmount} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: isTablet ? 4 : 3 }} />

      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        nextLabel="Продовжити до наступного етапу"
        isNextDisabled={items.length === 0}
        buttonSize={isTablet ? 'large' : 'medium'}
      />
    </StepContainer>
  );
};
