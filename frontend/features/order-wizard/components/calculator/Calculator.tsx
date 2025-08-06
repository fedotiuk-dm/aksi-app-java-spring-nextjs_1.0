'use client';

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material';
import { useOrderWizardStore } from '@/features/order-wizard';

export const Calculator: React.FC = () => {
  const {
    itemForm,
    isCalculating,
  } = useOrderWizardStore();

  const { selectedService, quantity, modifierCodes } = itemForm;

  // Base price calculation (basePrice is in kopiykas, convert to hryvnias)
  const basePrice = selectedService ? (selectedService.basePrice / 100) * quantity : 0;

  // Calculate modifiers impact
  const modifierImpacts = modifierCodes.map((code) => {
    // This is simplified - in real implementation would get from backend
    const modifierPercent = getModifierPercent(code);
    const impact = basePrice * (modifierPercent / 100);
    return {
      code,
      label: getModifierLabel(code),
      percent: modifierPercent,
      amount: impact,
    };
  });

  // Total price
  const totalModifierAmount = modifierImpacts.reduce((sum, mod) => sum + mod.amount, 0);
  const finalPrice = basePrice + totalModifierAmount;

  if (!selectedService) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Виберіть послугу для розрахунку вартості
        </Typography>
      </Box>
    );
  }

  if (isCalculating) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
          Розрахунок вартості...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Base Price */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">
            {selectedService.nameUa || selectedService.name}
          </Typography>
          <Typography variant="body2">
            {(selectedService.basePrice / 100).toFixed(2)} ₴
          </Typography>
        </Box>
        {quantity > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Кількість: {quantity} шт
            </Typography>
            <Typography variant="body2">
              {basePrice.toFixed(2)} ₴
            </Typography>
          </Box>
        )}
      </Box>

      {/* Modifiers */}
      {modifierImpacts.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>
            Модифікатори:
          </Typography>
          {modifierImpacts.map((modifier) => (
            <Box
              key={modifier.code}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {modifier.label}
                </Typography>
                <Chip
                  label={`${modifier.percent > 0 ? '+' : ''}${modifier.percent}%`}
                  size="small"
                  color={modifier.percent > 0 ? 'warning' : 'success'}
                />
              </Box>
              <Typography variant="body2">
                {modifier.amount > 0 ? '+' : ''}{modifier.amount.toFixed(2)} ₴
              </Typography>
            </Box>
          ))}
        </>
      )}

      {/* Final Price */}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Вартість предмета:
        </Typography>
        <Typography variant="h6" color="primary">
          {finalPrice.toFixed(2)} ₴
        </Typography>
      </Box>

      {/* Additional Info */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          * Остаточна вартість може змінитися після застосування глобальних знижок та терміновості
        </Typography>
      </Box>
    </Box>
  );
};

// Helper functions (in real implementation these would come from backend/constants)
function getModifierPercent(code: string): number {
  const modifierPercents: Record<string, number> = {
    CHILD: -30,
    MANUAL: 20,
    DIRTY: 50,
    URGENT: 100,
    FUR_COLLAR: 30,
    WATERPROOF: 30,
    SILK: 50,
    COMBINED: 100,
    TOYS: 100,
    BW_COLOR: 20,
    WEDDING: 30,
    IRON: 70,
    DYE_AFTER: 50,
    DYE_BEFORE: 100,
    INSERTS: 30,
    PEARL: 30,
    PADDING_FUR: -20,
  };
  return modifierPercents[code] || 0;
}

function getModifierLabel(code: string): string {
  const modifierLabels: Record<string, string> = {
    CHILD: 'Дитячі речі',
    MANUAL: 'Ручна чистка',
    DIRTY: 'Дуже забруднені',
    URGENT: 'Термінова чистка',
    FUR_COLLAR: 'З хутряними елементами',
    WATERPROOF: 'Водовідштовхуюче покриття',
    SILK: 'Натуральний шовк',
    COMBINED: 'Комбіновані вироби',
    TOYS: 'Великі м\'які іграшки',
    BW_COLOR: 'Чорний/світлі тони',
    WEDDING: 'Весільна сукня',
    IRON: 'Прасування шкіри',
    DYE_AFTER: 'Фарбування після чистки',
    DYE_BEFORE: 'Фарбування до чистки',
    INSERTS: 'Зі вставками',
    PEARL: 'Перламутрове покриття',
    PADDING_FUR: 'Дублянка на штучному хутрі',
  };
  return modifierLabels[code] || code;
}