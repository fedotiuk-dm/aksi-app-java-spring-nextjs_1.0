'use client';

import { Print, GetApp, Email, Receipt } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
} from '@mui/material';
import React from 'react';

interface ReceiptActionButtonsProps {
  isReceiptGenerated: boolean;
  isProcessing?: boolean;
  onGenerateReceipt: () => void;
  onPrintReceipt?: () => void;
  onDownloadPdf?: () => void;
  onEmailReceipt?: () => void;
  disabled?: boolean;
  variant?: 'standard' | 'compact';
  showLabels?: boolean;
}

/**
 * Компонент для дій з квитанцією
 */
export const ReceiptActionButtons: React.FC<ReceiptActionButtonsProps> = ({
  isReceiptGenerated,
  isProcessing = false,
  onGenerateReceipt,
  onPrintReceipt,
  onDownloadPdf,
  onEmailReceipt,
  disabled = false,
  variant = 'standard',
  showLabels = true,
}) => {
  const isDisabled = disabled || isProcessing;

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {!isReceiptGenerated ? (
          <Button
            variant="contained"
            startIcon={isProcessing ? <CircularProgress size={16} /> : <Receipt />}
            onClick={onGenerateReceipt}
            disabled={isDisabled}
            size="small"
          >
            Згенерувати квитанцію
          </Button>
        ) : (
          <>
            <Chip label="Квитанція готова" color="success" size="small" />
            <ButtonGroup size="small" disabled={isDisabled}>
              {onPrintReceipt && (
                <Tooltip title="Друк">
                  <IconButton onClick={onPrintReceipt}>
                    <Print fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onDownloadPdf && (
                <Tooltip title="Завантажити PDF">
                  <IconButton onClick={onDownloadPdf}>
                    <GetApp fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {onEmailReceipt && (
                <Tooltip title="Відправити email">
                  <IconButton onClick={onEmailReceipt}>
                    <Email fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </ButtonGroup>
          </>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Генерація квитанції */}
      {!isReceiptGenerated && (
        <Button
          variant="contained"
          size="large"
          startIcon={isProcessing ? <CircularProgress size={20} /> : <Receipt />}
          onClick={onGenerateReceipt}
          disabled={isDisabled}
          fullWidth
        >
          {isProcessing ? 'Генерація квитанції...' : 'Згенерувати квитанцію'}
        </Button>
      )}

      {/* Дії з готовою квитанцією */}
      {isReceiptGenerated && (
        <Box>
          <Chip label="Квитанція згенерована" color="success" sx={{ mb: 2 }} icon={<Receipt />} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {onPrintReceipt && (
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={onPrintReceipt}
                disabled={isDisabled}
                fullWidth={!showLabels}
              >
                {showLabels ? 'Друк квитанції' : ''}
              </Button>
            )}

            {onDownloadPdf && (
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={onDownloadPdf}
                disabled={isDisabled}
                fullWidth={!showLabels}
              >
                {showLabels ? 'Завантажити PDF' : ''}
              </Button>
            )}

            {onEmailReceipt && (
              <Button
                variant="outlined"
                startIcon={<Email />}
                onClick={onEmailReceipt}
                disabled={isDisabled}
                fullWidth={!showLabels}
              >
                {showLabels ? 'Відправити на email' : ''}
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
