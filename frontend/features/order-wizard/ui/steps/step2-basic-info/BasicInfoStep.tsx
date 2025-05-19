import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Divider,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  Alert,
  Fade,
} from '@mui/material';
import { useOrderWizardStore } from '@/features/order-wizard/model/store/store';
import { WizardStep } from '@/features/order-wizard/model/types';
import type { UUID } from 'node:crypto';
import { BranchLocationSelect, TagNumberInput } from '.';
import { StepContainer } from '@/features/order-wizard/ui/shared/step-container';
import { StepNavigation } from '@/features/order-wizard/ui/shared/step-navigation';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * Компонент для 2 кроку майстра замовлень - "Базова інформація"
 */
export const BasicInfoStep: React.FC = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  // Використовуємо окремі селектори для кожного поля, щоб уникнути безкінечних циклів
  const branchLocationId = useOrderWizardStore((state) => state.branchLocationId);
  const tagNumber = useOrderWizardStore((state) => state.tagNumber);
  const setBranchLocationId = useOrderWizardStore((state) => state.setBranchLocationId);
  const setTagNumber = useOrderWizardStore((state) => state.setTagNumber);
  const navigateToStep = useOrderWizardStore((state) => state.navigateToStep);

  // Обробник зміни значення філії
  const handleBranchLocationChange = React.useCallback(
    (value: string | null) => {
      if (value && value !== '') {
        setBranchLocationId(value as UUID);
      } else {
        setBranchLocationId(null);
      }
    },
    [setBranchLocationId]
  );

  // Стан для зберігання помилок валідації
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showValidationError, setShowValidationError] = React.useState(false);

  // Валідація перед переходом до наступного кроку
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!branchLocationId) {
      newErrors.branchLocationId = 'Оберіть пункт прийому замовлення';
    }

    if (!tagNumber?.trim()) {
      newErrors.tagNumber = 'Введіть номер бирки замовлення';
    }

    setErrors(newErrors);

    // Якщо помилок немає, переходимо до наступного кроку
    if (Object.keys(newErrors).length === 0) {
      navigateToStep(WizardStep.ITEM_MANAGER);
      return true;
    }

    setShowValidationError(true);
    setTimeout(() => setShowValidationError(false), 5000);
    return false;
  };

  // Обробник повернення до попереднього кроку
  const handleGoBack = () => {
    navigateToStep(WizardStep.CLIENT_SELECTION);
  };

  return (
    <StepContainer title="Базова інформація замовлення">
      <Paper
        elevation={0}
        sx={{
          p: isTablet ? 3 : 2,
          bgcolor: 'background.default',
          borderRadius: 2,
        }}
      >
        <Typography
          variant={isTablet ? 'h5' : 'h6'}
          gutterBottom
          color="primary.dark"
          sx={{ fontWeight: 'medium', mb: 3 }}
        >
          Вкажіть базові дані для створення замовлення
        </Typography>

        <Fade in={showValidationError}>
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setShowValidationError(false)}
          >
            Будь ласка, заповніть всі обов&apos;apos;язкові поля перед продовженням
          </Alert>
        </Fade>

        <Grid container spacing={isTablet ? 4 : 3}>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Автоматично згенеровані поля */}
            <Card
              elevation={2}
              sx={{
                mb: { xs: 2, md: 0 },
                height: '100%',
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: isTablet ? '1.1rem' : '1rem',
                  }}
                >
                  Системна інформація
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Stack spacing={3}>
                    {/* Номер квитанції */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <ReceiptIcon color="primary" fontSize={isTablet ? 'medium' : 'small'} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Номер квитанції:
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          sx={{ fontSize: isTablet ? '1.1rem' : '1rem' }}
                        >
                          Буде згенеровано автоматично
                        </Typography>
                      </Box>
                    </Box>

                    {/* Дата створення */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CalendarTodayIcon color="primary" fontSize={isTablet ? 'medium' : 'small'} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Дата створення:
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          sx={{ fontSize: isTablet ? '1.1rem' : '1rem' }}
                        >
                          {new Date().toLocaleDateString('uk-UA', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            {/* Поля вводу користувача */}
            <Card
              elevation={2}
              sx={{
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: isTablet ? '1.1rem' : '1rem',
                  }}
                >
                  Інформація про замовлення
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Stack spacing={4}>
                    {/* Номер бирки */}
                    <TagNumberInput
                      value={tagNumber || ''}
                      onChange={setTagNumber}
                      error={errors.tagNumber}
                    />

                    {/* Пункт прийому замовлення */}
                    <BranchLocationSelect
                      value={branchLocationId}
                      onChange={handleBranchLocationChange}
                      error={errors.branchLocationId}
                    />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: isTablet ? 4 : 3 }} />

      {/* Навігаційні кнопки з використанням компонента StepNavigation */}
      <StepNavigation
        onBack={handleGoBack}
        onNext={validate}
        nextLabel="Продовжити"
        buttonSize={isTablet ? 'large' : 'medium'}
      />
    </StepContainer>
  );
};
