'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import { useOrderWizardStore } from '../../store/orderWizardStore';
import { orderWizardApi } from '../../api/orderWizardApi';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';

interface OrderSummaryStepProps {
  onPrevious: () => void;
}

// Функція для форматування ціни
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2
  }).format(price);
};

// Функція для перетворення типу терміновості у читабельний формат
const getUrgencyLabel = (urgencyType: string) => {
  switch (urgencyType) {
    case 'STANDARD': return 'Стандартне виконання';
    case 'HOURS_48': return 'Терміново (48 годин, +50%)';
    case 'HOURS_24': return 'Дуже терміново (24 години, +100%)';
    default: return 'Стандартне виконання';
  }
};

// Функція для перетворення типу знижки у читабельний формат
const getDiscountLabel = (discountType: string, customPercent?: number) => {
  switch (discountType) {
    case 'NONE': return 'Без знижки';
    case 'EVERCARD': return 'Еверкард (10%)';
    case 'SOCIAL_MEDIA': return 'Соцмережі (5%)';
    case 'MILITARY': return 'ЗСУ (10%)';
    case 'CUSTOM': return `Індивідуальна (${customPercent || 0}%)`;
    default: return 'Без знижки';
  }
};

// Функція для перетворення методу оплати у читабельний формат
const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'TERMINAL': return 'Термінал';
    case 'CASH': return 'Готівка';
    case 'BANK_TRANSFER': return 'На рахунок';
    default: return 'Термінал';
  }
};

export function OrderSummaryStep({ onPrevious }: OrderSummaryStepProps) {
  // Стан для обробки процесу створення замовлення
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Отримуємо всі необхідні дані зі сховища
  const { 
    client, 
    orderNote, 
    services, 
    orderDetails,
    subtotal,
    discount,
    getTotalAmount,
    completeWizard
  } = useOrderWizardStore();
  
  // Загальна сума замовлення
  const totalAmount = getTotalAmount();
  
  // Функція для створення замовлення
  const handleCreateOrder = async () => {
    if (!client) {
      setError('Клієнт не вибраний. Будь ласка, поверніться до першого кроку.');
      return;
    }
    
    if (services.length === 0) {
      setError('Не додано жодної послуги. Будь ласка, поверніться до другого кроку.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Підготовка даних для створення замовлення
      const createOrderRequest = {
        clientId: client.id,
        services: services.map(service => ({
          serviceCategoryId: service.serviceCategoryId,
          priceListItemId: service.priceListItemId,
          quantity: service.quantity,
          params: service.params,
          notes: service.notes
        })),
        expectedCompletionDate: orderDetails.expectedCompletionDate,
        urgencyType: orderDetails.urgencyType,
        discountType: orderDetails.discountType,
        customDiscountPercentage: orderDetails.customDiscountPercentage,
        paymentMethod: orderDetails.paymentMethod,
        amountPaid: orderDetails.amountPaid,
        notes: orderDetails.notes || orderNote,
        clientRequirements: orderDetails.clientRequirements,
        receptionPoint: orderDetails.receptionPoint
      };
      
      // Виклик API для створення замовлення
      const result = await orderWizardApi.createOrder(createOrderRequest);
      
      // Успішне створення
      completeWizard(result.id);
      
    } catch (err) {
      console.error('Помилка створення замовлення:', err);
      setError('Виникла помилка при створенні замовлення. Спробуйте ще раз або зверніться до адміністратора.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Підсумок замовлення
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Інформація про клієнта */}
        <Grid size={6}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Дані клієнта
            </Typography>
            
            {client ? (
              <List dense disablePadding>
                <ListItem disableGutters>
                  <ListItemText primary="ПІБ" secondary={`${client.lastName} ${client.firstName}`} />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary="Телефон" secondary={client.phone} />
                </ListItem>
                {client.email && (
                  <ListItem disableGutters>
                    <ListItemText primary="Email" secondary={client.email} />
                  </ListItem>
                )}
                {orderNote && (
                  <ListItem disableGutters>
                    <ListItemText primary="Примітки" secondary={orderNote} />
                  </ListItem>
                )}
              </List>
            ) : (
              <Typography color="error">
                Клієнт не вибраний
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Деталі замовлення */}
        <Grid size={6}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Деталі замовлення
            </Typography>
            
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText 
                  primary="Дата виконання" 
                  secondary={dayjs(orderDetails.expectedCompletionDate).format('DD.MM.YYYY')} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary="Терміновість" 
                  secondary={getUrgencyLabel(orderDetails.urgencyType)} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary="Знижка" 
                  secondary={getDiscountLabel(
                    orderDetails.discountType, 
                    orderDetails.customDiscountPercentage
                  )} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary="Спосіб оплати" 
                  secondary={getPaymentMethodLabel(orderDetails.paymentMethod)} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary="Передоплата" 
                  secondary={formatPrice(orderDetails.amountPaid)} 
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText 
                  primary="Залишок до сплати" 
                  secondary={formatPrice(Math.max(0, totalAmount - orderDetails.amountPaid))} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Список послуг */}
        <Grid size={12}>
          <Paper sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ p: 2, pb: 0 }} fontWeight="bold">
              Послуги
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Найменування</TableCell>
                    <TableCell>Кількість</TableCell>
                    <TableCell>Ціна за од.</TableCell>
                    <TableCell align="right">Вартість</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.quantity}</TableCell>
                      <TableCell>{formatPrice(service.unitPrice)}</TableCell>
                      <TableCell align="right">{formatPrice(service.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                  
                  {services.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          Не додано жодної послуги
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Фінансові підсумки */}
        <Grid size={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid size={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Проміжна сума
                    </Typography>
                    <Typography variant="h6">
                      {formatPrice(subtotal)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Знижка
                    </Typography>
                    <Typography variant="h6">
                      {formatPrice(discount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Загальна вартість
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatPrice(totalAmount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button 
          variant="outlined" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Назад
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<ReceiptIcon />}
          onClick={handleCreateOrder}
          disabled={isSubmitting || !client || services.length === 0}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Обробка...
            </>
          ) : (
            'Створити замовлення'
          )}
        </Button>
      </Box>
    </Box>
  );
}
