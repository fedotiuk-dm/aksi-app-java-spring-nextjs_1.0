'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Print } from '@mui/icons-material';
import SignatureCanvas from 'react-signature-canvas';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useGetCart } from '@/shared/api/generated/cart';
import { ReceiptPreview } from '../receipt/ReceiptPreview';
import type {
  CartGlobalModifiersUrgencyType,
  CartGlobalModifiersDiscountType,
} from '@/shared/api/generated/cart';

export const SummarySection: React.FC = () => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureError, setSignatureError] = useState(false);
  const [isReceiptPreviewOpen, setIsReceiptPreviewOpen] = useState(false);
  const [clientDeliveryDate, setClientDeliveryDate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  const {
    cartId,
    deliveryDate,
    setDeliveryDate,
    urgency,
    setUrgency,
    discountType,
    setDiscountType,
    customDiscountPercent,
    setCustomDiscountPercent,
    paidAmount,
    setPaidAmount,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    termsAccepted,
    setTermsAccepted,
    signature,
    setSignature,
    getTotalAmount,
    getDiscountAmount,
    getUrgencyAmount,
    getDebtAmount,
    canSubmitOrder,
  } = useOrderWizardStore();

  // Initialize client-side state to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 2); // +48 hours
    setClientDeliveryDate(defaultDate);
    setDeliveryDate(defaultDate);
  }, [setDeliveryDate]);

  // Get cart data - TODO: Update when cart API supports cartId
  const { data: cartData } = useGetCart({
    query: {
      enabled: !!cartId,
    },
  });

  const handleUrgencyChange = (event: SelectChangeEvent) => {
    setUrgency(event.target.value as CartGlobalModifiersUrgencyType);
  };

  const handleDiscountChange = (event: SelectChangeEvent) => {
    setDiscountType(event.target.value as CartGlobalModifiersDiscountType);
  };

  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value as 'TERMINAL' | 'CASH' | 'BANK');
  };

  const handleSaveSignature = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        setSignatureError(true);
        return;
      }
      setSignature(signatureRef.current.toDataURL());
      setSignatureError(false);
    }
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignature('');
      setSignatureError(false);
    }
  };

  const handlePrintReceipt = () => {
    if (canSubmitOrder()) {
      setIsReceiptPreviewOpen(true);
    }
  };

  const totalAmount = cartData?.pricing?.total ? cartData.pricing.total / 100 : getTotalAmount();
  const discountAmount = cartData?.pricing?.discountAmount ? cartData.pricing.discountAmount / 100 : getDiscountAmount();
  const urgencyAmount = cartData?.pricing?.urgencyAmount ? cartData.pricing.urgencyAmount / 100 : getUrgencyAmount();
  const debtAmount = getDebtAmount();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Підсумки та завершення
      </Typography>

      {/* Delivery Date */}
      {isClient && clientDeliveryDate && (
        <DatePicker
          label="Дата виконання"
          value={dayjs(clientDeliveryDate)}
          onChange={(newValue) => {
            if (newValue) {
              const date = newValue.toDate();
              setClientDeliveryDate(date);
              setDeliveryDate(date);
            }
          }}
          format="DD.MM.YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              sx: { mb: 2 },
              helperText: 'Стандарт: 48 год (одяг) / 14 днів (шкіра)',
            },
          }}
        />
      )}

      {/* Urgency */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Термінове виконання</FormLabel>
        <Select value={urgency} onChange={handleUrgencyChange}>
          <MenuItem value="NORMAL">Звичайне (без націнки)</MenuItem>
          <MenuItem value="FAST">+50% за 48 год</MenuItem>
          <MenuItem value="EXPRESS">+100% за 24 год</MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Discount */}
      <Typography variant="subtitle1" gutterBottom>
        Знижки
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Тип знижки</FormLabel>
        <Select value={discountType} onChange={handleDiscountChange}>
          <MenuItem value="NONE">Без знижки</MenuItem>
          <MenuItem value="EVERCARD">Еверкард (10%)</MenuItem>
          <MenuItem value="SOCIAL_MEDIA">Соцмережі (5%)</MenuItem>
          <MenuItem value="MILITARY">ЗСУ (10%)</MenuItem>
          <MenuItem value="OTHER">Інше</MenuItem>
        </Select>
      </FormControl>

      {discountType === ('OTHER' as CartGlobalModifiersDiscountType) && (
        <TextField
          label="Відсоток знижки"
          type="number"
          value={customDiscountPercent}
          onChange={(e) => setCustomDiscountPercent(Number(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
          slotProps={{
            htmlInput: { min: 0, max: 100 }
          }}
        />
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        Знижки не діють на прасування, прання і фарбування
      </Alert>

      <Divider sx={{ my: 2 }} />

      {/* Financial Summary */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Фінансовий блок
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Сума до знижки:</Typography>
          <Typography>{totalAmount.toFixed(2)} ₴</Typography>
        </Box>
        
        {discountAmount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Знижка:</Typography>
            <Typography color="success.main">-{discountAmount.toFixed(2)} ₴</Typography>
          </Box>
        )}
        
        {urgencyAmount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Термінове виконання:</Typography>
            <Typography color="warning.main">+{urgencyAmount.toFixed(2)} ₴</Typography>
          </Box>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Загальна вартість:</Typography>
          <Typography variant="h6">{totalAmount.toFixed(2)} ₴</Typography>
        </Box>

        <TextField
          label="Сплачено"
          type="number"
          value={paidAmount}
          onChange={(e) => setPaidAmount(Number(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
          slotProps={{
            htmlInput: { min: 0, step: 0.01 }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Борг:</Typography>
          <Typography color={debtAmount > 0 ? 'error.main' : 'success.main'}>
            {debtAmount.toFixed(2)} ₴
          </Typography>
        </Box>

        <FormControl fullWidth>
          <FormLabel>Спосіб оплати</FormLabel>
          <Select value={paymentMethod} onChange={handlePaymentMethodChange}>
            <MenuItem value="TERMINAL">Термінал</MenuItem>
            <MenuItem value="CASH">Готівка</MenuItem>
            <MenuItem value="BANK">На рахунок</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Notes */}
      <TextField
        label="Примітки до замовлення"
        multiline
        rows={3}
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Terms */}
      <FormControlLabel
        control={
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
        }
        label="Я погоджуюсь з умовами надання послуг"
        sx={{ mb: 2 }}
      />

      {/* Signature */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Цифровий підпис клієнта
        </Typography>
        <Box
          sx={{
            border: 1,
            borderColor: signatureError ? 'error.main' : 'divider',
            borderRadius: 1,
            mb: 1,
          }}
        >
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: 250,
              height: 100,
              style: { width: '100%', height: 100 },
            }}
          />
        </Box>
        {signatureError && (
          <Typography variant="caption" color="error">
            Підпис обов'язковий
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" onClick={handleClearSignature}>
            Очистити
          </Button>
          <Button size="small" variant="contained" onClick={handleSaveSignature}>
            Зберегти підпис
          </Button>
        </Box>
      </Paper>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        startIcon={<Print />}
        onClick={handlePrintReceipt}
        disabled={!canSubmitOrder()}
        sx={{
          py: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
        }}
      >
        ДРУК КВИТАНЦІЇ
      </Button>

      {/* Receipt Preview Dialog */}
      <ReceiptPreview
        open={isReceiptPreviewOpen}
        onClose={() => setIsReceiptPreviewOpen(false)}
      />
    </Box>
  );
};