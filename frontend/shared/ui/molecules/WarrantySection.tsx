'use client';

import { ErrorOutline } from '@mui/icons-material';
import { Box, FormControlLabel, Checkbox, Typography, Divider } from '@mui/material';
import React from 'react';

import { FormField } from '../atoms';

interface WarrantySectionProps {
  noWarranty: boolean;
  noWarrantyReason: string;
  onNoWarrantyChange: (checked: boolean) => void;
  onReasonChange: (reason: string) => void;
  reasonError?: string;
  disabled?: boolean;
}

/**
 * Компонент для секції "Без гарантій"
 */
export const WarrantySection: React.FC<WarrantySectionProps> = ({
  noWarranty,
  noWarrantyReason,
  onNoWarrantyChange,
  onReasonChange,
  reasonError,
  disabled = false,
}) => {
  return (
    <>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={noWarranty}
              onChange={(e) => onNoWarrantyChange(e.target.checked)}
              color="error"
              disabled={disabled}
            />
          }
          label={
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Без гарантій
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Відмова від гарантійних зобов&apos;язань
              </Typography>
            </Box>
          }
        />

        {noWarranty && (
          <Box sx={{ mt: 2 }}>
            <FormField
              type="text"
              label="Причина відмови від гарантій"
              placeholder="Обов'язково вкажіть причину..."
              value={noWarrantyReason}
              onChange={(e) => onReasonChange(e.target.value)}
              error={reasonError}
              disabled={disabled}
              required
              multiline
              rows={2}
              startIcon={<ErrorOutline color="error" />}
            />
          </Box>
        )}
      </Box>
    </>
  );
};
