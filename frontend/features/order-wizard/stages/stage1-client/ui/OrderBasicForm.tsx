import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useReceptionPoints } from '../api/receptionPoints';
import { OrderBasicFormState, Stage1Data } from '../model/types';
import dayjs from 'dayjs';

interface OrderBasicFormProps {
  data: Partial<Stage1Data>;
  onSave: (data: Partial<Stage1Data>) => void;
  onBack: () => void;
}

export default function OrderBasicForm({ data, onSave, onBack }: OrderBasicFormProps) {
  const initialFormState: OrderBasicFormState = {
    isSubmitting: false,
    errors: {}
  };

  const [formState, setFormState] = useState<OrderBasicFormState>(initialFormState);
  const [formData, setFormData] = useState<Partial<Stage1Data>>({
    uniqueTag: data.uniqueTag || '',
    receptionPointId: data.receptionPointId || '',
    receiptNumber: data.receiptNumber || generateReceiptNumber(),
    createdAt: data.createdAt || dayjs().format('YYYY-MM-DD HH:mm:ss'),
  });

  // Запит на отримання пунктів прийому
  const { data: receptionPoints, isLoading: isLoadingPoints, isError } = useReceptionPoints();

  // Функція для генерації номеру квитанції (просто для демо)
  function generateReceiptNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}-${random}`;
  }

  // Обробник змін для полів форми
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Видалення помилки поля при редагуванні
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: ''
        }
      }));
    }
  };

  // Валідація форми
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Унікальна мітка може бути порожньою
    
    // Пункт прийому замовлення - обов'язковий
    if (!formData.receptionPointId) {
      errors.receptionPointId = 'Оберіть пункт прийому замовлення';
    }
    
    // Встановлюємо помилки, якщо вони є
    setFormState(prev => ({
      ...prev,
      errors
    }));
    
    return Object.keys(errors).length === 0;
  };

  // Обробник збереження даних форми
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    // Знаходимо об'єкт пункту прийому по ID для збереження
    const selectedPoint = receptionPoints?.find(point => point.id === formData.receptionPointId);
    
    // Зберігаємо дані форми з вибраним пунктом прийому
    onSave({
      ...formData,
      receptionPoint: selectedPoint || null
    });
    
    setFormState(prev => ({ ...prev, isSubmitting: false }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Базова інформація замовлення
      </Typography>
      
      <Grid container spacing={2}>
        {/* Номер квитанції (генерується автоматично) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="receiptNumber"
            label="Номер квитанції"
            name="receiptNumber"
            value={formData.receiptNumber || ''}
            onChange={handleChange}
            disabled // Користувач не може редагувати це поле
            helperText="Генерується автоматично"
          />
        </Grid>
        
        {/* Унікальна мітка */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            margin="normal"
            fullWidth
            id="uniqueTag"
            label="Унікальна мітка"
            name="uniqueTag"
            value={formData.uniqueTag || ''}
            onChange={handleChange}
            helperText="Введіть вручну або скануйте"
            error={!!formState.errors.uniqueTag}
            FormHelperTextProps={{
              error: !!formState.errors.uniqueTag
            }}
          />
        </Grid>
        
        {/* Пункт прийому замовлення */}
        <Grid size={12}>
          <FormControl 
            fullWidth 
            margin="normal" 
            required
            error={!!formState.errors.receptionPointId}
          >
            <InputLabel id="receptionPointId-label">Пункт прийому замовлення</InputLabel>
            <Select
              labelId="receptionPointId-label"
              id="receptionPointId"
              name="receptionPointId"
              value={formData.receptionPointId || ''}
              onChange={handleChange}
            >
              {isLoadingPoints ? (
                <MenuItem disabled>Завантаження...</MenuItem>
              ) : (
                receptionPoints?.map((point) => (
                  <MenuItem key={point.id} value={point.id}>
                    {point.name} ({point.address})
                  </MenuItem>
                ))
              )}
            </Select>
            {formState.errors.receptionPointId && (
              <FormHelperText>{formState.errors.receptionPointId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        {/* Дата створення замовлення */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="createdAt"
            label="Дата створення"
            name="createdAt"
            value={formData.createdAt || ''}
            disabled // Користувач не може редагувати це поле
            helperText="Встановлюється автоматично"
          />
        </Grid>
      </Grid>
      
      {/* Повідомлення про помилки завантаження даних */}
      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Помилка завантаження пунктів прийому. Будь ласка, спробуйте оновити сторінку.
        </Alert>
      )}
      
      {/* Кнопки дій */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          onClick={onBack}
          variant="outlined"
        >
          Назад
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={formState.isSubmitting || isLoadingPoints}
        >
          {formState.isSubmitting ? <CircularProgress size={24} /> : 'Зберегти і продовжити'}
        </Button>
      </Box>
    </Box>
  );
}
