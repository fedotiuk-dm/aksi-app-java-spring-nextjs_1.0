'use client';

import { LocalOffer } from '@mui/icons-material';
import { Box, Typography, Alert } from '@mui/material';
import React from 'react';

import { DiscountTypeSelector, DiscountOption } from '../molecules';

interface DiscountParametersPanelProps {
  // Discount options
  discountOptions: DiscountOption[];
  selectedDiscount: string;
  customPercentage?: number;
  onDiscountChange: (value: string, customPercentage?: number) => void;
  discountError?: string;

  // Restrictions
  hasRestrictedItems?: boolean;
  restrictedItemsCount?: number;
  restrictedItemsMessage?: string;

  // Configuration
  disabled?: boolean;
  compact?: boolean;
  title?: string;
  description?: string;
  allowCustomDiscount?: boolean;
  showRestrictionWarning?: boolean;
}

/**
 * Панель параметрів знижок замовлення
 */
export const DiscountParametersPanel: React.FC<DiscountParametersPanelProps> = ({
  discountOptions,
  selectedDiscount,
  customPercentage = 0,
  onDiscountChange,
  discountError,
  hasRestrictedItems = false,
  restrictedItemsCount = 0,
  restrictedItemsMessage,
  disabled = false,
  compact = false,
  title = 'Знижки',
  description = 'Оберіть тип знижки для замовлення',
  allowCustomDiscount = false,
  showRestrictionWarning = true,
}) => {
  const defaultRestrictedMessage =
    restrictedItemsMessage ||
    (restrictedItemsCount > 0
      ? `У замовленні є ${restrictedItemsCount} послуг, на які знижки не поширюються (прасування, прання, фарбування). Ці послуги будуть виключені зі знижки.`
      : 'Знижки не діють на прасування, прання і фарбування текстилю. Такі послуги будуть виключені зі знижки.');

  return (
    <Box sx={{ p: compact ? 2 : 3 }}>
      {/* Заголовок секції */}
      {!compact && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <LocalOffer color="primary" />
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      )}

      {/* Загальна інформація про обмеження */}
      {showRestrictionWarning && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Важливо:</strong> Знижки не застосовуються до послуг прасування, прання та
            фарбування текстилю.
            {hasRestrictedItems && restrictedItemsCount > 0 && (
              <>
                {' '}
                У поточному замовленні таких послуг: <strong>{restrictedItemsCount}</strong>.
              </>
            )}
          </Typography>
        </Alert>
      )}

      {/* Селектор типу знижки */}
      <DiscountTypeSelector
        options={discountOptions}
        selectedValue={selectedDiscount}
        customPercentage={customPercentage}
        onChange={onDiscountChange}
        disabled={disabled}
        error={discountError}
        title={compact ? 'Тип знижки' : undefined}
        description={compact ? 'Оберіть відповідний тип знижки' : undefined}
        hasRestrictedItems={hasRestrictedItems}
        restrictedItemsMessage={defaultRestrictedMessage}
        allowCustom={allowCustomDiscount}
      />

      {/* Додаткові попередження для конкретних знижок */}
      {selectedDiscount === 'MILITARY' && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Знижка ЗСУ:</strong> Потрібне підтвердження статусу військовослужбовця.
          </Typography>
        </Alert>
      )}

      {selectedDiscount === 'SOCIAL_MEDIA' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Знижка соцмережі:</strong> Застосовується при публікації відгуку або
            рекомендації у соціальних мережах.
          </Typography>
        </Alert>
      )}

      {selectedDiscount === 'EVERCARD' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Еверкард:</strong> Знижка за наявності дисконтної картки Evercard.
          </Typography>
        </Alert>
      )}

      {customPercentage > 0 && selectedDiscount === 'CUSTOM' && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Індивідуальна знижка:</strong> Застосовується {customPercentage}% знижка. Будь
            ласка, вкажіть обґрунтування у примітках до замовлення.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
