import React from 'react';
import { Box, Typography, Divider, Alert } from '@mui/material';

type Modifier = { code: string; name: string; categoryRestrictions?: string[] };
type ModifierDetail = { code: string; name: string; amount: number };

type Item = {
  id: string;
  priceListItemId: string;
  priceListItem?: { name?: string; categoryCode?: string };
  quantity: number;
  modifiers?: { code: string }[];
  pricing?: {
    basePrice: number;
    subtotal: number;
    total: number;
    modifierDetails?: ModifierDetail[];
  };
};

type Props = {
  item: Item;
  formatPrice: (value?: number) => string;
  rowBetweenSx: Record<string, unknown>;
  body2Variant: 'body2' | 'body1' | 'caption' | 'subtitle2' | 'subtitle1' | 'h6';
  allModifiers?: Modifier[];
  onToggleItemModifier?: (
    itemId: string,
    code: string,
    checked: boolean,
    existing: string[]
  ) => void | Promise<void>;
  discountType: string;
  restrictedDiscountCategories: Set<string>;
  allowEditModifiers?: boolean;
};

export const ItemRow: React.FC<Props> = ({
  item,
  formatPrice,
  rowBetweenSx,
  body2Variant,
  allModifiers, // eslint-disable-line @typescript-eslint/no-unused-vars
  onToggleItemModifier, // eslint-disable-line @typescript-eslint/no-unused-vars
  discountType,
  restrictedDiscountCategories,
  allowEditModifiers = false, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const category = item.priceListItem?.categoryCode as string | undefined;
  // Редагування модифікаторів винесено у форму, калькулятор лише показує підсумки
  const discountRestricted = category ? restrictedDiscountCategories.has(category) : false;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ ...rowBetweenSx, mb: 1 }}>
        <Typography variant={body2Variant}>{item.priceListItem?.name}</Typography>
        <Typography variant={body2Variant}>{formatPrice(item.pricing?.basePrice)}</Typography>
      </Box>

      {item.quantity > 1 && (
        <Box sx={{ ...rowBetweenSx, mb: 1 }}>
          <Typography variant={body2Variant} color="text.secondary">
            Кількість: {item.quantity}
          </Typography>
          <Typography variant={body2Variant}>{formatPrice(item.pricing?.subtotal)}</Typography>
        </Box>
      )}

      {/* Редагування модифікаторів винесено у форму предмета. У калькуляторі лише відображення. */}

      {item.pricing?.modifierDetails && item.pricing.modifierDetails.length > 0 && (
        <Box sx={{ ml: 2, mt: 1 }}>
          {item.pricing.modifierDetails.map((modifier) => (
            <Box key={modifier.code} sx={{ ...rowBetweenSx, alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {modifier.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatPrice(modifier.amount)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {discountType !== 'NONE' && discountRestricted && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Для категорії {category} знижки не застосовуються (прасування/прання/фарбування).
        </Alert>
      )}

      <Box sx={{ ...rowBetweenSx, mt: 1 }}>
        <Typography variant={body2Variant} fontWeight="medium">
          Разом предмет:
        </Typography>
        <Typography variant={body2Variant} fontWeight="medium">
          {formatPrice(item.pricing?.total)}
        </Typography>
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};
