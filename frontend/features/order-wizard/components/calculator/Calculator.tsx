'use client';

import React, { useEffect, useState } from 'react';
import type { TypographyProps } from '@mui/material/Typography';
import { Box, Typography, LinearProgress, Alert } from '@mui/material';
import { useOrderWizardStore } from '@/features/order-wizard';
import { useCart } from '@/features/order-wizard/cart/use-cart';
import { useUpdateCartItem } from '@/shared/api/generated/cart';
import {
  useListPriceModifiers,
  useListDiscounts,
  useCalculatePrice,
} from '@/shared/api/generated/pricing';
import { GlobalControls } from './components/GlobalControls';
import { ItemRow } from './components/ItemRow';
import { Totals } from './components/Totals';
import { DetailedBreakdown } from './components/DetailedBreakdown';

export const Calculator: React.FC = () => {
  const { selectedCustomer } = useOrderWizardStore();

  const CURRENCY_SYMBOL = '₴';
  const formatPrice = (kopecks?: number) =>
    `${((kopecks || 0) / 100).toFixed(2)} ${CURRENCY_SYMBOL}`;
  const ROW_BETWEEN_SX = { display: 'flex', justifyContent: 'space-between' } as const;
  const BODY2: TypographyProps['variant'] = 'body2';

  // Cart data
  const { cartQuery, updateGlobalModifiers, recalculate, isUpdatingModifiers, isRecalculating } =
    useCart(!!selectedCustomer);
  const cartData = cartQuery.data;
  const isLoadingCart = cartQuery.isLoading;
  const cartError = cartQuery.error as unknown as Error | undefined;

  const items = cartData?.items || [];
  const pricing = cartData?.pricing;

  // Global modifiers controls
  const currentUrgency = cartData?.globalModifiers?.urgencyType || 'NORMAL';
  const currentDiscountType = cartData?.globalModifiers?.discountType || 'NONE';
  const currentDiscountPct = cartData?.globalModifiers?.discountPercentage ?? undefined;

  const [urgency, setUrgency] = useState<string>(currentUrgency);
  const [discountType, setDiscountType] = useState<string>(currentDiscountType);
  const [discountPct, setDiscountPct] = useState<number | undefined>(currentDiscountPct);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    setUrgency(currentUrgency);
    setDiscountType(currentDiscountType);
    setDiscountPct(currentDiscountPct);
  }, [currentUrgency, currentDiscountType, currentDiscountPct, cartData?.id]);

  useUpdateCartItem(); // ensure hook initialized if needed elsewhere

  // Available discounts and modifiers
  useListDiscounts({});
  useListPriceModifiers({});

  const handleApplyGlobalModifiers = async (): Promise<void> => {
    await updateGlobalModifiers({
      urgencyType: urgency as 'NORMAL' | 'EXPRESS_48H' | 'EXPRESS_24H',
      discountType: discountType as 'NONE' | 'EVERCARD' | 'SOCIAL_MEDIA' | 'MILITARY' | 'OTHER',
      discountPercentage: discountType === 'OTHER' ? (discountPct ?? 0) : undefined,
    });
  };

  // Редагування модифікаторів предмета відбувається у формі ItemForm

  // Build request for detailed pricing (for transparency panel)
  const calculatePriceMutation = useCalculatePrice();
  const canCalculateDetailed = items.length > 0;
  const triggerDetailedCalculation = async (): Promise<void> => {
    if (!canCalculateDetailed) return;
    await calculatePriceMutation.mutateAsync({
      data: {
        items: items.map((it) => ({
          priceListItemId: it.priceListItemId,
          quantity: it.quantity,
          characteristics: it.characteristics,
          modifierCodes: (it.modifiers || []).map((m) => m.code),
        })),
        globalModifiers: {
          urgencyType: urgency as 'NORMAL' | 'EXPRESS_48H' | 'EXPRESS_24H',
          discountType: discountType as 'NONE' | 'EVERCARD' | 'SOCIAL_MEDIA' | 'MILITARY' | 'OTHER',
          discountPercentage: discountType === 'OTHER' ? (discountPct ?? 0) : undefined,
        },
      },
    });
  };

  useEffect(() => {
    if (showDetails) {
      // Auto-refresh detailed calculation when inputs change
      void triggerDetailedCalculation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDetails, items.length, urgency, discountType, discountPct]);

  const onRecalculate = async () => {
    await recalculate();
    if (showDetails) await triggerDetailedCalculation();
  };

  const restrictedDiscountCategories = new Set(['IRONING', 'LAUNDRY', 'DYEING']);

  if (!selectedCustomer) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Виберіть клієнта для розрахунку вартості
        </Typography>
      </Box>
    );
  }

  if (cartError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Помилка завантаження даних калькулятора
      </Alert>
    );
  }

  if (isLoadingCart) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
          Завантаження розрахунків...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Додайте предмети для розрахунку вартості
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <GlobalControls
        urgency={urgency}
        discountType={discountType}
        discountPct={discountPct}
        onUrgencyChange={setUrgency}
        onDiscountTypeChange={setDiscountType}
        onDiscountPctChange={setDiscountPct}
        onApplyGlobalModifiers={handleApplyGlobalModifiers}
        onRecalculate={onRecalculate}
        showDetails={showDetails}
        onToggleDetails={() => setShowDetails((v) => !v)}
        applying={isUpdatingModifiers}
        recalculating={isRecalculating}
      />

      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          formatPrice={formatPrice}
          rowBetweenSx={ROW_BETWEEN_SX}
          body2Variant={BODY2}
          discountType={discountType}
          restrictedDiscountCategories={restrictedDiscountCategories}
        />
      ))}

      {pricing && (
        <Totals
          itemsSubtotal={pricing.itemsSubtotal}
          urgencyAmount={pricing.urgencyAmount}
          discountAmount={pricing.discountAmount}
          formatPrice={formatPrice}
          rowBetweenSx={ROW_BETWEEN_SX}
          body2Variant={BODY2}
        />
      )}

      <DetailedBreakdown
        show={showDetails}
        pending={calculatePriceMutation.isPending}
        data={
          calculatePriceMutation.data as unknown as {
            items: Array<{
              priceListItemId: string;
              itemName: string;
              calculations: {
                baseAmount: number;
                modifiers?: Array<{ code: string; name: string; amount: number }>;
                subtotal: number;
                urgencyModifier?: { code: string; name: string; amount: number };
                discountModifier?: { code: string; name: string; amount: number };
              };
              total: number;
            }>;
            totals: {
              itemsSubtotal: number;
              urgencyAmount: number;
              urgencyPercentage?: number;
              discountAmount: number;
              discountPercentage?: number;
              discountApplicableAmount: number;
              total: number;
              expectedCompletionDate?: string;
              expectedCompletionNote?: string;
            };
            warnings?: string[];
          }
        }
        formatPrice={formatPrice}
        rowBetweenSx={ROW_BETWEEN_SX}
        body2Variant={BODY2}
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          * Всі ціни розраховані бекендом на основі актуальних модифікаторів та правил.
        </Typography>
      </Box>
    </Box>
  );
};
