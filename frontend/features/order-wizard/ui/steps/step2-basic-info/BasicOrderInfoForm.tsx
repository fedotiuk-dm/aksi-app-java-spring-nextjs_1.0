/**
 * Форма базової інформації замовлення
 */
import { FC } from 'react';
// Додаємо інтерфейс пропсів для навігації
interface BasicOrderInfoFormProps {
  onNext: () => void;
  onBack: () => void;
}
import { useForm, Controller } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicOrderInfoSchema } from '@/features/order-wizard/model/schema/order.schema';
import { useReceptionPoints } from '@/features/order-wizard/api';
import { useOrderWizardMachine } from '@/features/order-wizard/hooks/state';
import { basicInfoToOrderCreateRequest } from '@/features/order-wizard/model/adapters/order.adapters';
import { clientDtoToUI } from '@/features/order-wizard/model/adapters/client.adapters';
import dayjs from 'dayjs';

// MUI компоненти
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const BasicOrderInfoForm: FC<BasicOrderInfoFormProps> = ({ onNext, onBack }) => {
  // Отримання даних про клієнта з машини станів
  const { actions, client } = useOrderWizardMachine();
  
  // Отримання списку пунктів прийому
  const { data: receptionPoints, isLoading: isLoadingReceptionPoints } = useReceptionPoints();
  
  // Визначаємо тип даних форми на основі фактичних полів, які ми використовуємо
  type FormValues = {
    uniqueTag?: string;
    receptionPointId: string;
    receiptNumber?: string;
  };
  
  // Генеруємо номер квитанції за певним алгоритмом (наприклад, префікс + дата + випадкове число)
  const generateReceiptNumber = () => {
    const prefix = 'AKS';
    const dateStr = dayjs().format('YYMMDD');
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-значне випадкове число
    return `${prefix}-${dateStr}-${randomNum}`;
  };
  
  // Форма з React Hook Form
  const methods = useForm<FormValues>({
    // Використовуємо власний тип FormValues поверх схеми Zod
    resolver: zodResolver(basicOrderInfoSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      uniqueTag: '',
      receptionPointId: '',
      receiptNumber: generateReceiptNumber(),
      // Дата створення задається в схемі за замовчуванням
    },
    mode: 'onChange',
  });
  
  // Використовуємо типізовані методи форми
  const { control, handleSubmit, formState: { errors, isValid } } = methods;
  
  // Обробник відправки форми
  const onSubmit = (formData: FormValues) => {
    // Передаємо дані напряму в адаптер
    // Конвертація даних форми у частину OrderCreateRequest
    const orderData = basicInfoToOrderCreateRequest(formData);
    
    // Відправка події в машину станів
    actions.saveBasicInfo(orderData);
    console.log('Збережено базову інформацію замовлення');
    
    // Переходимо до наступного кроку через пропс onNext
    onNext();
  };
  
  // Обробник повернення на попередній крок
  const handleBack = () => {
    console.log('Повернення до вибору клієнта');
    onBack();
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Базова інформація замовлення
        </Typography>
        
        {client && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
            {/* Використовуємо адаптер для отримання повного імені */}
            <Typography variant="subtitle1">
              Клієнт: {clientDtoToUI(client).fullName}
            </Typography>
            <Typography variant="body2">
              Телефон: {client.phone}
              {client.email && ` | Email: ${client.email}`}
            </Typography>
          </Box>
        )}
        
        <form onSubmit={handleSubmit((data) => onSubmit(data as FormValues))}>
          <Grid container spacing={3}>
            {/* Номер квитанції (автоматично) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="receiptNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Номер квитанції"
                    variant="outlined"
                    error={!!errors.receiptNumber}
                    helperText={errors.receiptNumber?.message || 'Генерується автоматично'}
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            
            {/* Дата створення замовлення */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Дата створення: {dayjs(new Date()).format('DD.MM.YYYY')}
              </Typography>
            </Grid>
            
            {/* Унікальна мітка (вводиться вручну) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="uniqueTag"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Унікальна мітка"
                    variant="outlined"
                    error={!!errors.uniqueTag}
                    helperText={errors.uniqueTag?.message || 'Введіть або відскануйте мітку замовлення'}
                    placeholder="Наприклад: AK123456"
                  />
                )}
              />
            </Grid>
            
            {/* Пункт прийому (вибір філії) */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="receptionPointId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.receptionPointId}>
                    <InputLabel id="reception-point-label">Пункт прийому замовлення *</InputLabel>
                    <Select
                      {...field}
                      labelId="reception-point-label"
                      label="Пункт прийому замовлення *"
                      required
                      disabled={isLoadingReceptionPoints}
                    >
                      {isLoadingReceptionPoints ? (
                        <MenuItem value="">
                          <CircularProgress size={20} />
                          Завантаження...
                        </MenuItem>
                      ) : (
                        receptionPoints?.map((point) => (
                          <MenuItem key={point.id} value={point.id}>
                            {point.name}
                            {point.address && ` (${point.address})`}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.receptionPointId && (
                      <FormHelperText>{errors.receptionPointId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          
          <Grid size={{ xs: 12 }} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
            >
              Назад
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid || isLoadingReceptionPoints}
              endIcon={<ArrowForwardIcon />}
            >
              Далі
            </Button>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
