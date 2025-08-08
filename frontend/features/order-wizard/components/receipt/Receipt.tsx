'use client';

import React, { useEffect, useState } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useGetCart } from '@/shared/api/generated/cart';
import { useGetBranchById } from '@/shared/api/generated/branch';
import { useGetOrderById } from '@/shared/api/generated/order';
import { useGenerateReceiptPreview, type ReceiptOrderData, type ReceiptItem } from '@/shared/api/generated/receipt';

interface ReceiptProps {
  isPreview?: boolean;
  orderId?: string; // For displaying existing order receipt
}

export const Receipt: React.FC<ReceiptProps> = ({ isPreview = false, orderId }) => {
  const {
    selectedCustomer,
    uniqueLabel,
    selectedBranch,
  } = useOrderWizardStore();
  
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string | null>(null);
  
  // Get cart data from API for preview
  const { data: cartData, isLoading: isLoadingCart, error: cartError } = useGetCart({
    query: { enabled: isPreview && !orderId }
  });
  
  // Get order data if orderId is provided
  const { data: orderData, isLoading: isLoadingOrder } = useGetOrderById(
    orderId || '',
    { query: { enabled: !!orderId } }
  );
  
  // Get branch details
  const { data: branchDetails } = useGetBranchById(
    selectedBranch?.id || orderData?.branchId || '',
    { query: { enabled: !!selectedBranch?.id || !!orderData?.branchId } }
  );
  
  // Generate receipt preview mutation
  const generatePreviewMutation = useGenerateReceiptPreview();
  
  // Generate receipt preview PDF when we have cart data
  useEffect(() => {
    if (isPreview && cartData && selectedCustomer && branchDetails && !orderId) {
      void generateReceiptPreview();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartData, selectedCustomer, branchDetails, isPreview, orderId]);
  
  const generateReceiptPreview = async () => {
    if (!cartData || !selectedCustomer || !branchDetails) return;
    
    try {
      const receiptData: ReceiptOrderData = {
        orderNumber: 'PREVIEW-' + Date.now(),
        branchName: branchDetails.name,
        branchAddress: branchDetails.address,
        branchPhone: branchDetails.phone,
        customerName: `${selectedCustomer.lastName} ${selectedCustomer.firstName}`,
        customerPhone: selectedCustomer.phonePrimary,
        items: cartData.items.map((item, index): ReceiptItem => ({
          position: index + 1,
          name: item.priceListItem?.name || '',
          catalogNumber: undefined, // PriceListItemSummary doesn't have catalogNumber
          quantity: item.quantity,
          unitPrice: item.priceListItem?.basePrice || 0,
          totalPrice: item.pricing?.total || 0,
          modifiers: item.pricing?.modifierDetails?.map(m => m.name) || [],
        })),
        subtotal: cartData.pricing?.itemsSubtotal,
        discount: cartData.pricing?.discountAmount,
        totalAmount: cartData.pricing?.total || 0,
        prepaidAmount: 0,
        dueAmount: cartData.pricing?.total || 0,
        paymentMethod: 'CASH',
        createdAt: new Date().toISOString(),
        completionDate: dayjs().add(2, 'day').toISOString(),
        notes: uniqueLabel ? `Унікальна мітка: ${uniqueLabel}` : undefined,
      };
      
      const result = await generatePreviewMutation.mutateAsync({
        data: {
          orderData: receiptData,
          locale: 'uk',
        }
      });
      
      // Create blob URL for PDF
      const url = URL.createObjectURL(result);
      setReceiptPreviewUrl(url);
    } catch (error) {
      console.error('Error generating receipt preview:', error);
    }
  };
  
  const isLoading = isLoadingCart || isLoadingOrder || generatePreviewMutation.isPending;
  const error = cartError || generatePreviewMutation.error;
  
  if (error) {
    return (
      <Alert severity="error">
        Помилка завантаження даних квитанції
      </Alert>
    );
  }
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If we have a PDF preview URL, show it
  if (receiptPreviewUrl && isPreview) {
    return (
      <iframe
        src={receiptPreviewUrl}
        style={{
          width: '100%',
          height: '600px',
          border: 'none',
        }}
        title="Receipt Preview PDF"
      />
    );
  }
  
  // Use order data if available, otherwise use cart data
  const data = orderData || cartData;
  const customer = orderData?.customer || selectedCustomer;
  
  if (!data) {
    return (
      <Alert severity="info">
        Немає даних для відображення
      </Alert>
    );
  }
  
  // Use pricing from backend
  const pricing = orderData ? orderData.pricing : cartData?.pricing;
  const items = orderData ? orderData.items : cartData?.items || [];

  // Cleanup receipt preview URL
  useEffect(() => {
    return () => {
      if (receiptPreviewUrl) {
        URL.revokeObjectURL(receiptPreviewUrl);
      }
    };
  }, [receiptPreviewUrl]);

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
        {branchDetails && (
          <>
            <Typography variant="caption" display="block">
              {branchDetails.name}
            </Typography>
            {branchDetails.address && (
              <Typography variant="caption" display="block">
                {branchDetails.address}
              </Typography>
            )}
            {branchDetails.phone && (
              <Typography variant="caption" display="block">
                Тел: {branchDetails.phone}
              </Typography>
            )}
          </>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Order Info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Квитанція №:</strong> {orderData?.orderNumber || orderId || 'Буде згенеровано'}
        </Typography>
        <Typography variant="body2">
          <strong>Унікальна мітка:</strong> {orderData?.uniqueLabel || uniqueLabel || '-'}
        </Typography>
        <Typography variant="body2">
          <strong>Дата прийому:</strong> {dayjs(orderData?.createdAt || new Date()).locale('uk').format('DD.MM.YYYY HH:mm')}
        </Typography>
        <Typography variant="body2">
          <strong>Орієнтовна дата видачі:</strong> {dayjs(orderData?.expectedCompletionDate || new Date()).add(2, 'day').locale('uk').format('DD.MM.YYYY')} після 14:00
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
            Тел: {'phone' in customer ? customer.phone : (selectedCustomer?.phonePrimary || '-')}
          </Typography>
          {customer.email && (
            <Typography variant="body2">
              Email: {customer.email}
            </Typography>
          )}
          {!orderData && selectedCustomer?.address && (
            <Typography variant="body2">
              Адреса: {selectedCustomer.address}
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
            {items.map((item: any, index: number) => (
              <TableRow key={item.id}>
                <TableCell>
                  {index + 1}. {orderData ? item.serviceName : item.priceListItem?.name || '-'}
                  {item.characteristics?.material && (
                    <Typography variant="caption" display="block">
                      {item.characteristics.material}
                      {item.characteristics.color && `, ${item.characteristics.color}`}
                    </Typography>
                  )}
                  {/* Show modifiers if any */}
                  {((orderData ? item.modifiers : item.pricing?.modifierDetails) || []).length > 0 && (
                    <Typography variant="caption" display="block" sx={{ fontStyle: 'italic' }}>
                      {orderData 
                        ? item.modifiers?.map((m: any) => m.name).join(', ')
                        : item.pricing?.modifierDetails?.map((m: any) => m.name).join(', ')
                      }
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  {((orderData ? item.totalPrice : item.pricing?.total || 0) / 100).toFixed(2)}₴
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      {/* Financial Summary from Backend */}
      {pricing && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Сума предметів:</Typography>
            <Typography variant="body2">{(pricing.itemsSubtotal / 100).toFixed(2)}₴</Typography>
          </Box>
          
          {pricing.urgencyAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Термінове виконання:</Typography>
              <Typography variant="body2">+{(pricing.urgencyAmount / 100).toFixed(2)}₴</Typography>
            </Box>
          )}
          
          {pricing.discountAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Знижка:</Typography>
              <Typography variant="body2">-{(pricing.discountAmount / 100).toFixed(2)}₴</Typography>
            </Box>
          )}
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              ЗАГАЛЬНА СУМА:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {(pricing.total / 100).toFixed(2)}₴
            </Typography>
          </Box>
          
          {/* Payment info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Сплачено:</Typography>
            <Typography variant="body2">
              {orderData 
                ? ((orderData.pricing.paidAmount || 0) / 100).toFixed(2)
                : '0.00'
              }₴
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              До сплати:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {orderData
                ? ((orderData.pricing.balanceDue || 0) / 100).toFixed(2)
                : (pricing.total / 100).toFixed(2)
              }₴
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Legal Info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
          Підписуючи квитанцію, клієнт погоджується з умовами надання послуг
        </Typography>
        
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ borderBottom: '1px solid #000', height: 40, mb: 1 }} />
          <Typography variant="caption" display="block" align="center">
            Підпис клієнта
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="caption" display="block">
          Дякуємо за довіру!
        </Typography>
        {branchDetails?.workingHours && (
          <Typography variant="caption" display="block">
            Графік роботи: {branchDetails.workingHours}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};