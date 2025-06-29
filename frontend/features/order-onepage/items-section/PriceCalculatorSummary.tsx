'use client';

import {
  Paper,
  Typography,
  Box,
  Divider,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ExpandMore, Calculate } from '@mui/icons-material';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import { useStage2GetCurrentManager } from '@/shared/api/generated/stage2';

export const PriceCalculatorSummary = () => {
  const { sessionId, stage2Ready } = useOrderOnepageStore();
  const CURRENCY_SYMBOL = '₴';

  // Отримання даних менеджера предметів (тільки якщо Stage2 готовий)
  const {
    data: managerData,
    isLoading,
    error,
  } = useStage2GetCurrentManager(sessionId || '', {
    query: {
      enabled: !!sessionId && stage2Ready, // Завантажуємо тільки коли Stage2 готовий
      retry: false,
    },
  });

  // Додаткове логування для відладки
  if (process.env.NODE_ENV === 'development') {
    console.log('PriceCalculatorSummary:', {
      sessionId: sessionId?.slice(0, 8),
      stage2Ready,
      enabled: !!sessionId && stage2Ready,
      isLoading,
      hasData: !!managerData,
      error: error?.message,
    });
  }

  if (isLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Завантаження розрахунків...</Typography>
      </Paper>
    );
  }

  const items = managerData?.addedItems || [];

  // Розрахунки
  const totalItems = managerData?.itemCount || 0;
  const subtotal = managerData?.totalAmount || 0;
  const totalModifiers = items.length; // Кількість предметів з модифікаторами

  return (
    <Paper sx={{ p: 2, height: 'fit-content' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Calculate color="primary" />
        <Typography variant="h6">Підсумок розрахунків</Typography>
      </Box>

      <Stack spacing={2}>
        {/* Загальна статистика */}
        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label={`Предметів: ${totalItems}`}
              color="primary"
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Модифікаторів: ${totalModifiers}`}
              color="secondary"
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>

        <Divider />

        {/* Основні суми */}
        <Box>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Базова вартість:</Typography>
              <Typography variant="body2">
                {items
                  .reduce((sum, item) => sum + (item.unitPrice * item.quantity || 0), 0)
                  .toFixed(2)}{' '}
                {CURRENCY_SYMBOL}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Модифікатори:</Typography>
              <Typography variant="body2" color="warning.main">
                +
                {(
                  subtotal -
                  items.reduce((sum, item) => sum + (item.unitPrice * item.quantity || 0), 0)
                ).toFixed(2)}{' '}
                {CURRENCY_SYMBOL}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Проміжна сума:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {subtotal.toFixed(2)} {CURRENCY_SYMBOL}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Деталізація по предметах */}
        {items.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Деталізація по предметах ({totalItems})</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Предмет</TableCell>
                      <TableCell align="right">К-сть</TableCell>
                      <TableCell align="right">Ціна</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption">
                            {item.quantity} {item.unitOfMeasure || 'шт'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="caption" fontWeight="medium">
                            {item.totalPrice?.toFixed(2)} {CURRENCY_SYMBOL}
                          </Typography>
                          {item.unitPrice !== item.totalPrice && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              (база: {(item.unitPrice * item.quantity)?.toFixed(2)}{' '}
                              {CURRENCY_SYMBOL})
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Повідомлення якщо немає предметів */}
        {items.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Предмети не додані
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Додайте предмети для розрахунку вартості
            </Typography>
          </Box>
        )}

        {/* Примітка про знижки */}
        {subtotal > 0 && (
          <Box sx={{ mt: 2, p: 1, backgroundColor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              * Загальні знижки та терміновість будуть застосовані на наступному етапі
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};
