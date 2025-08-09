import React from 'react';
import { Box, Collapse, Divider, LinearProgress, Stack, Typography, Alert } from '@mui/material';

type AppliedModifier = { code: string; name: string; amount: number };

type ItemCalculation = {
  baseAmount: number;
  modifiers?: AppliedModifier[];
  subtotal: number;
  urgencyModifier?: AppliedModifier;
  discountModifier?: AppliedModifier;
};

type Item = {
  priceListItemId: string;
  itemName: string;
  calculations: ItemCalculation;
  total: number;
};

type Totals = {
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

type Props = {
  show: boolean;
  pending: boolean;
  data?: { items: Item[]; totals: Totals; warnings?: string[] };
  formatPrice: (v?: number) => string;
  rowBetweenSx: Record<string, unknown>;
  body2Variant: 'body2' | 'body1' | 'caption' | 'subtitle2' | 'subtitle1' | 'h6';
};

export const DetailedBreakdown: React.FC<Props> = ({
  show,
  pending,
  data,
  formatPrice,
  rowBetweenSx,
  body2Variant,
}) => {
  return (
    <Collapse in={show} unmountOnExit>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Деталізація розрахунку (бекенд калькулятор)
      </Typography>

      {pending && (
        <Box sx={{ py: 1 }}>
          <LinearProgress />
        </Box>
      )}

      {data && (
        <Box>
          {data.warnings && data.warnings.length > 0 && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              {data.warnings.join('; ')}
            </Alert>
          )}

          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <Typography variant={body2Variant}>
              Підсумок предметів: {formatPrice(data.totals.itemsSubtotal)}
            </Typography>
            <Typography variant={body2Variant}>
              Терміновість ({data.totals.urgencyPercentage ?? 0}%):{' '}
              {formatPrice(data.totals.urgencyAmount)}
            </Typography>
            <Typography variant={body2Variant}>
              Знижка ({data.totals.discountPercentage ?? 0}%): -
              {formatPrice(data.totals.discountAmount)}
            </Typography>
            <Typography variant={body2Variant}>
              Сума для знижки: {formatPrice(data.totals.discountApplicableAmount)}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              Разом: {formatPrice(data.totals.total)}
            </Typography>
            {data.totals.expectedCompletionDate && (
              <Typography variant="caption" color="text.secondary">
                Завершення: {new Date(data.totals.expectedCompletionDate).toLocaleString()}{' '}
                {data.totals.expectedCompletionNote
                  ? `(${data.totals.expectedCompletionNote})`
                  : ''}
              </Typography>
            )}
          </Stack>

          {data.items.map((ci) => (
            <Box key={ci.priceListItemId} sx={{ mb: 1.5 }}>
              <Typography variant={body2Variant} fontWeight="medium">
                {ci.itemName}
              </Typography>
              <Stack spacing={0.25} sx={{ ml: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  База × к-сть: {formatPrice(ci.calculations.baseAmount)}
                </Typography>
                {ci.calculations.modifiers && ci.calculations.modifiers.length > 0 && (
                  <Box>
                    {ci.calculations.modifiers.map((m) => (
                      <Box key={m.code} sx={{ ...rowBetweenSx }}>
                        <Typography variant="caption" color="text.secondary">
                          {m.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(m.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary">
                  Підсумок: {formatPrice(ci.calculations.subtotal)}
                </Typography>
                {ci.calculations.urgencyModifier && (
                  <Box sx={{ ...rowBetweenSx }}>
                    <Typography variant="caption" color="text.secondary">
                      Терміновість
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatPrice(ci.calculations.urgencyModifier.amount)}
                    </Typography>
                  </Box>
                )}
                {ci.calculations.discountModifier && (
                  <Box sx={{ ...rowBetweenSx }}>
                    <Typography variant="caption" color="text.secondary">
                      Знижка
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      -{formatPrice(ci.calculations.discountModifier.amount)}
                    </Typography>
                  </Box>
                )}
                <Typography variant={body2Variant} fontWeight="medium">
                  Разом предмет: {formatPrice(ci.total)}
                </Typography>
              </Stack>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>
      )}
    </Collapse>
  );
};
