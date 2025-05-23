'use client';

import { LocalOffer, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import React from 'react';

import { CustomModifierInput } from '../molecules/CustomModifierInput';
import { PriceModifier, PriceModifierSelector } from '../molecules/PriceModifierSelector';

export interface ModifierCategory {
  id: string;
  label: string;
  description?: string;
  modifiers: PriceModifier[];
  applicable?: boolean;
  badge?: string;
}

interface PriceModifierPanelProps {
  categories: ModifierCategory[];
  selectedModifiers: string[];
  customValues: Record<string, number>;
  expandedSections: string[];
  onModifierChange: (modifierId: string, checked: boolean, customValue?: number) => void;
  onCustomValueChange: (modifierId: string, value: number) => void;
  onSectionToggle: (sectionId: string) => void;
  disabled?: boolean;
}

/**
 * Компонент для панелі модифікаторів ціни з категоризацією
 */
export const PriceModifierPanel: React.FC<PriceModifierPanelProps> = ({
  categories,
  selectedModifiers,
  customValues,
  expandedSections,
  onModifierChange,
  onCustomValueChange,
  onSectionToggle,
  disabled = false,
}) => {
  return (
    <>
      {categories.map((category) => {
        const isExpanded = expandedSections.includes(category.id);
        const isApplicable = category.applicable !== false;
        const applicableModifiers = category.modifiers.filter((m) => m.applicable !== false);

        if (!isApplicable || applicableModifiers.length === 0) {
          return null;
        }

        return (
          <Accordion
            key={category.id}
            expanded={isExpanded}
            onChange={() => onSectionToggle(category.id)}
            sx={{ mb: 2 }}
            disabled={disabled}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <LocalOffer color="primary" />
                <Typography variant="h6">{category.label}</Typography>
                {category.badge && <Chip label={category.badge} size="small" variant="outlined" />}
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  {applicableModifiers.length} опцій
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {category.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {category.description}
                </Typography>
              )}

              <PriceModifierSelector
                modifiers={applicableModifiers}
                selectedModifiers={selectedModifiers}
                onModifierChange={onModifierChange}
                disabled={disabled}
              />

              {/* Кастомні інпути для обраних модифікаторів */}
              {applicableModifiers.map((modifier) => {
                const isSelected = selectedModifiers.includes(modifier.id);
                const customValue = customValues[modifier.id];

                if (!isSelected || !modifier.customizable) {
                  return null;
                }

                return (
                  <CustomModifierInput
                    key={`${modifier.id}-custom`}
                    value={customValue || modifier.value}
                    onChange={(value) => onCustomValueChange(modifier.id, value)}
                    min={modifier.min}
                    max={modifier.max}
                    label={`Кастомне значення для "${modifier.label}"`}
                    type={modifier.type}
                    disabled={disabled}
                  />
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};
