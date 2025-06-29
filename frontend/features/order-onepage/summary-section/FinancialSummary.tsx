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
  Alert,
  Skeleton,
} from '@mui/material';
import { ExpandMore, Receipt, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useOrderOnepageStore } from '../store/order-onepage.store';
import { useStage4GetOrderSummary } from '@/shared/api/generated/stage4';

export const FinancialSummary = () => {
  const { orderId } = useOrderOnepageStore();
  const DEFAULT_TEXT = 'Не вказано';
  const CURRENCY = 'грн';

  // Отримання детального підсумку замовлення
  const {
    data: orderSummary,
    isLoading,
    error,
  } = useStage4GetOrderSummary(orderId || '', {
    query: { enabled: !!orderId },
  });

  if (isLoading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Receipt color="primary" />
          <Typography variant="h6">Фінансовий підсумок</Typography>
        </Box>
        <Stack spacing={1}>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" height={30} />
          <Skeleton variant="rectangular" height={60} />
        </Stack>
      </Paper>
    );
  }

  if (error || !orderSummary) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Receipt color="primary" />
          <Typography variant="h6">Фінансовий підсумок</Typography>
        </Box>
        <Alert severity="warning">Не вдалося завантажити фінансовий підсумок замовлення</Alert>
      </Paper>
    );
  }

  // Безпечне отримання даних з типізацією
  const totalAmount = Number(orderSummary?.totalAmount || 0);
  const discountAmount = Number(orderSummary?.discountAmount || 0);
  const expediteSurchargeAmount = Number(orderSummary?.expediteSurchargeAmount || 0);
  const finalAmount = Number(orderSummary?.finalAmount || 0);
  const prepaymentAmount = Number(orderSummary?.prepaymentAmount || 0);
  const balanceAmount = Number(orderSummary?.balanceAmount || 0);
  const discountType = orderSummary?.discountType;
  const discountPercentage = Number(orderSummary?.discountPercentage || 0);
  const expediteType = orderSummary?.expediteType;
  const items = Array.isArray(orderSummary?.items) ? orderSummary.items : [];

  // Розрахунки для відображення
  const hasDiscount = discountAmount > 0;
  const hasSurcharge = expediteSurchargeAmount > 0;
  const hasPrepayment = prepaymentAmount > 0;
  const itemsCount = items.length;

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Receipt color="primary" />
        <Typography variant="h6">Фінансовий підсумок</Typography>
      </Box>

      <Stack spacing={2}>
        {/* Основна інформація */}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Предметів у замовленні: {itemsCount}
          </Typography>

          {/* Базова вартість */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">Базова вартість:</Typography>
            <Typography variant="body1" fontWeight="medium">
              {totalAmount.toFixed(2)} грн
            </Typography>
          </Box>

          {/* Надбавка за терміновість */}
          {hasSurcharge && (
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp color="warning" fontSize="small" />
                <Typography variant="body2" color="warning.main">
                  Надбавка за терміновість:
                </Typography>
              </Box>
              <Typography variant="body2" color="warning.main" fontWeight="medium">
                +{expediteSurchargeAmount.toFixed(2)} грн
              </Typography>
            </Box>
          )}

          {/* Знижка */}
          {hasDiscount && (
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingDown color="success" fontSize="small" />
                <Typography variant="body2" color="success.main">
                  Знижка ({String(discountType || 'Не вказано')}):
                </Typography>
              </Box>
              <Typography variant="body2" color="success.main" fontWeight="medium">
                -{discountAmount.toFixed(2)} грн
                {discountPercentage > 0 && ` (-${discountPercentage}%)`}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Загальна сума */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary">
              Загальна сума:
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {finalAmount.toFixed(2)} грн
            </Typography>
          </Box>
        </Box>

        {/* Інформація про оплату */}
        {(hasPrepayment || balanceAmount > 0) && (
          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Умови оплати:
            </Typography>

            {hasPrepayment && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Передоплата:</Typography>
                <Chip
                  label={`${prepaymentAmount.toFixed(2)} грн`}
                  color="info"
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}

            {balanceAmount > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Typography variant="body2">До доплати при отриманні:</Typography>
                <Chip
                  label={`${balanceAmount.toFixed(2)} грн`}
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        )}

        {/* Детальний розклад по предметах */}
        {items.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Детальний розклад по предметах ({itemsCount})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Предмет</TableCell>
                      <TableCell align="center">К-сть</TableCell>
                      <TableCell align="right">Ціна</TableCell>
                      <TableCell align="right">Сума</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">
                            {String(item.categoryName || 'Не вказано')} -{' '}
                            {String(item.itemName || 'Не вказано')}
                          </Typography>
                          {item.materialName && (
                            <Typography variant="caption" color="text.secondary">
                              {item.materialName}
                              {item.colorName && `, ${item.colorName}`}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{item.quantity}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{item.unitPrice?.toFixed(2)} грн</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {item.totalPrice?.toFixed(2)} грн
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Додаткові чіпи з інформацією */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {expediteType && (
            <Chip
              label={`Терміновість: ${String(expediteType)}`}
              color="warning"
              size="small"
              variant="outlined"
            />
          )}
          {discountType && discountType !== 'NO_DISCOUNT' && (
            <Chip
              label={`Знижка: ${String(discountType)}`}
              color="success"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Stack>
    </Paper>
  );
};
