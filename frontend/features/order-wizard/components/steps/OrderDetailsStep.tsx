'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Button,
  InputAdornment,
  Divider,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/uk';
import dayjs from 'dayjs';
import { DiscountType, DISCOUNT_OPTIONS, UrgencyType, URGENCY_OPTIONS, PaymentMethod, PAYMENT_OPTIONS } from '../../types/order-details.types';
import { useOrderWizardStore } from '../../store/orderWizardStore';

interface OrderDetailsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function OrderDetailsStep({ onNext, onPrevious }: OrderDetailsStepProps) {
  // Стан для форми з деталями замовлення
  const { 
    orderDetails, 
    setOrderDetails, 
    services,
    getTotalAmount
  } = useOrderWizardStore();
  
  // Загальна сума замовлення
  const totalAmount = getTotalAmount();

  // Локальний стан форми
  const [expectedCompletionDate, setExpectedCompletionDate] = useState<dayjs.Dayjs | null>(
    orderDetails.expectedCompletionDate 
      ? dayjs(orderDetails.expectedCompletionDate) 
      : dayjs().add(2, 'day')
  );
  const [urgencyType, setUrgencyType] = useState<UrgencyType>(
    orderDetails.urgencyType || UrgencyType.STANDARD
  );
  const [discountType, setDiscountType] = useState<DiscountType>(
    orderDetails.discountType || DiscountType.NONE
  );
  const [customDiscountPercentage, setCustomDiscountPercentage] = useState<number>(
    orderDetails.customDiscountPercentage || 0
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    orderDetails.paymentMethod || PaymentMethod.TERMINAL
  );
  const [amountPaid, setAmountPaid] = useState<number>(
    orderDetails.amountPaid || 0
  );
  const [notes, setNotes] = useState<string>(
    orderDetails.notes || ''
  );
  const [clientRequirements, setClientRequirements] = useState<string>(
    orderDetails.clientRequirements || ''
  );
  
  // Розрахункові поля
  const [remainingAmount, setRemainingAmount] = useState<number>(totalAmount - amountPaid);
  
  // Стан помилок
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Обновляємо розрахункові поля при зміні суми
  useEffect(() => {
    setRemainingAmount(totalAmount - amountPaid);
  }, [totalAmount, amountPaid]);

  // Обновляємо дату виконання при зміні терміновості
  useEffect(() => {
    const urgencyOption = URGENCY_OPTIONS.find(option => option.type === urgencyType);
    if (urgencyOption && urgencyOption.hours > 0) {
      // Якщо вибрана термінова опція, встановлюємо відповідну дату
      setExpectedCompletionDate(dayjs().add(Math.ceil(urgencyOption.hours / 24), 'day'));
    }
  }, [urgencyType]);

  // Функція для перевірки валідності форми
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!expectedCompletionDate) {
      newErrors.expectedCompletionDate = 'Дата виконання обов\'язкова';
    }
    
    if (discountType === DiscountType.CUSTOM && (customDiscountPercentage < 0 || customDiscountPercentage > 100)) {
      newErrors.customDiscountPercentage = 'Відсоток знижки повинен бути від 0 до 100';
    }
    
    if (amountPaid < 0) {
      newErrors.amountPaid = 'Сума передоплати не може бути від\'ємною';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обробник для збереження даних і переходу до наступного кроку
  const handleNext = () => {
    if (validateForm()) {
      // Зберігаємо дані до store
      setOrderDetails({
        expectedCompletionDate: expectedCompletionDate?.format('YYYY-MM-DD') || '',
        urgencyType,
        discountType,
        customDiscountPercentage: discountType === DiscountType.CUSTOM ? customDiscountPercentage : undefined,
        paymentMethod,
        amountPaid,
        notes: notes || undefined,
        clientRequirements: clientRequirements || undefined,
        receptionPoint: 'Main Office' // Тимчасово фіксоване значення
      });
      
      onNext();
    }
  };

  // Повертаємо компонент з формою
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Деталі замовлення
      </Typography>
      
      <Grid container spacing={3}>
        {/* Параметри виконання */}
        <Grid size={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Параметри виконання
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
                  <DatePicker
                    label="Дата виконання"
                    value={expectedCompletionDate}
                    onChange={(newDate) => setExpectedCompletionDate(newDate)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.expectedCompletionDate,
                        helperText: errors.expectedCompletionDate
                      }
                    }}
                    minDate={dayjs().add(1, 'day')}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid size={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Терміновість виконання</FormLabel>
                  <RadioGroup
                    value={urgencyType}
                    onChange={(e) => setUrgencyType(e.target.value as UrgencyType)}
                  >
                    {URGENCY_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.type}
                        value={option.type}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Знижки */}
        <Grid size={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Знижки
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Тип знижки</FormLabel>
                  <RadioGroup
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                  >
                    {DISCOUNT_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.type}
                        value={option.type}
                        control={<Radio />}
                        label={`${option.label}${option.percentage > 0 ? ` (${option.percentage}%)` : ''}`}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              {discountType === DiscountType.CUSTOM && (
                <Grid size={6}>
                  <TextField
                    label="Відсоток знижки"
                    type="number"
                    value={customDiscountPercentage}
                    onChange={(e) => setCustomDiscountPercentage(Number(e.target.value))}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    error={!!errors.customDiscountPercentage}
                    helperText={errors.customDiscountPercentage}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              )}
            </Grid>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Знижки не діють на прасування, прання і фарбування текстилю.
            </Alert>
          </Paper>
        </Grid>
        
        {/* Оплата */}
        <Grid size={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Оплата
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth>
                  <FormLabel component="legend">Спосіб оплати</FormLabel>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    {PAYMENT_OPTIONS.map((option) => (
                      <FormControlLabel
                        key={option.method}
                        value={option.method}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid size={6}>
                <TextField
                  label="Сплачено (передоплата)"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  fullWidth
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">грн</InputAdornment>,
                  }}
                  error={!!errors.amountPaid}
                  helperText={errors.amountPaid}
                />
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">Загальна вартість:</Typography>
                  <Typography variant="body1" fontWeight="bold">{totalAmount} грн</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body1">Залишок до сплати:</Typography>
                  <Typography variant="body1" fontWeight="bold" color={remainingAmount < 0 ? 'error' : 'inherit'}>
                    {remainingAmount} грн
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Додаткова інформація */}
        <Grid size={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Додаткова інформація
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  label="Примітки до замовлення"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                />
              </Grid>
              
              <Grid size={6}>
                <TextField
                  label="Додаткові вимоги клієнта"
                  multiline
                  rows={4}
                  value={clientRequirements}
                  onChange={(e) => setClientRequirements(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Кнопки навігації */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={onPrevious}
        >
          Назад
        </Button>
        <Button 
          variant="contained" 
          onClick={handleNext}
          disabled={services.length === 0}
        >
          {services.length === 0 ? 'Додайте хоча б одну послугу' : 'Продовжити'}
        </Button>
      </Box>
    </Box>
  );
}
