'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { useOrderWizardStore } from '@/features/order-wizard';
import type { CartItemInfo } from '@/shared/api/generated/cart';

interface ReceiptProps {
  isPreview?: boolean;
}

export const Receipt: React.FC<ReceiptProps> = ({ isPreview = false }) => {
  const {
    customer,
    orderNumber,
    uniqueLabel,
    branchId,
    cartInfo,
    deliveryDate,
    urgency,
    discountType,
    customDiscountPercent,
    paidAmount,
    paymentMethod,
    orderNotes,
    signature,
    getTotalAmount,
    getDiscountAmount,
    getUrgencyAmount,
    getDebtAmount,
  } = useOrderWizardStore();

  const totalAmount = getTotalAmount();
  const discountAmount = getDiscountAmount();
  const urgencyAmount = getUrgencyAmount();
  const debtAmount = getDebtAmount();

  return (
    <Paper
      sx={{
        p: 4,
        width: isPreview ? '100%' : '80mm',
        maxWidth: isPreview ? '100%' : '80mm',
        margin: 'auto',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'monospace',
        fontSize: isPreview ? '14px' : '12px',
        '@media print': {
          width: '80mm',
          margin: 0,
          padding: 2,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          ХІМЧИСТКА "AKSI"
        </Typography>
        <Typography variant="body2">
          Професійна хімчистка та прання
        </Typography>
        <Typography variant="caption" display="block">
          вул. Центральна 123, м. Київ
        </Typography>
        <Typography variant="caption" display="block">
          Тел: +380 44 123-45-67
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Order Info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Квитанція №:</strong> {orderNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Унікальна мітка:</strong> {uniqueLabel}
        </Typography>
        <Typography variant="body2">
          <strong>Дата прийому:</strong> {dayjs().locale('uk').format('DD.MM.YYYY')}
        </Typography>
        <Typography variant="body2">
          <strong>Дата видачі:</strong> {dayjs(deliveryDate).locale('uk').format('DD.MM.YYYY')} після 14:00
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Customer Info */}
      {customer && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Клієнт:
          </Typography>
          <Typography variant="body2">
            {customer.lastName} {customer.firstName}
          </Typography>
          <Typography variant="body2">
            Тел: {customer.phonePrimary}
          </Typography>
          {customer.email && (
            <Typography variant="body2">
              Email: {customer.email}
            </Typography>
          )}
          {customer.address && (
            <Typography variant="body2">
              Адреса: {customer.address}
            </Typography>
          )}
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Items Table */}
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        Предмети:
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Найменування</TableCell>
              <TableCell align="center">К-сть</TableCell>
              <TableCell align="right">Ціна</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartInfo?.items?.map((item: CartItemInfo, index: number) => (
              <TableRow key={item.id}>
                <TableCell>
                  {index + 1}. {item.priceListItem?.name || '-'}
                  {item.characteristics?.material && (
                    <Typography variant="caption" display="block">
                      {item.characteristics.material}
                      {item.characteristics.color && `, ${item.characteristics.color}`}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  {((item.pricing?.total || 0) / 100).toFixed(2)}₴
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      {/* Financial Summary */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2">Сума до знижки:</Typography>
          <Typography variant="body2">{totalAmount.toFixed(2)}₴</Typography>
        </Box>
        
        {discountAmount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Знижка ({getDiscountLabel()}):</Typography>
            <Typography variant="body2">-{discountAmount.toFixed(2)}₴</Typography>
          </Box>
        )}
        
        {urgencyAmount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Термінове виконання:</Typography>
            <Typography variant="body2">+{urgencyAmount.toFixed(2)}₴</Typography>
          </Box>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            ЗАГАЛЬНА СУМА:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {(totalAmount - discountAmount + urgencyAmount).toFixed(2)}₴
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2">Сплачено:</Typography>
          <Typography variant="body2">{paidAmount.toFixed(2)}₴</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            До сплати при отриманні:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {debtAmount.toFixed(2)}₴
          </Typography>
        </Box>
      </Box>

      {/* Notes */}
      {orderNotes && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Примітки:
            </Typography>
            <Typography variant="body2">{orderNotes}</Typography>
          </Box>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Legal Info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
          Підписуючи квитанцію, клієнт погоджується з умовами надання послуг
        </Typography>
        
        {signature && (
          <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
            <img
              src={signature}
              alt="Підпис клієнта"
              style={{ maxWidth: '200px', height: '60px' }}
            />
            <Typography variant="caption" display="block">
              Підпис клієнта
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="caption" display="block">
          Дякуємо за довіру!
        </Typography>
        <Typography variant="caption" display="block">
          Графік роботи: Пн-Пт 8:00-20:00, Сб-Нд 9:00-18:00
        </Typography>
      </Box>
    </Paper>
  );

  function getDiscountLabel(): string {
    if (discountType === 'EVERCARD') return 'Еверкард 10%';
    if (discountType === 'MILITARY') return 'ЗСУ 10%';
    if (discountType === 'SOCIAL_MEDIA') return 'Соцмережі 5%';
    if (discountType === 'OTHER') return `${customDiscountPercent}%`;
    return '';
  }
};