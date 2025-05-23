'use client';

import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Grid, TextField, Box, Typography, Collapse, IconButton } from '@mui/material';
import React, { useState } from 'react';

interface AddressFieldsProps {
  // Структурована адреса
  structuredAddress?: {
    city?: string;
    street?: string;
    building?: string;
    apartment?: string;
    postalCode?: string;
    fullAddress?: string;
  };

  // Проста адреса (для зворотної сумісності)
  simpleAddress?: string;

  // Режим відображення
  mode?: 'simple' | 'structured' | 'both';

  // Обробники змін
  onStructuredAddressChange?: (address: {
    city?: string;
    street?: string;
    building?: string;
    apartment?: string;
    postalCode?: string;
    fullAddress?: string;
  }) => void;

  onSimpleAddressChange?: (address: string) => void;

  // Помилки валідації
  errors?: {
    city?: string;
    street?: string;
    building?: string;
    apartment?: string;
    postalCode?: string;
    fullAddress?: string;
    address?: string;
  };

  // Стандартні пропси
  disabled?: boolean;
  size?: 'small' | 'medium';
  className?: string;
  showLabel?: boolean;
  required?: boolean;
}

/**
 * Компонент для введення адреси
 * Підтримує як структурований, так і простий режими
 *
 * DDD принципи:
 * - Інкапсулює логіку роботи з адресою
 * - Надає гнучкі режими відображення
 * - Забезпечує валідацію та зручність використання
 */
export const AddressFields: React.FC<AddressFieldsProps> = ({
  structuredAddress = {},
  simpleAddress = '',
  mode = 'both',
  onStructuredAddressChange,
  onSimpleAddressChange,
  errors = {},
  disabled = false,
  size = 'medium',
  className,
  showLabel = true,
  required = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<'simple' | 'structured'>(
    mode === 'both' ? 'simple' : mode
  );

  // Обробники змін для структурованої адреси
  const handleStructuredChange = (field: keyof typeof structuredAddress, value: string) => {
    const newAddress = { ...structuredAddress, [field]: value };
    onStructuredAddressChange?.(newAddress);
  };

  // Обробник зміни простої адреси
  const handleSimpleChange = (value: string) => {
    onSimpleAddressChange?.(value);
  };

  // Перемикання між режимами
  const toggleMode = () => {
    if (mode === 'both') {
      setActiveMode(activeMode === 'simple' ? 'structured' : 'simple');
      setIsExpanded(activeMode === 'simple');
    }
  };

  // Рендер простої адреси
  const renderSimpleAddress = () => (
    <Grid size={{ xs: 12 }}>
      <TextField
        fullWidth
        label={`Адреса${required ? ' *' : ''}`}
        value={simpleAddress}
        onChange={(e) => handleSimpleChange(e.target.value)}
        error={!!(errors.address || errors.fullAddress)}
        helperText={errors.address || errors.fullAddress}
        disabled={disabled}
        size={size}
        multiline
        rows={2}
        placeholder="Введіть повну адресу"
      />
    </Grid>
  );

  // Рендер структурованої адреси
  const renderStructuredAddress = () => (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label={`Місто${required ? ' *' : ''}`}
          value={structuredAddress.city || ''}
          onChange={(e) => handleStructuredChange('city', e.target.value)}
          error={!!errors.city}
          helperText={errors.city}
          disabled={disabled}
          size={size}
          placeholder="Київ"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label={`Вулиця${required ? ' *' : ''}`}
          value={structuredAddress.street || ''}
          onChange={(e) => handleStructuredChange('street', e.target.value)}
          error={!!errors.street}
          helperText={errors.street}
          disabled={disabled}
          size={size}
          placeholder="вул. Хрещатик"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Будинок"
          value={structuredAddress.building || ''}
          onChange={(e) => handleStructuredChange('building', e.target.value)}
          error={!!errors.building}
          helperText={errors.building}
          disabled={disabled}
          size={size}
          placeholder="10А"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Квартира/Офіс"
          value={structuredAddress.apartment || ''}
          onChange={(e) => handleStructuredChange('apartment', e.target.value)}
          error={!!errors.apartment}
          helperText={errors.apartment}
          disabled={disabled}
          size={size}
          placeholder="12"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          fullWidth
          label="Поштовий індекс"
          value={structuredAddress.postalCode || ''}
          onChange={(e) => handleStructuredChange('postalCode', e.target.value)}
          error={!!errors.postalCode}
          helperText={errors.postalCode}
          disabled={disabled}
          size={size}
          placeholder="01001"
        />
      </Grid>
    </>
  );

  return (
    <Box className={className}>
      {showLabel && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" component="legend">
            Адреса{required && ' *'}
          </Typography>

          {mode === 'both' && (
            <IconButton
              size="small"
              onClick={toggleMode}
              sx={{ ml: 1 }}
              title={activeMode === 'simple' ? 'Структурована адреса' : 'Проста адреса'}
            >
              {activeMode === 'simple' ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          )}
        </Box>
      )}

      <Grid container spacing={2}>
        {(mode === 'simple' || (mode === 'both' && activeMode === 'simple')) &&
          renderSimpleAddress()}

        {(mode === 'structured' || (mode === 'both' && activeMode === 'structured')) &&
          renderStructuredAddress()}
      </Grid>

      {mode === 'both' && (
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {activeMode === 'simple' ? renderStructuredAddress() : renderSimpleAddress()}
            </Grid>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
