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

import { CustomModifierInput } from './CustomModifierInput';

interface PriceModifier {
  id: string;
  name: string;
  type: 'discount' | 'surcharge';
  value: number;
  description: string;
  isCustom?: boolean;
  min?: number;
  max?: number;
}

interface PriceModifierSectionProps {
  modifiers: PriceModifier[];
  selectedModifiers: string[];
  customModifierValues: { [key: string]: number };
  onModifierToggle: (modifierId: string) => void;
  onCustomValueChange: (modifierId: string, value: number) => void;
  disabled?: boolean;
}

/**
 * Компонент для секції модифікаторів ціни
 *
 * FSD принципи:
 * - Тільки UI логіка для відображення модифікаторів
 * - Отримує дані та обробники через пропси
 * - Не містить бізнес-логіки розрахунків
 */
export const PriceModifierSection: React.FC<PriceModifierSectionProps> = ({
  modifiers,
  selectedModifiers,
  customModifierValues,
  onModifierToggle,
  onCustomValueChange,
  disabled = false,
}) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Модифікатори ціни</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          {modifiers.map((modifier) => (
            <Box key={modifier.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedModifiers.includes(modifier.id)}
                    onChange={() => !disabled && onModifierToggle(modifier.id)}
                    disabled={disabled}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" component="span">
                      {modifier.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {modifier.description}
                    </Typography>
                  </Box>
                }
              />

              {modifier.isCustom && selectedModifiers.includes(modifier.id) && (
                <CustomModifierInput
                  value={customModifierValues[modifier.id] || 0}
                  onChange={(value) => onCustomValueChange(modifier.id, value)}
                  min={modifier.min}
                  max={modifier.max}
                  show={true}
                  disabled={disabled}
                />
              )}
            </Box>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default PriceModifierSection;
