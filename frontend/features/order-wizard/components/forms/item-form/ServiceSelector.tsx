'use client';

import React from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import type { PriceListItemInfo } from '@/shared/api/generated/priceList';

interface ServiceSelectorProps {
  services: PriceListItemInfo[];
  selectedServiceId: string;
  onServiceSelectAction: (service: PriceListItemInfo) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceId,
  onServiceSelectAction,
  isLoading,
  disabled,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Завантаження послуг...
        </Typography>
      </Box>
    );
  }

  if (services.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Немає доступних послуг для обраної категорії
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {services.map((service) => (
        <Chip
          key={service.id}
          label={`${service.name} - ${(service.basePrice / 100).toFixed(2)}₴`}
          onClick={() => onServiceSelectAction(service)}
          color={selectedServiceId === service.id ? 'primary' : 'default'}
          variant={selectedServiceId === service.id ? 'filled' : 'outlined'}
          disabled={disabled}
        />
      ))}
    </Box>
  );
};