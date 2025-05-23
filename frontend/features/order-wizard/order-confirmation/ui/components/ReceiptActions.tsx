'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Grid, Card, CardContent, Typography, Button, Box, Alert, Stack } from '@mui/material';
import React from 'react';

interface ReceiptActionsProps {
  isReceiptGenerated: boolean;
  isProcessingOrder: boolean;
  agreesToTerms: boolean;
  onGenerateReceipt: () => void;
  onPrintReceipt: () => void;
  onDownloadPdf: () => void;
  onEmailReceipt: () => void;
  disabled?: boolean;
}

/**
 * Компонент для дій з квитанцією
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення дій з квитанцією
 * - Отримує стан та обробники через пропси
 * - Не містить бізнес-логіки генерації квитанції
 */
export const ReceiptActions: React.FC<ReceiptActionsProps> = ({
  isReceiptGenerated,
  isProcessingOrder,
  agreesToTerms,
  onGenerateReceipt,
  onPrintReceipt,
  onDownloadPdf,
  onEmailReceipt,
  disabled = false,
}) => {
  if (!agreesToTerms) {
    return null;
  }

  return (
    <Grid size={{ xs: 12 }}>
      <Card variant="outlined" sx={{ bgcolor: 'success.50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Квитанція
          </Typography>

          {!isReceiptGenerated ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Для завершення оформлення згенеруйте квитанцію
              </Typography>
              <Button
                variant="contained"
                onClick={onGenerateReceipt}
                disabled={isProcessingOrder || disabled}
                startIcon={<QrCodeIcon />}
                size="large"
              >
                {isProcessingOrder ? 'Генерація квитанції...' : 'Згенерувати квитанцію'}
              </Button>
            </Box>
          ) : (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  Квитанцію згенеровано успішно!
                </Box>
              </Alert>

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<PrintIcon />}
                  onClick={onPrintReceipt}
                  disabled={disabled}
                >
                  Друкувати
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={onDownloadPdf}
                  disabled={disabled}
                >
                  Завантажити PDF
                </Button>
                <Button variant="outlined" onClick={onEmailReceipt} disabled={disabled}>
                  Відправити на email
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ReceiptActions;
