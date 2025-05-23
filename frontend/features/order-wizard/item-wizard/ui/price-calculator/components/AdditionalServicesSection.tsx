'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import React from 'react';

interface AdditionalService {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface AdditionalServicesSectionProps {
  services: AdditionalService[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
  disabled?: boolean;
}

/**
 * Компонент для секції додаткових послуг
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення додаткових послуг
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const AdditionalServicesSection: React.FC<AdditionalServicesSectionProps> = ({
  services,
  selectedServices,
  onServiceToggle,
  disabled = false,
}) => {
  return (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Додаткові послуги</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1}>
          {services.map((service) => (
            <FormControlLabel
              key={service.id}
              control={
                <Checkbox
                  checked={selectedServices.includes(service.id)}
                  onChange={() => !disabled && onServiceToggle(service.id)}
                  disabled={disabled}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" component="span">
                    {service.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {service.price} грн {service.unit}
                  </Typography>
                </Box>
              }
            />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default AdditionalServicesSection;
