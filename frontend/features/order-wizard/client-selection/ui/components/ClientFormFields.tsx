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
  Typography,
} from '@mui/material';
import React from 'react';

import { CreateClientFormData, UpdateClientFormData, Address } from '@/domain/client/types';
import { ClientSource, CommunicationChannel } from '@/domain/client/types/client-enums';
import { AddressFields, MultiSelectCheckboxGroup } from '@/shared/ui';

interface ClientFormFieldsProps {
  formData: CreateClientFormData | UpdateClientFormData | Partial<UpdateClientFormData>;
  onChange: (
    field: string,
    value: string | string[] | CommunicationChannel[] | ClientSource | Address | undefined
  ) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  size?: 'small' | 'medium';
  showAllFields?: boolean;
  className?: string;
}

/**
 * Компонент загальних полів форми клієнта
 *
 * Згідно з документацією Order Wizard:
 * - Прізвище та ім'я (обов'язкове)
 * - Телефон (обов'язкове)
 * - Email
 * - Адреса
 * - Способи зв'язку (мультивибір): Номер телефону, SMS, Viber
 * - Джерело інформації про хімчистку: Інстаграм, Google, Рекомендації, Інше
 */
export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({
  formData,
  onChange,
  errors = {},
  disabled = false,
  size = 'medium',
  showAllFields = true,
  className,
}) => {
  const handleChannelChange = (values: string[]) => {
    onChange('communicationChannels', values as CommunicationChannel[]);
  };

  const sourceOptions = [
    { value: ClientSource.INSTAGRAM, label: 'Інстаграм' },
    { value: ClientSource.GOOGLE, label: 'Google' },
    { value: ClientSource.RECOMMENDATION, label: 'Рекомендації' },
    { value: ClientSource.OTHER, label: 'Інше' },
  ];

  const channelOptions = [
    { value: CommunicationChannel.PHONE, label: 'Номер телефону' },
    { value: CommunicationChannel.SMS, label: 'SMS' },
    { value: CommunicationChannel.VIBER, label: 'Viber' },
  ];

  const handleStructuredAddressChange = (address: Address) => {
    console.log('🏠 ClientFormFields.handleStructuredAddressChange:', {
      newAddress: address,
      oldStructuredAddress: formData.structuredAddress,
    });

    onChange('structuredAddress', address);
    if (address?.fullAddress) {
      onChange('address', address.fullAddress);
    }
  };

  const handleSimpleAddressChange = (address: string) => {
    console.log('🏠 ClientFormFields.handleSimpleAddressChange:', {
      newAddress: address,
      oldAddress: formData.address,
    });

    onChange('address', address);
    if (formData.structuredAddress) {
      onChange('structuredAddress', {
        ...formData.structuredAddress,
        fullAddress: address,
      });
    }
  };

  return (
    <Box className={className}>
      <Grid container spacing={3}>
        {/* Основні поля (завжди показуються) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Прізвище *"
            value={formData.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={disabled}
            size={size}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Ім'я *"
            value={formData.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={disabled}
            size={size}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Телефон *"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            disabled={disabled}
            size={size}
            placeholder="+380..."
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            disabled={disabled}
            size={size}
          />
        </Grid>

        {showAllFields && (
          <>
            {/* Адреса - використовуємо новий компонент */}
            <Grid size={{ xs: 12 }}>
              <AddressFields
                structuredAddress={formData.structuredAddress}
                simpleAddress={formData.address}
                onStructuredAddressChange={handleStructuredAddressChange}
                onSimpleAddressChange={handleSimpleAddressChange}
                errors={{
                  city: errors.city,
                  street: errors.street,
                  building: errors.building,
                  apartment: errors.apartment,
                  postalCode: errors.postalCode,
                  fullAddress: errors.fullAddress,
                  address: errors.address,
                }}
                disabled={disabled}
                size={size}
                mode="both"
              />
            </Grid>

            {/* Способи зв'язку */}
            <Grid size={{ xs: 12 }}>
              <MultiSelectCheckboxGroup
                label="Способи зв'язку"
                options={channelOptions}
                selectedValues={formData.communicationChannels || []}
                onChange={handleChannelChange}
                disabled={disabled}
                size={size}
                orientation="row"
                showSelectedTags={false}
              />
            </Grid>

            {/* Джерело інформації */}
            <Grid size={{ xs: 12, sm: 8 }}>
              <FormControl fullWidth size={size}>
                <InputLabel>Джерело інформації про хімчистку</InputLabel>
                <Select
                  value={formData.source || ''}
                  onChange={(e) => onChange('source', e.target.value)}
                  disabled={disabled}
                  label="Джерело інформації про хімчистку"
                >
                  <MenuItem value="">
                    <em>Не вказано</em>
                  </MenuItem>
                  {sourceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Деталі джерела (показується якщо вибрано "Інше") */}
            {formData.source === ClientSource.OTHER && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Уточнення"
                  value={formData.sourceDetails || ''}
                  onChange={(e) => onChange('sourceDetails', e.target.value)}
                  error={!!errors.sourceDetails}
                  helperText={errors.sourceDetails}
                  disabled={disabled}
                  size={size}
                  placeholder="Вкажіть джерело..."
                />
              </Grid>
            )}
          </>
        )}
      </Grid>

      {/* Попередній перегляд вибраних каналів */}
      {showAllFields &&
        formData.communicationChannels &&
        formData.communicationChannels.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Вибрані способи зв&apos;язку:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.communicationChannels.map((channel) => {
                const channelLabel =
                  channelOptions.find((opt) => opt.value === channel)?.label || channel;
                return (
                  <Chip
                    key={channel}
                    label={channelLabel}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                );
              })}
            </Box>
          </Box>
        )}
    </Box>
  );
};
