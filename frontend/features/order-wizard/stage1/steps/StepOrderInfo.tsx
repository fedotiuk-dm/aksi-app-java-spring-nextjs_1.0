'use client';

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useWizardForm } from '../WizardProvider';
import { useOrderWizardStore } from '../useOrderWizardStore';
import { type AutosaveData } from '../autosave';
import { type BranchLocationDTO } from '@/shared/api/generated/stage1';

interface StepOrderInfoProps {
  autosaveData: AutosaveData;
}

export const StepOrderInfo: React.FC<StepOrderInfoProps> = ({ autosaveData }) => {
  const { form } = useWizardForm();
  const { goToNextStep, goToPreviousStep } = useOrderWizardStore();

  const { control, watch } = form;
  const selectedBranchId = watch('orderData.selectedBranchId');
  const receiptNumber = watch('orderData.receiptNumber');

  // Обробник переходу до наступного кроку
  const handleNext = () => {
    if (selectedBranchId && selectedBranchId.trim() !== '' && receiptNumber) {
      goToNextStep();
    }
  };

  // Список філій з API
  const branches = Array.isArray(autosaveData.branchList) ? autosaveData.branchList : [];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Інформація про замовлення
      </Typography>

      <Stack spacing={3}>
        {/* Вибір філії */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Пункт прийому замовлення
          </Typography>

          <Controller
            name="orderData.selectedBranchId"
            control={control}
            rules={{ required: 'Оберіть філію' }}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>Філія *</InputLabel>
                <Select
                  {...field}
                  value={field.value || ''}
                  label="Філія *"
                  disabled={branches.length === 0}
                >
                  {branches.length > 0 ? (
                    branches.map((branch: BranchLocationDTO) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        <Box>
                          <Typography variant="body1">{branch.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {branch.address}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <Typography color="text.secondary">Завантаження філій...</Typography>
                    </MenuItem>
                  )}
                </Select>
                {error && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {error.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />
        </Paper>

        {/* Номер квитанції */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Номер квитанції
          </Typography>

          {autosaveData.generatedReceiptNumber ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Номер квитанції згенеровано автоматично
            </Alert>
          ) : (
            selectedBranchId && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Номер квитанції буде згенеровано після вибору філії
              </Alert>
            )
          )}

          <Controller
            name="orderData.receiptNumber"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Номер квитанції"
                fullWidth
                disabled
                value={field.value || autosaveData.generatedReceiptNumber || ''}
                helperText="Генерується автоматично після вибору філії"
              />
            )}
          />
        </Paper>

        {/* Унікальна мітка */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Унікальна мітка
          </Typography>

          <Controller
            name="orderData.uniqueTag"
            control={control}
            rules={{
              required: "Унікальна мітка обов'язкова",
              minLength: { value: 3, message: 'Мінімум 3 символи' },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Унікальна мітка *"
                placeholder="Введіть або відскануйте унікальну мітку"
                fullWidth
                error={!!error}
                helperText={error?.message || 'Мінімум 3 символи'}
              />
            )}
          />
        </Paper>

        {/* Дата створення (тільки для відображення) */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Дата створення замовлення
          </Typography>

          <TextField
            label="Дата створення"
            value={new Date().toLocaleDateString('uk-UA')}
            fullWidth
            disabled
            helperText="Встановлюється автоматично"
          />
        </Paper>
      </Stack>

      {/* Кнопки навігації */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={goToPreviousStep}>
          Назад
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            !selectedBranchId ||
            selectedBranchId.trim() === '' ||
            !receiptNumber ||
            autosaveData.isLoading
          }
        >
          Далі
        </Button>
      </Box>

      {/* Дебаг інформація */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption">
            Debug: Branch: {selectedBranchId}, Receipt: {receiptNumber || 'не згенеровано'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
