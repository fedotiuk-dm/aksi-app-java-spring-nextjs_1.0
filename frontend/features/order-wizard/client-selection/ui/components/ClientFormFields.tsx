'use client';

import {
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  FormHelperText,
} from '@mui/material';
import React from 'react';

import {
  ClientData,
  ContactMethod,
  InformationSource,
} from '@/domain/wizard/services/stage-1-client-and-order-info';

interface ClientFormFieldsProps {
  formData: Partial<ClientData>;
  onChange: (field: keyof ClientData, value: unknown) => void;
  errors?: Record<string, { message?: string }>;
  size?: 'small' | 'medium';
  showAllFields?: boolean;
}

/**
 * Компонент полів форми клієнта
 */
export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({
  formData,
  onChange,
  errors = {},
  size = 'medium',
  showAllFields = true,
}) => {
  const handleContactMethodsChange = (methods: ContactMethod[]) => {
    onChange('contactMethods', methods);
  };

  const toggleContactMethod = (method: ContactMethod) => {
    const current = formData.contactMethods || [];
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    handleContactMethodsChange(updated);
  };

  return (
    <Grid container spacing={2}>
      {/* Основні поля */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Ім'я"
          value={formData.firstName || ''}
          onChange={(e) => onChange('firstName', e.target.value)}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          size={size}
          fullWidth
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Прізвище"
          value={formData.lastName || ''}
          onChange={(e) => onChange('lastName', e.target.value)}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          size={size}
          fullWidth
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Телефон"
          value={formData.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          size={size}
          fullWidth
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email?.message}
          size={size}
          fullWidth
        />
      </Grid>

      {showAllFields && (
        <>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Адреса"
              value={formData.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address?.message}
              size={size}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size={size} error={!!errors.contactMethods}>
              <InputLabel>Способи зв&apos;язку</InputLabel>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Object.values(ContactMethod).map((method) => (
                  <Chip
                    key={method}
                    label={method}
                    onClick={() => toggleContactMethod(method)}
                    color={(formData.contactMethods || []).includes(method) ? 'primary' : 'default'}
                    variant={
                      (formData.contactMethods || []).includes(method) ? 'filled' : 'outlined'
                    }
                  />
                ))}
              </Box>
              {errors.contactMethods && (
                <FormHelperText>{errors.contactMethods.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size={size} error={!!errors.informationSource}>
              <InputLabel>Джерело інформації</InputLabel>
              <Select
                value={formData.informationSource || InformationSource.OTHER}
                onChange={(e) => onChange('informationSource', e.target.value)}
                label="Джерело інформації"
              >
                {Object.values(InformationSource).map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </Select>
              {errors.informationSource && (
                <FormHelperText>{errors.informationSource.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {formData.informationSource === InformationSource.OTHER && (
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Уточнення джерела"
                value={formData.informationSourceOther || ''}
                onChange={(e) => onChange('informationSourceOther', e.target.value)}
                error={!!errors.informationSourceOther}
                helperText={errors.informationSourceOther?.message}
                size={size}
                fullWidth
              />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};
