'use client';

import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

import { FormField, MultiSelectCheckboxGroup } from '@/shared/ui';

import type { ClientFormData } from '@/domain/wizard/services/stage-1-client-and-order/client-management';
import type { Control, FieldErrors } from 'react-hook-form';

// Типи з доменного шару

// Shared компоненти

interface ClientFormFieldsProps {
  control: Control<ClientFormData>;
  errors?: FieldErrors<ClientFormData>;
  size?: 'small' | 'medium';
  showAllFields?: boolean;
}

/**
 * Компонент полів форми клієнта з react-hook-form інтеграцією + Shared UI
 */
export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({
  control,
  errors = {},
  size = 'medium',
  showAllFields = true,
}) => {
  // Варіанти способів зв'язку
  const contactMethodOptions = [
    { value: 'PHONE', label: 'Телефон' },
    { value: 'SMS', label: 'SMS' },
    { value: 'VIBER', label: 'Viber' },
  ];

  // Варіанти джерел інформації
  const informationSourceOptions = [
    { value: 'INSTAGRAM', label: 'Instagram' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'RECOMMENDATION', label: 'Рекомендації' },
    { value: 'OTHER', label: 'Інше' },
  ];

  return (
    <Grid container spacing={2}>
      {/* Основні поля */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="text"
              label="Ім'я"
              error={errors.firstName?.message}
              size={size}
              fullWidth
              required
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="text"
              label="Прізвище"
              error={errors.lastName?.message}
              size={size}
              fullWidth
              required
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="tel"
              label="Телефон"
              error={errors.phone?.message}
              size={size}
              fullWidth
              required
              placeholder="+380XXXXXXXXX"
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="email"
              label="Email"
              error={errors.email?.message}
              size={size}
              fullWidth
              placeholder="example@domain.com"
            />
          )}
        />
      </Grid>

      {showAllFields && (
        <>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <FormField
                  {...field}
                  type="text"
                  label="Адреса"
                  error={errors.address?.message}
                  size={size}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Вулиця, будинок, квартира, місто"
                />
              )}
            />
          </Grid>

          {/* Способи зв'язку */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="communicationChannels"
              control={control}
              render={({ field }) => (
                <MultiSelectCheckboxGroup
                  label="Способи зв'язку"
                  options={contactMethodOptions}
                  selectedValues={field.value || []}
                  onChange={field.onChange}
                  orientation="row"
                  showSelectedTags={false}
                  size={size}
                  error={errors.communicationChannels?.message}
                  helperText="Оберіть зручні способи зв'язку з клієнтом"
                />
              )}
            />
          </Grid>

          {/* Джерело інформації */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="source-label">Звідки дізналися про нас?</InputLabel>
                  <Select
                    labelId="source-label"
                    id="source"
                    value={field.value || ''}
                    label="Звідки дізналися про нас?"
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {informationSourceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.source?.message && (
                    <FormHelperText error>{errors.source.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Поле "Інше" для джерела інформації */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="source"
              control={control}
              render={({ field: sourceField }) => (
                <>
                  {sourceField.value === 'OTHER' && (
                    <Controller
                      name="sourceDetails"
                      control={control}
                      render={({ field }) => (
                        <FormField
                          {...field}
                          type="text"
                          label="Уточніть джерело"
                          error={errors.sourceDetails?.message}
                          size={size}
                          fullWidth
                          required
                          placeholder="Опишіть як клієнт дізнався про хімчистку"
                        />
                      )}
                    />
                  )}
                </>
              )}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};
