'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { useWizardForm } from '../WizardProvider';
import { useOrderWizardStore } from '../useOrderWizardStore';
import { type AutosaveData } from '../autosave';

interface StepReviewProps {
  autosaveData: AutosaveData;
  onStageCompleted?: (sessionId: string) => void;
}

export const StepReview: React.FC<StepReviewProps> = ({ autosaveData, onStageCompleted }) => {
  const { form } = useWizardForm();
  const { goToPreviousStep } = useOrderWizardStore();
  const [isCompleting, setIsCompleting] = useState(false);

  const formData = form.getValues();

  // Обробник завершення етапу
  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await autosaveData.completeStage1();

      // Викликаємо callback для переходу до наступного етапу
      if (onStageCompleted && autosaveData.sessionId) {
        onStageCompleted(autosaveData.sessionId);
      }
    } catch (error) {
      console.error('Помилка завершення етапу:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Підтвердження даних
      </Typography>

      <Stack spacing={3}>
        {/* Інформація про клієнта */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Інформація про клієнта
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Прізвище та ім&apos;я
              </Typography>
              <Typography variant="body1">
                {formData.clientData?.lastName} {formData.clientData?.firstName}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Телефон
              </Typography>
              <Typography variant="body1">{formData.clientData?.phone}</Typography>
            </Grid>

            {formData.clientData?.email && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{formData.clientData.email}</Typography>
              </Grid>
            )}

            {formData.clientData?.address && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Адреса
                </Typography>
                <Typography variant="body1">{formData.clientData.address}</Typography>
              </Grid>
            )}

            {formData.clientData?.communicationChannels && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Способи зв&apos;язку
                </Typography>
                <Stack direction="row" spacing={1}>
                  {formData.clientData.communicationChannels.map((channel: string) => (
                    <Chip key={channel} label={channel} size="small" />
                  ))}
                </Stack>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Інформація про замовлення */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Інформація про замовлення
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Номер квитанції
              </Typography>
              <Typography variant="body1">
                {formData.orderData?.receiptNumber || 'Не згенеровано'}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Унікальна мітка
              </Typography>
              <Typography variant="body1">{formData.orderData?.uniqueTag}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Філія
              </Typography>
              <Typography variant="body1">{formData.orderData?.selectedBranchId}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Дата створення
              </Typography>
              <Typography variant="body1">{new Date().toLocaleDateString('uk-UA')}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Стан системи */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Стан системи
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                ID сесії
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {autosaveData.sessionId}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Поточний стан
              </Typography>
              <Typography variant="body1">Готово до завершення</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Попередження */}
        <Alert severity="info">
          Перевірте всі дані перед завершенням етапу. Після завершення ви перейдете до управління
          предметами замовлення.
        </Alert>
      </Stack>

      {/* Кнопки навігації */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={goToPreviousStep} disabled={isCompleting}>
          Назад
        </Button>

        <Button
          variant="contained"
          onClick={handleComplete}
          disabled={isCompleting || autosaveData.isLoading}
          startIcon={isCompleting && <CircularProgress size={20} />}
        >
          {isCompleting ? 'Завершення...' : 'Завершити етап'}
        </Button>
      </Box>

      {/* Дебаг інформація */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" gutterBottom display="block">
            Debug - Current State:
          </Typography>
          <pre style={{ fontSize: '11px', margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(
              { sessionId: autosaveData.sessionId, isLoading: autosaveData.isLoading },
              null,
              2
            )}
          </pre>
        </Box>
      )}
    </Box>
  );
};
