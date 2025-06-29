'use client';

import { Gavel, OpenInNew } from '@mui/icons-material';
import { FormControlLabel, Checkbox, Typography, Box, Link, Alert } from '@mui/material';
import React from 'react';

interface LegalCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  agreementText?: string;
  agreementUrl?: string;
  linkText?: string;
  errorText?: string;
  showIcon?: boolean;
}

/**
 * Компонент для згоди з юридичними умовами
 */
export const LegalCheckbox: React.FC<LegalCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  required = true,
  agreementText = 'Я погоджуюсь з умовами надання послуг',
  agreementUrl,
  linkText = 'Ознайомитися з повними умовами',
  errorText,
  showIcon = true,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            color="primary"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showIcon && <Gavel fontSize="small" color="primary" />}
            <Typography variant="body2">
              {agreementText}
              {required && (
                <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
          </Box>
        }
        sx={{
          alignItems: 'flex-start',
          '& .MuiFormControlLabel-label': {
            mt: 0.5,
          },
        }}
      />

      {agreementUrl && (
        <Box sx={{ ml: 4, mt: 1 }}>
          <Link
            href={agreementUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <OpenInNew fontSize="small" />
            {linkText}
          </Link>
        </Box>
      )}

      {errorText && (
        <Alert severity="error" sx={{ mt: 1 }}>
          <Typography variant="body2">{errorText}</Typography>
        </Alert>
      )}

      {required && !checked && !disabled && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 4, display: 'block', mt: 0.5 }}
        >
          Обов&apos;язкове поле для завершення замовлення
        </Typography>
      )}
    </Box>
  );
};
